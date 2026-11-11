import { useMemo, useState } from 'react'
import { Alert, Descriptions, Drawer, Empty, Segmented, Space, Tag } from 'antd'
import type { Curriculum, CurriculumCourse } from './student'
import { gpaText } from './results'

type Semester = NonNullable<Curriculum['semesters']>[number]
type Filter = 'ALL' | 'GENERAL' | 'MAJOR' | 'SPECIALIZED'

const stateLabel: Record<string, string> = { PASSED: 'Đã đạt', FAILED: 'Chưa đạt', IN_PROGRESS: 'Đang học', NOT_STARTED: 'Chưa học' }
const stateTag: Record<string, string> = { PASSED: 'green', FAILED: 'red', IN_PROGRESS: 'blue', NOT_STARTED: 'default' }
const groupLabel: Record<string, string> = { GENERAL: 'Đại cương', MAJOR: 'Bắt buộc', SPECIALIZED: 'Chuyên ngành' }
const groupTag: Record<string, string> = { GENERAL: 'blue', MAJOR: 'geekblue', SPECIALIZED: 'purple' }
const nodeKey = (course: CurriculumCourse) => course.courseId ?? course.code ?? course.title ?? ''
const groupOf = (course: CurriculumCourse) => (groupLabel[course.courseGroup ?? ''] ? course.courseGroup! : 'MAJOR')

export default function CurriculumGraph({ programName, semesters }: { programName?: string; semesters: Semester[] }) {
 const [selected, setSelected] = useState<CurriculumCourse | null>(null)
 const [filter, setFilter] = useState<Filter>('ALL')
 const semesterIndex = useMemo(() => {
  const map = new Map<string, number | undefined>()
  for (const semester of semesters) for (const course of semester.courses ?? []) map.set(nodeKey(course), semester.index)
  return map
 }, [semesters])
 const counts = useMemo(() => {
  const totals = { ALL: 0, GENERAL: 0, MAJOR: 0, SPECIALIZED: 0 }
  for (const semester of semesters) for (const course of semester.courses ?? []) {
   totals.ALL += 1
   const group = groupOf(course) as Exclude<Filter, 'ALL'>
   totals[group] += 1
  }
  return totals
 }, [semesters])
 const visible = semesters
  .map((semester) => ({ ...semester, courses: (semester.courses ?? []).filter((course) => filter === 'ALL' || groupOf(course) === filter) }))
  .filter((semester) => semester.courses.length > 0)

 return <>
  <div className="curriculum-filters">
   <Segmented<Filter> value={filter} onChange={setFilter} options={[
    { label: `Tất cả (${counts.ALL})`, value: 'ALL' },
    { label: `Đại cương (${counts.GENERAL})`, value: 'GENERAL' },
    { label: `Bắt buộc (${counts.MAJOR})`, value: 'MAJOR' },
    { label: `Chuyên ngành (${counts.SPECIALIZED})`, value: 'SPECIALIZED' },
   ]} />
  </div>
  {visible.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có môn nào trong nhóm này." />}
  <div className="curriculum-roadmap">
   {visible.map((semester) => {
    const credits = semester.courses.reduce((sum, course) => sum + Number(course.credits ?? 0), 0)
    return <section className="curriculum-semester" key={semester.index}>
     <header className="curriculum-semester-head"><strong>Học kỳ {semester.index}</strong><span>{semester.courses.length} môn · {credits} TC</span></header>
     <div className="curriculum-course-grid">
      {semester.courses.map((course) => {
       const state = course.status ?? 'NOT_STARTED'
       const group = groupOf(course)
       const blocked = !!course.prerequisiteCode && !course.prerequisiteSatisfied
       return <button type="button" key={nodeKey(course)}
        className={`curriculum-node status-${state.toLowerCase()}${blocked ? ' is-blocked' : ''}`}
        aria-label={`${course.code} · ${course.title}`} onClick={() => setSelected(course)}>
        <span className="curriculum-node-head"><strong>{course.code}</strong><span>{course.credits ?? 0} TC</span></span>
        <span className="curriculum-node-title">{course.title}</span>
        <span className="curriculum-node-foot">
         <Tag color={stateTag[state] ?? 'default'}>{stateLabel[state] ?? state}</Tag>
         <Tag color={groupTag[group]}>{groupLabel[group]}</Tag>
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
  <div className="curriculum-legend">
   <Space wrap size={[8, 8]}>
    <Tag color="green">Đã đạt</Tag><Tag color="red">Chưa đạt</Tag><Tag color="blue">Đang học</Tag><Tag>Chưa học</Tag>
   </Space>
   <Space wrap size={[8, 8]}>
    <Tag color="blue">Đại cương</Tag><Tag color="geekblue">Bắt buộc</Tag><Tag color="purple">Chuyên ngành</Tag>
    <span className="curriculum-legend-note">Môn có môn tiên quyết hiển thị nhãn “Đã học” hoặc “Chưa học”.</span>
   </Space>
  </div>
  <Drawer open={!!selected} onClose={() => setSelected(null)} size={440}
   title={selected ? `${selected.code} · ${selected.title}` : 'Chi tiết môn học'}>
   {selected && <div className="curriculum-detail">
    <Space wrap>
     <Tag color={stateTag[selected.status ?? 'NOT_STARTED'] ?? 'default'}>{stateLabel[selected.status ?? 'NOT_STARTED'] ?? selected.status}</Tag>
     <Tag>{selected.credits ?? 0} tín chỉ</Tag>
     <Tag color={groupTag[groupOf(selected)]}>{groupLabel[groupOf(selected)]}</Tag>
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
