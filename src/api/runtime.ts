import { QueryClient } from '@tanstack/react-query'
import { ApiClient } from './client'

export const queryClient = new QueryClient({
 defaultOptions: { queries: { retry: false, staleTime: 30_000 }, mutations: { retry: false } },
})
const channel = typeof window.BroadcastChannel !== 'undefined' ? new window.BroadcastChannel('campus-session') : null
export const api = new ApiClient(
 undefined,
 () => queryClient.clear(),
 () => channel?.postMessage({ type: 'session-changed' }),
)
if (channel) channel.onmessage = (event) => {
 // Another tab logged in or out: re-read the shared refresh cookie instead of clearing this tab blindly.
 if (event.data?.type === 'session-changed') void api.restore().catch(() => {})
}
