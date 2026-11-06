const localFormat = new Intl.DateTimeFormat('sv-SE', {
 timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
 hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

/** ISO instant → value for `<input type="datetime-local">` in Vietnam time. */
export function toLocalInput(value: unknown): string | undefined {
 if (typeof value !== 'string' || !value) return undefined
 const instant = new Date(value)
 if (Number.isNaN(instant.getTime())) return undefined
 return localFormat.format(instant).replace(' ', 'T')
}

/** `datetime-local` value in Vietnam time → ISO instant (UTC). */
export function fromLocalInput(value: unknown): string | undefined {
 if (typeof value !== 'string' || !value) return undefined
 const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? value + ':00' : value
 const instant = new Date(withSeconds + '+07:00')
 return Number.isNaN(instant.getTime()) ? undefined : instant.toISOString()
}
