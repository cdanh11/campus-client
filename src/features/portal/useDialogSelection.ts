import { useEffect, useRef, useState } from 'react'
// Restore keyboard position after a conditionally mounted dialog is removed.
export function useDialogSelection() {
 const [selected, setSelected] = useState<string>()
 const trigger = useRef<HTMLElement | null>(null)
 const opened = useRef(false)
 useEffect(() => {
  if (selected) { opened.current = true; return }
  if (!opened.current) return
  opened.current = false
  const target = trigger.current?.isConnected ? trigger.current : document.getElementById('main-content')
  target?.focus({ preventScroll: true })
 }, [selected])
 return {
  selected,
  open: (id: string, element: HTMLElement) => { trigger.current = element; setSelected(id) },
  close: () => setSelected(undefined),
 }
}
