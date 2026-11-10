import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const pageSizes = [10, 20, 50, 100]
const textLimit = 100

export interface ListState {
 page: number
 size: number
 sort: string
 [key: string]: string | number | undefined
}

interface ListSpec<T> {
 sorts: readonly string[]
 choices?: Partial<Record<keyof T, readonly string[]>>
}

function read<T extends ListState>(defaults: T, spec: ListSpec<T>, params: URLSearchParams): T {
 const next = { ...defaults }
 const page = Number(params.get('page'))
 if (params.has('page') && Number.isSafeInteger(page) && page >= 0 && page <= 1_000_000) next.page = page
 const size = Number(params.get('size'))
 if (pageSizes.includes(size)) next.size = size
 const sort = params.get('sort')
 if (sort && spec.sorts.includes(sort)) next.sort = sort
 for (const key of Object.keys(defaults)) {
  if (key === 'page' || key === 'size' || key === 'sort') continue
  const raw = params.get(key)?.trim()
  if (!raw) continue
  const allowed = spec.choices?.[key as keyof T]
  if (allowed ? allowed.includes(raw) : raw.length <= textLimit) Object.assign(next, { [key]: raw })
 }
 return next
}

// Filter state lives in the URL so a list view survives reload, sharing and deep links.
// Invalid or unknown values fall back to the page defaults instead of failing the request.
export function useListQuery<T extends ListState>(defaults: T, spec: ListSpec<T>): [T, (patch: Partial<T>) => void] {
 const [searchParams, setSearchParams] = useSearchParams()
 const state = read(defaults, spec, searchParams)
 const update = useCallback((patch: Partial<T>) => {
  const next = { ...read(defaults, spec, searchParams), ...patch }
  const params = new URLSearchParams(searchParams)
  for (const key of Object.keys(defaults)) {
   params.delete(key)
   const value = next[key]
   if (value === undefined || value === '' || value === defaults[key]) continue
   params.set(key, String(value))
  }
  if (params.toString() !== searchParams.toString()) setSearchParams(params, { replace: true })
 }, [defaults, spec, searchParams, setSearchParams])
 return [state, update]
}
