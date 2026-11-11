import { useMemo, useState } from 'react'
import { Alert, Button, Card, Descriptions, Drawer, Empty, Select, Space, Statistic, Tag, Typography } from 'antd'
import { ErrorNotice } from '../../components/ErrorNotice'
import { PageChrome } from '../../components/PageChrome'
import {
 dateText, isMissingStudentProfile, useCurriculum, useStudentProfile, useTranscript,
 type TranscriptRecord, type TranscriptTerm,
} from './student'
import {
 bestAttempts, classificationLabel, contribution, gpaText, letterPoints, letters, numberValue,
 pointOf, projectGpa, schemeLabel, type Letter,
} from './results'

const letterColor = (letter?: string) => letter === 'A' ? 'green' : letter === 'B' ? 'cyan' : letter === 'C' ? 'blue' : letter === 'D' ? 'orange' : 'red'
const recordState = (record: TranscriptRecord) => {
 if (!record.passed) return <Tag color="red">Không đạt</Tag>
 if (record.improvement) return <Tag color="gold">Cải thiện</Tag>
 if (record.retake) return <Tag color="blue">Học lại</Tag>
 return <Tag color="green">Đạt</Tag>
}
const chooseLetter = (value: string | undefined) => (value && value in letterPoints ? value as Letter : undefined)
const courseGroupLabel = (group?: string) => group === 'GENERAL' ? 'Đại cương' : group === 'SPECIALIZED' ? 'Chuyên ngành' : 'Bắt buộc'

function ScoreChart({ term, records }: { term: TranscriptTerm; records: TranscriptRecord[] }) {
 const ordered = [...records].sort((left, right) => (left.course?.code ?? '').localeCompare(right.course?.code ?? ''))
 return <section className="score-chart-block" aria-label={`Điểm ${term.name}`}>
  <header className="score-chart-head">
   <div><strong>{term.name}</strong><span>{term.code} · {term.gradedCourses} môn · {term.credits} tín chỉ</span></div>
   <div className="score-chart-gpa"><span>GPA học kỳ</span><strong>{gpaText(term.gpa)}</strong><Tag color="cyan">{classificationLabel(term.classification)}</Tag></div>
  </header>
  <div className="score-chart">
   <div className="score-chart-axis" aria-hidden="true">{['10', '7.5', '5', '2.5', '0'].map((label) => <span key={label}>{label}</span>)}</div>
   <div className="score-chart-plot">
    <span className="score-chart-threshold" aria-hidden="true" />
    <div className="score-chart-bars" role="list" aria-label={`Điểm ${term.name}`}>
     {ordered.map((record) => {
      const score = Math.max(0, Math.min(10, numberValue(record.totalScore)))
      const letter = (record.letterGrade ?? 'F').toLowerCase()
      return <div className="score-bar" role="listitem" key={record.enrollmentId}
       aria-label={`${record.course?.code} · ${gpaText(score)}/10 · ${record.letterGrade ?? '—'}`}
       title={`${record.course?.title ?? record.course?.code} · ${gpaText(score)}/10`}>
       <span className="score-bar-value" style={{ bottom: `calc(${score * 10}% + 5px)` }}>{gpaText(score)}</span>
       <span className={'score-bar-fill letter-' + letter} style={{ height: `${Math.max(2, score * 10)}%` }} />
       <span className="score-bar-code">{record.course?.code}</span>
      </div>
     })}
    </div>
   </div>
  </div>
 </section>
}

