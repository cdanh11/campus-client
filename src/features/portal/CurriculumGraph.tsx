import { useLayoutEffect, useRef, useState } from 'react'
import { Alert, Descriptions, Drawer, Space, Tag } from 'antd'
import type { Curriculum, CurriculumCourse } from './student'
import { gpaText } from './results'

type Semester = NonNullable<Curriculum['semesters']>[number]
type Edge = { key: string; x1: number; y1: number; x2: number; y2: number; met: boolean }

const stateLabel: Record<string, string> = { PASSED: 'Đã đạt', FAILED: 'Chưa đạt', IN_PROGRESS: 'Đang học', NOT_STARTED: 'Chưa học' }
const stateTag: Record<string, string> = { PASSED: 'green', FAILED: 'red', IN_PROGRESS: 'blue', NOT_STARTED: 'default' }
const nodeKey = (course: CurriculumCourse) => course.courseId ?? course.code ?? course.title ?? ''

const curve = ({ x1, y1, x2, y2 }: Edge) => {
 const dx = Math.max(30, Math.abs(x2 - x1) / 2)
 return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

export default function CurriculumGraph({ programName, semesters }: { programName?: string; semesters: Semester[] }) {
 const [selected, setSelected] = useState<CurriculumCourse | null>(null)
 const [edges, setEdges] = useState<Edge[]>([])
 const [size, setSize] = useState({ width: 0, height: 0 })
 const graph = useRef<HTMLDivElement>(null)
 const nodes = useRef(new Map<string, HTMLButtonElement>())
 const semesterIndex = new Map<string, number | undefined>()
 for (const semester of semesters) for (const course of semester.courses ?? []) semesterIndex.set(nodeKey(course), semester.index)

 useLayoutEffect(() => {
  const container = graph.current
  if (!container) return
  const measure = () => {
   const base = container.getBoundingClientRect()
   const next: Edge[] = []
   for (const semester of semesters) for (const course of semester.courses ?? []) {
    if (!course.prerequisiteCourseId) continue
    const from = nodes.current.get(course.prerequisiteCourseId)
    const to = nodes.current.get(nodeKey(course))
    if (!from || !to) continue
    const start = from.getBoundingClientRect()
    const end = to.getBoundingClientRect()
    next.push({
     key: course.prerequisiteCourseId + '->' + nodeKey(course),
     x1: start.right - base.left,
     y1: start.top - base.top + start.height / 2,
     x2: end.left - base.left,
     y2: end.top - base.top + end.height / 2,
     met: !!course.prerequisiteSatisfied,
    })
   }
   setEdges(next)
   setSize({ width: container.scrollWidth, height: container.scrollHeight })
  }
  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(container)
  return () => observer.disconnect()
 }, [semesters])

 const register = (key: string) => (node: HTMLButtonElement | null) => {
  if (node) nodes.current.set(key, node)
  else nodes.current.delete(key)
 }

 return <>
  <div className="curriculum-graph-scroll">
   <div className="curriculum-graph" ref={graph}>
    <svg className="curriculum-edges" width={size.width} height={size.height} aria-hidden="true">
     <defs>
      <marker id="curriculum-arrow-met" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
       <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f9e6b" />
      </marker>
      <marker id="curriculum-arrow-missing" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
       <path d="M 0 0 L 10 5 L 0 10 z" fill="#d9534f" />
      </marker>
     </defs>
     {edges.map((edge) => <path key={edge.key} d={curve(edge)} className={'curriculum-edge ' + (edge.met ? 'met' : 'missing')}
      markerEnd={`url(#curriculum-arrow-${edge.met ? 'met' : 'missing'})`} />)}
    </svg>
    {semesters.map((semester) => {
     const courses = semester.courses ?? []
     const credits = courses.reduce((sum, course) => sum + Number(course.credits ?? 0), 0)
     return <section className="curriculum-semester" key={semester.index}>
      <header className="curriculum-semester-head"><strong>Học kỳ {semester.index}</strong><span>{courses.length} môn · {credits} TC</span></header>
      <div className="curriculum-semester-stack">
       {courses.map((course) => {
        const state = course.status ?? 'NOT_STARTED'
        const blocked = !!course.prerequisiteCode && !course.prerequisiteSatisfied
        return <button type="button" key={nodeKey(course)} ref={register(nodeKey(course))}
         className={`curriculum-node status-${state.toLowerCase()}${blocked ? ' is-blocked' : ''}`}
         aria-label={`${course.code} · ${course.title}`} onClick={() => setSelected(course)}>
         <span className="curriculum-node-head"><strong>{course.code}</strong><span>{course.credits ?? 0} TC</span></span>
         <span className="curriculum-node-title">{course.title}</span>
         <span className="curriculum-node-foot">
          <Tag color={stateTag[state] ?? 'default'}>{stateLabel[state] ?? state}</Tag>
          {course.bestLetter && <span className="curriculum-node-score">{course.bestLetter} · {gpaText(course.bestTotal)}/10</span>}
          {course.improvementAttempted && <Tag color="gold">Cải thiện</Tag>}
         </span>
         {course.prerequisiteCode && <span className={`curriculum-prereq ${course.prerequisiteSatisfied ? 'met' : 'missing'}`}>
          {course.prerequisiteSatisfied ? 'Đã học' : 'Chưa học'} {course.prerequisiteCode}
         </span>}
        </button>
       })}
      </div>
     </section>
    })}
   </div>
  </div>
  <div className="curriculum-legend">
   <Space wrap size={[8, 8]}>
    <Tag color="green">Đã đạt</Tag><Tag color="red">Chưa đạt</Tag><Tag color="blue">Đang học</Tag><Tag>Chưa học</Tag>
   </Space>
   <div className="curriculum-legend-edges">
    <span className="curriculum-legend-line" aria-hidden="true" /> Đã học tiên quyết
    <span className="curriculum-legend-line missing" aria-hidden="true" /> Chưa học tiên quyết
   </div>
  </div>
  <Drawer open={!!selected} onClose={() => setSelected(null)} size={440}
   title={selected ? `${selected.code} · ${selected.title}` : 'Chi tiết môn học'}>
   {selected && <div className="curriculum-detail">
    <Space wrap>
     <Tag color={stateTag[selected.status ?? 'NOT_STARTED'] ?? 'default'}>{stateLabel[selected.status ?? 'NOT_STARTED'] ?? selected.status}</Tag>
     <Tag>{selected.credits ?? 0} tín chỉ</Tag>
     <Tag>{selected.courseGroup === 'GENERAL' ? 'Đại cương' : 'Chuyên ngành'}</Tag>
     {programName && <Tag color="purple">{programName}</Tag>}
    </Space>
    <Descriptions column={1} items={[
     { key: 'semester', label: 'Học kỳ dự kiến', children: 'Học kỳ ' + (semesterIndex.get(nodeKey(selected)) ?? '—') },
     { key: 'code', label: 'Mã môn', children: selected.code ?? '—' },
     { key: 'credits', label: 'Tín chỉ', children: selected.credits ?? 0 },
     { key: 'score', label: 'Kết quả tốt nhất', children: selected.bestLetter ? `${selected.bestLetter} · ${gpaText(selected.bestTotal)}/10` : 'Chưa có điểm' },
     { key: 'prerequisite', label: 'Môn tiên quyết', children: selected.prerequisiteCode ? `${selected.prerequisiteCode} · ${selected.prerequisiteTitle ?? ''}` : 'Không có' },
    ]} />
    {selected.prerequisiteCode ? <Alert type={selected.prerequisiteSatisfied ? 'success' : 'warning'} showIcon
     title={selected.prerequisiteSatisfied ? 'Đã đủ điều kiện đăng ký' : 'Chưa đủ điều kiện đăng ký'}
     description={selected.prerequisiteSatisfied
      ? 'Bạn đã học xong môn tiên quyết, nên có thể đăng ký môn này dù kết quả môn tiên quyết đạt hay không đạt.'
      : 'Bạn cần học xong môn ' + selected.prerequisiteCode + ' trước khi đăng ký môn này. Kết quả đạt hay không đạt đều được tính là đã học.'} />
     : <Alert type="info" showIcon title="Không yêu cầu môn tiên quyết" description="Bạn có thể đăng ký môn này ngay khi lớp học phần mở." />}
    {selected.improvementAttempted && <Alert type="info" showIcon title="Đã học cải thiện"
     description="Môn được tính một lần trên lộ trình; điểm cao nhất trong các lần học vẫn được dùng cho GPA tích lũy." />}
   </div>}
  </Drawer>
 </>
}
