import { Form, Input } from 'antd'
import { fromLocalInput, toLocalInput } from '../../forms/datetime'
import { optionalInstantRule, untilRule } from './query'
const inputProps = {
 getValueProps: (value: string | undefined) => ({ value: toLocalInput(value) }),
 normalize: (value: string | undefined) => fromLocalInput(value),
}
export function TimeFilters() {
 return <><Form.Item name="from" label="Từ thời điểm (UTC+7)" rules={[optionalInstantRule]} {...inputProps}><Input type="datetime-local" step="1" /></Form.Item>
  <Form.Item name="until" label="Đến thời điểm (UTC+7, không gồm)" dependencies={['from']} rules={[optionalInstantRule, untilRule]} {...inputProps}><Input type="datetime-local" step="1" /></Form.Item></>
}
