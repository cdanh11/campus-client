import { createContext, useContext, type ReactNode } from 'react'
import { useQueries } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import type { RegistryRow } from './resources'
import { lookupPath, type ReferenceKind } from './references'

const options = { staleTime: 5 * 60_000, refetchOnWindowFocus: false }
const batchSize = 100
export type ReferenceRequests = Partial<Record<ReferenceKind, readonly (string | undefined | null)[]>>
type Status = 'loading' | 'error' | 'ready'
interface Labels { row: (kind: ReferenceKind, id: string) => RegistryRow | undefined; status: (kind: ReferenceKind) => Status; tracked: (kind: ReferenceKind) => boolean }
const Context = createContext<Labels | null>(null)
function normalize(requests: ReferenceRequests) {
 return (Object.entries(requests) as [ReferenceKind, ReferenceRequests[ReferenceKind]][]).map(([kind, ids]) => [
  kind, [...new Set((ids ?? []).filter((id): id is string => typeof id === 'string' && id.length > 0))].sort(),
 ] as const).filter((entry): entry is readonly [ReferenceKind, string[]] => entry[1].length > 0)
}
function batches(ids: readonly string[]) {
 const chunks: string[][] = []
 for (let index = 0; index < ids.length; index += batchSize) chunks.push(ids.slice(index, index + batchSize))
 return chunks
}
const queriesFor = (entries: ReturnType<typeof normalize>) => entries.flatMap(([kind, ids]) => batches(ids).map((chunk) => ({
 queryKey: ['reference-labels', kind, chunk],
 queryFn: ({ signal }: { signal: AbortSignal }) => api.request<RegistryRow[]>(lookupPath(kind) + '?ids=' + chunk.join(','), { signal }),
 ...options,
})))
const nestedKinds: ReferenceKind[] = ['course', 'term']
export function ReferenceLabelsProvider({ requests, expandOfferings = false, children }: { requests: ReferenceRequests; expandOfferings?: boolean; children: ReactNode }) {
 const entries = normalize(requests)
 const results = useQueries({ queries: queriesFor(entries) })
 const rows = new Map<string, RegistryRow>()
 const statuses = new Map<ReferenceKind, Status[]>()
 const track = (kind: ReferenceKind, owned: { data?: RegistryRow[]; isError: boolean; isFetching: boolean }[]) => {
  owned.forEach((result) => { if (Array.isArray(result.data)) result.data.forEach((row) => rows.set(kind + ':' + row.id, row)) })
  statuses.set(kind, [...(statuses.get(kind) ?? []), ...owned.map((result) => result.isError ? 'error' : result.isFetching ? 'loading' : 'ready')])
 }
 const consume = (list: ReturnType<typeof normalize>, owned: typeof results) => {
  let cursor = 0
  for (const [kind, ids] of list) { const slice = owned.slice(cursor, cursor + batches(ids).length); cursor += slice.length; track(kind, slice) }
 }
 consume(entries, results)
 const offeringIds = entries.find(([kind]) => kind === 'offering')?.[1] ?? []
 const derived = expandOfferings && offeringIds.length
  ? normalize({ course: [...rows].filter(([key]) => key.startsWith('offering:')).map(([, row]) => String(row.courseId ?? '')), term: [...rows].filter(([key]) => key.startsWith('offering:')).map(([, row]) => String(row.termId ?? '')) })
  : []
 const derivedResults = useQueries({ queries: queriesFor(derived) })
 consume(derived, derivedResults)
 const status = (kind: ReferenceKind): Status => {
  const owned = statuses.get(kind)
  if (owned?.length) return owned.includes('error') ? 'error' : owned.includes('loading') ? 'loading' : 'ready'
  return expandOfferings && offeringIds.length && nestedKinds.includes(kind) ? 'loading' : 'error'
 }
 return <Context.Provider value={{ row: (kind, id) => rows.get(kind + ':' + id), status, tracked: (kind) => statuses.has(kind) || (expandOfferings && offeringIds.length > 0 && nestedKinds.includes(kind)) }}>{children}</Context.Provider>
}
export const useReferenceLabels = () => useContext(Context)
