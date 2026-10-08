const formatter = new Intl.DateTimeFormat('vi-VN', {
 timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
 hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})

/** Display only: preserve the original API instant, including fractional seconds. */
export function CampusTime({ value }: { value: string | null | undefined }) {
 if (!value) return <>—</>
 const instant = new Date(value)
 if (Number.isNaN(instant.getTime())) return <>—</>
 return <time dateTime={value}>{formatter.format(instant)} (UTC+7)</time>
}
