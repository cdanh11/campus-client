import { useEffect, useState, type CSSProperties } from 'react'
import { Typography } from 'antd'
import { clockText, weekdayText, type Enrollment } from './student'
import { campusNow, courseTone, HOUR_HEIGHT, layoutWeek, weekDays } from './timetable-layout'

const percent = (value: number) => `${value}%`

export default function WeekTimetable({ items, anchor }: { items: Enrollment[]; anchor?: Date }) {
 const [now, setNow] = useState(() => new Date())
 useEffect(() => {
  const timer = window.setInterval(() => setNow(new Date()), 60_000)
  return () => window.clearInterval(timer)
 }, [])
 const layout = layoutWeek(items)
 const days = weekDays(anchor ?? now, now)
 const clock = campusNow(now)
 const span = layout.axisEnd - layout.axisStart
 const nowTop = ((clock.minutes - layout.axisStart) / span) * 100
 const style = { '--week-axis-height': `${(span / 60) * HOUR_HEIGHT}px` } as CSSProperties
 return <section className="week-view" aria-label="Thời khóa biểu tuần">
  <div className="week-scroll">
   <div className="week-grid" style={style}>
    <div className="week-corner" aria-hidden="true">Giờ</div>
    {days.map((day) => <div className={'week-head' + (day.today ? ' today' : '')} key={day.weekday}>
     <span>{weekdayText(day.weekday)}</span><small>{day.dateLabel}</small>
    </div>)}
    <div className="week-times" aria-hidden="true">
     {layout.hours.map((hour) => <span className="week-time" key={hour} style={{ top: percent(((hour * 60 - layout.axisStart) / span) * 100) }}>
      {String(hour).padStart(2, '0')}:00
     </span>)}
    </div>
    {days.map((day) => <div className={'week-column' + (day.today ? ' today' : '')} key={day.weekday}>
     {layout.hours.map((hour) => <span className="week-line" key={hour} style={{ top: percent(((hour * 60 - layout.axisStart) / span) * 100) }} />)}
     {layout.blocks.filter((block) => block.day === day.weekday).map((block) => <div
      className={'week-block tone-' + courseTone(block.item.course?.code ?? block.item.course?.title)}
      key={block.item.enrollmentId ?? block.item.sectionId}
      style={{ top: percent(block.top), height: percent(block.height), left: `calc(${percent((block.lane / block.lanes) * 100)} + 3px)`, width: `calc(${percent(100 / block.lanes)} - 6px)` }}
      title={`${block.item.course?.title ?? ''} · ${clockText(block.item.schedule?.startsAt)}–${clockText(block.item.schedule?.endsAt)} · ${block.item.schedule?.room ?? 'Chưa có phòng'}`}>
      <span className="week-block-time">{clockText(block.item.schedule?.startsAt)}–{clockText(block.item.schedule?.endsAt)}</span>
      <span className="week-block-title">{block.item.course?.title}</span>
      <span className="week-block-meta">{block.item.sectionCode}{block.item.schedule?.room ? ` · ${block.item.schedule.room}` : ''}</span>
     </div>)}
     {day.today && clock.minutes >= layout.axisStart && clock.minutes <= layout.axisEnd && <span className="week-now" style={{ top: percent(nowTop) }} aria-hidden="true" />}
    </div>)}
   </div>
  </div>
  {layout.unscheduled.length > 0 && <Typography.Paragraph type="secondary" className="week-note">
   {layout.unscheduled.length} lớp chưa được xếp lịch cố định. Xem chi tiết ở chế độ danh sách.
  </Typography.Paragraph>}
 </section>
}
