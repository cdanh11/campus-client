const formatter = new Intl.DateTimeFormat('vi-VN', {
 timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
 hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

const instantPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
 timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
})

export const isInstant = (value: unknown): value is string => typeof value === 'string' && instantPattern.test(value)

/** Date only, in campus time (UTC+7). */
export function campusDateText(value: string | null | undefined) {
 if (!value) return '—'
 const date = new Date(value)
 if (Number.isNaN(date.getTime())) return '—'
 return dateFormatter.format(date)
}

/** Display only: preserve the original API instant, including fractional seconds. */
export function campusTimeText(value: string | null | undefined) {
 if (!value) return '—'
 const instant = new Date(value)
 if (Number.isNaN(instant.getTime())) return '—'
 return formatter.format(instant) + ' (UTC+7)'
}

export function CampusTime({ value }: { value: string | null | undefined }) {
 const text = campusTimeText(value)
 if (text === '—') return <>—</>
 return <time dateTime={value ?? undefined}>{text}</time>
}