export default function ResultsPage() {
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const transcript = useTranscript(student)
 const curriculum = useCurriculum(student)
 const [termFilter, setTermFilter] = useState('all')
 const [chartTerm, setChartTerm] = useState<string | null>(null)
 const [selected, setSelected] = useState<string | null>(null)
 const [futureIds, setFutureIds] = useState<string[]>([])
 const [futureLetters, setFutureLetters] = useState<Record<string, Letter>>({})
 const [improvementIds, setImprovementIds] = useState<string[]>([])
 const [improvementLetters, setImprovementLetters] = useState<Record<string, Letter>>({})

 const records = useMemo(() => transcript.data?.records ?? [], [transcript.data])
 const terms = transcript.data?.terms ?? []
 const summary = transcript.data?.summary
 const chartedTerm = terms.find((term) => term.termId === chartTerm) ?? terms[0]
 const best = useMemo(() => bestAttempts(records), [records])
 const futureCourses = useMemo(() => (curriculum.data?.semesters ?? [])
  .flatMap((semester) => (semester.courses ?? []).map((course) => ({ ...course, semester: semester.index })))
  .filter((course) => course.status === 'NOT_STARTED' || course.status === 'IN_PROGRESS'), [curriculum.data])
 const future = futureCourses.filter((course) => course.courseId && futureIds.includes(course.courseId))
 const improvements = Object.fromEntries(improvementIds.map((id) => [id, improvementLetters[id]]))
 const projection = projectGpa({ records, future, futureLetters, improvements })
 const selectedRecord = records.find((record) => record.enrollmentId === selected)
 const visible = termFilter === 'all' ? records : records.filter((record) => record.term?.id === termFilter)
 const improvementCourses = [...best.values()].sort((left, right) => (left.course?.code ?? '').localeCompare(right.course?.code ?? ''))

 const updateFuture = (ids: string[]) => {
  setFutureIds(ids)
  setFutureLetters((current) => Object.fromEntries(ids.map((id) => [id, current[id] ?? 'B'])))
 }
 const updateFutureLetter = (id: string, value: string | undefined) => setFutureLetters((current) => ({ ...current, [id]: chooseLetter(value) ?? 'B' }))
 const updateImprovements = (ids: string[]) => {
  setImprovementIds(ids)
  setImprovementLetters((current) => Object.fromEntries(ids.map((id) => {
   const letter = chooseLetter(current[id]) ?? chooseLetter(best.get(id)?.letterGrade) ?? 'C'
   return [id, letter]
  })))
 }
 const updateImprovementLetter = (id: string, value: string | undefined) => {
  const fallback = chooseLetter(best.get(id)?.letterGrade) ?? 'C'
  setImprovementLetters((current) => ({ ...current, [id]: chooseLetter(value) ?? fallback }))
 }
 const resetProjection = () => { setFutureIds([]); setFutureLetters({}); setImprovementIds([]); setImprovementLetters({}) }

 if (profile.isFetching && !profile.data) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi xem bảng điểm." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 return <PageChrome eyebrow="KẾT QUẢ HỌC TẬP" title="Bảng điểm và GPA"
  description="Điểm từng môn theo học kỳ, GPA tích lũy và công cụ mô phỏng GPA cho các môn sắp học hoặc học cải thiện.">
  {transcript.isFetching && !transcript.data && <p role="status">Đang tải bảng điểm…</p>}
  {transcript.error && <ErrorNotice error={transcript.error} onRetry={() => { void transcript.refetch() }} />}
  {transcript.data && <>
   <div className="result-summary">
    <Card><Statistic title="GPA tích lũy" value={gpaText(summary?.cumulativeGpa)} suffix="/4" /><Typography.Text type="secondary">{classificationLabel(summary?.classification)} · {summary?.cumulativeCredits ?? 0} tín chỉ</Typography.Text></Card>
    <Card><Statistic title="GPA học kỳ gần nhất" value={gpaText(summary?.latestTermGpa)} suffix="/4" /><Typography.Text type="secondary">{classificationLabel(summary?.latestTermClassification)} · {summary?.latestTermPassedCredits ?? 0} tín chỉ đạt</Typography.Text></Card>
    <Card><Statistic title="Môn đã có điểm" value={summary?.gradedCourses ?? 0} /><Typography.Text type="secondary">{terms.length} học kỳ có điểm</Typography.Text></Card>
    <Card><Statistic title="Xếp loại hiện tại" value={classificationLabel(summary?.classification)} /><Typography.Text type="secondary">Theo thang điểm 4</Typography.Text></Card>
   </div>

   <Card className="score-chart-card" title="Điểm theo học kỳ"
    extra={chartedTerm && <Select aria-label="Chọn học kỳ xem biểu đồ" value={chartedTerm.termId} onChange={setChartTerm} style={{ minWidth: 240 }}
     options={terms.map((term) => ({ value: term.termId ?? '', label: `${term.name} (${term.gradedCourses} môn)` }))} />}>
    <Typography.Paragraph type="secondary" className="score-chart-note">
     Biểu đồ mặc định mở học kỳ gần nhất đã chốt điểm. Trục đứng là điểm thang 10, trục ngang là mã môn; đường nét đứt đánh dấu mức 4.0.
    </Typography.Paragraph>
    {!chartedTerm ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có điểm để vẽ biểu đồ." />
     : <ScoreChart term={chartedTerm} records={records.filter((record) => record.term?.id === chartedTerm.termId)} />}
   </Card>

   <Card className="result-card" title="Bảng điểm theo môn" extra={<Select aria-label="Lọc theo học kỳ" value={termFilter} onChange={setTermFilter} style={{ minWidth: 240 }}
    options={[{ value: 'all', label: `Tất cả học kỳ (${records.length} môn)` }, ...terms.map((term) => ({ value: term.termId ?? '', label: `${term.name} (${term.gradedCourses} môn)` }))]} />}>
    {visible.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Học kỳ này chưa có điểm." /> : <div className="result-list">
     {visible.map((record) => <button type="button" className="result-row" key={record.enrollmentId} onClick={() => setSelected(record.enrollmentId ?? null)}>
      <span className="result-course"><strong>{record.course?.title}</strong><span>{record.course?.code} · {record.course?.credits} TC · {courseGroupLabel(record.courseGroup)}</span></span>
      <span className="result-term">{record.term?.name}<small>{dateText(record.term?.startDate)}</small></span>
      <Tag color={letterColor(record.letterGrade)}>{record.letterGrade ?? '—'}</Tag>
      <span className="result-score">{gpaText(record.totalScore)}/10<small>{pointOf(record.letterGrade)}/4</small></span>
      {recordState(record)}
     </button>)}
    </div>}
   </Card>

   <Card title="Dự tính GPA" extra={<Space><Tag color="purple">Mô phỏng</Tag><Button size="small" onClick={resetProjection} disabled={futureIds.length === 0 && improvementIds.length === 0}>Đặt lại</Button></Space>}>
    <Typography.Paragraph type="secondary">Chọn môn sắp học và điểm chữ kỳ vọng, hoặc chọn môn muốn học cải thiện. Công cụ chỉ ước tính, không ghi điểm vào hệ thống.</Typography.Paragraph>
    {curriculum.error && <Alert type="info" showIcon className="projection-alert" title="Chưa tải được lộ trình môn học"
     description="Có thể mô phỏng phần học cải thiện; phần môn sắp học cần hồ sơ ngành học và lộ trình môn học." />}
    <div className="projection-columns">
     <div>
      <Typography.Title level={5}>Môn sắp học</Typography.Title>
      <Select mode="multiple" className="projection-select" placeholder="Chọn môn từ lộ trình chưa học" value={futureIds} onChange={updateFuture}
       disabled={futureCourses.length === 0} aria-label="Chọn môn sắp học"
       options={futureCourses.map((course) => ({
        value: course.courseId ?? '', label: `HK${course.semester} · ${course.code} · ${course.title} (${course.credits} TC)`,
       }))} />
      {future.length === 0 ? <Typography.Text type="secondary">Chưa chọn môn sắp học.</Typography.Text> : <div className="projection-list">
       {future.map((course) => <div className="projection-row" key={course.courseId}>
        <span><strong>{course.code}</strong> {course.title}<small>{course.credits} tín chỉ</small></span>
        <Select value={futureLetters[course.courseId ?? ''] ?? 'B'} onChange={(value) => updateFutureLetter(course.courseId ?? '', value)} aria-label={`Điểm kỳ vọng ${course.code}`}
         options={letters.map((letter) => ({ value: letter, label: `${letter} · ${letterPoints[letter]}` }))} />
       </div>)}
      </div>}
     </div>
     <div>
      <Typography.Title level={5}>Học cải thiện</Typography.Title>
      <Select mode="multiple" className="projection-select" placeholder="Chọn môn đã có điểm muốn cải thiện" value={improvementIds} onChange={updateImprovements}
       disabled={improvementCourses.length === 0} aria-label="Chọn môn học cải thiện"
       options={improvementCourses.map((record) => ({ value: record.course?.id ?? '', label: `${record.course?.code} · ${record.course?.title} (${record.letterGrade})` }))} />
      {improvementIds.length === 0 ? <Typography.Text type="secondary">Chưa chọn môn học cải thiện.</Typography.Text> : <div className="projection-list">
       {improvementIds.map((id) => {
        const record = best.get(id)
        return <div className="projection-row" key={id}>
         <span><strong>{record?.course?.code}</strong> {record?.course?.title}<small>Hiện tại {record?.letterGrade} · {pointOf(record?.letterGrade)}/4</small></span>
         <Select value={improvementLetters[id]} onChange={(value) => updateImprovementLetter(id, value)} aria-label={`Điểm cải thiện ${record?.course?.code}`}
          options={letters.map((letter) => ({ value: letter, label: `${letter} · ${letterPoints[letter]}` }))} />
        </div>
       })}
      </div>}
     </div>
    </div>
    <div className="projection-result">
     <div><Typography.Text type="secondary">GPA tích lũy dự kiến</Typography.Text><strong>{projection.gpa.toFixed(2)}/4</strong></div>
     <Tag color={projection.delta > 0 ? 'green' : projection.delta < 0 ? 'red' : 'default'}>{projection.delta > 0 ? '+' : ''}{projection.delta.toFixed(2)} so với hiện tại</Tag>
     <span>{projection.credits} tín chỉ · {classificationLabel(projection.classification)}</span>
    </div>
   </Card>
  </>}
  <Drawer open={!!selectedRecord} onClose={() => setSelected(null)} size={520}
   title={selectedRecord ? `${selectedRecord.course?.code} · ${selectedRecord.course?.title}` : 'Chi tiết điểm'}>
   {selectedRecord && <div className="result-detail">
    <Space wrap><Tag color={letterColor(selectedRecord.letterGrade)}>{selectedRecord.letterGrade} · {pointOf(selectedRecord.letterGrade)}/4</Tag>{recordState(selectedRecord)}<Tag>{selectedRecord.term?.name}</Tag></Space>
    <Descriptions column={1} items={[
     { key: 'term', label: 'Học kỳ', children: `${selectedRecord.term?.name ?? '—'} (${dateText(selectedRecord.term?.startDate)} – ${dateText(selectedRecord.term?.endDate)})` },
     { key: 'section', label: 'Lớp học phần', children: selectedRecord.sectionCode ?? '—' },
     { key: 'group', label: 'Nhóm môn', children: courseGroupLabel(selectedRecord.courseGroup) },
     { key: 'scheme', label: 'Cách tính điểm', children: schemeLabel(selectedRecord.scheme) },
     { key: 'credits', label: 'Tín chỉ', children: selectedRecord.course?.credits ?? '—' },
     { key: 'recorded', label: 'Cập nhật gần nhất', children: dateText(selectedRecord.gradedAt) },
    ]} />
    <Typography.Title level={5}>Điểm thành phần</Typography.Title>
    <div className="component-list">
     <div className="component-row component-head"><span>Thành phần</span><span>Trọng số</span><span>Điểm</span><span>Đóng góp</span></div>
     {[
      { key: 'attendance', label: 'Chuyên cần', score: selectedRecord.attendanceScore, weight: selectedRecord.attendanceWeight },
      { key: 'midterm', label: 'Giữa kỳ', score: selectedRecord.midtermScore, weight: selectedRecord.midtermWeight },
      { key: 'final', label: 'Cuối kỳ', score: selectedRecord.finalScore, weight: selectedRecord.finalWeight },
      { key: 'project', label: 'Đồ án', score: selectedRecord.projectScore, weight: selectedRecord.projectWeight },
     ].filter((item) => item.score !== undefined && item.score !== null).map((item) => <div className="component-row" key={item.key}>
      <span>{item.label}</span><span>{Math.round(numberValue(item.weight) * 100)}%</span><span>{gpaText(item.score)}</span><span>{contribution(item.score, item.weight).toFixed(2)}</span>
     </div>)}
    </div>
    <div className="result-total">
     <div><span>Tổng kết thang 10</span><strong>{gpaText(selectedRecord.totalScore)}</strong></div>
     <div><span>Điểm chữ / thang 4</span><strong>{selectedRecord.letterGrade} · {pointOf(selectedRecord.letterGrade)}</strong></div>
     <div><span>Kết quả</span><strong>{selectedRecord.passed ? 'Đạt' : 'Không đạt'}</strong></div>
    </div>
    {selectedRecord.improvement && <Alert type="info" showIcon title="Lần cải thiện điểm" description={`Điểm cao nhất được dùng cho GPA tích lũy. Điểm hiện tại: ${gpaText(selectedRecord.totalScore)}/10.`} />}
    {selectedRecord.retake && <Alert type="info" showIcon title="Lần học lại" description="Môn đã có lần học trước. GPA tích lũy lấy điểm cao nhất trong các lần học." />}
   </div>}
  </Drawer>
 </PageChrome>
}
