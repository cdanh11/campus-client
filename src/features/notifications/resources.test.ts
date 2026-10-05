import { expect, it } from 'vitest'
import { templates, notices } from './resources'
import { encodeJson } from '../../api/json'
it('creates a notice solely from its template and cannot overwrite immutable references/status on edit', () => {
 expect(notices.body({ templateId: 't', title: 'ignored', body: 'ignored', status: 'PUBLISHED' })).toEqual({ templateId: 't' })
 expect(notices.body({ templateId: 'other', title: 'Tiêu đề', body: 'Nội dung', status: 'PUBLISHED' }, { id: 'n', rowVersion: 9223372036854775806n })).toEqual({ title: 'Tiêu đề', body: 'Nội dung', expectedVersion: 9223372036854775806n })
 expect(notices.readOnly!({ id: 'n', rowVersion: 1, status: 'PUBLISHED' })).toBe(true)
})
it('preserves exact template versions and plain-text content in the owner update payload', () => {
 const body = templates.body({ code: 'T01', name: 'Mẫu', title: 'Tiêu đề', body: '<script>text only</script>', status: 'INACTIVE' }, { id: 't', rowVersion: 9223372036854775807n })
 expect(encodeJson(body)).toContain('"expectedVersion":9223372036854775807')
 expect(body).toMatchObject({ body: '<script>text only</script>', status: 'INACTIVE' })
})
