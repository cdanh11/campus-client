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
 ] as const)
}
function batches(ids: readonly string[]) {
 const chunks: string[][] = []
 for (let index = 0; index < ids.length; index += batchSize) chunks.push(ids.slice(index, index + batchSize))
 return chunks
}
export function ReferenceLabelsProvider({ requests, children }: { requests: ReferenceRequests; children: ReactNode }) {
 const entries = normalize(requests)
 const queries = entries.flatMap(([kind, ids]) => batches(ids).map((chunk) => ({
  queryKey: ['reference-labels', kind, chunk],
  queryFn: ({ signal }: { signal: AbortSignal }) => api.request<RegistryRow[]>(lookupPath(kind) + '?ids=' + chunk.join(','), { signal }),
  ...options,
 })))
 const results = useQueries({ queries })
 const rows = new Map<string, RegistryRow>()
 const statuses = new Map<ReferenceKind, Status>()
 let cursor = 0
 for (const [kind, ids] of entries) {
  const owned = results.slice(cursor, cursor + batches(ids).length)
  cursor += owned.length
  owned.forEach((result) => { if (Array.isArray(result.data)) result.data.forEach((row) => rows.set(kind + ':' + row.id, row)) })
  statuses.set(kind, owned.some((result) => result.isError) ? 'error' : owned.some((result) => result.isFetching) ? 'loading' : 'ready')
 }
 return <Context.Provider value={{
  row: (kind, id) => rows.get(kind + ':' + id),
  status: (kind) => statuses.get(kind) ?? 'error',
  tracked: (kind) => statuses.has(kind),
 }}>{children}</Context.Provider>
}
export const useReferenceLabels = () => useContext(Context)
