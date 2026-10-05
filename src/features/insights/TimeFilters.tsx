import { Form, Input } from 'antd'
import { optionalInstantRule, untilRule } from './query'
export function TimeFilters() {
 return <><Form.Item name="from" label="Từ (UTC)" rules={[optionalInstantRule]}><Input placeholder="2026-01-01T00:00:00Z" /></Form.Item><Form.Item name="until" label="Đến (UTC, không gồm)" dependencies={['from']} rules={[optionalInstantRule, untilRule]}><Input placeholder="2027-01-01T00:00:00Z" /></Form.Item></>
}
