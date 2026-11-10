import { expect, it, vi } from 'vitest'
import { saveCsv } from './ReportPage'

it('prepends a single UTF-8 BOM so spreadsheet tools keep Vietnamese diacritics', async () => {
 const blobs: Blob[] = []
 Object.defineProperty(URL, 'createObjectURL', { configurable: true, writable: true, value: (blob: Blob) => { blobs.push(blob); return 'blob:test' } })
 Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, writable: true, value: vi.fn() })
 const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
 saveCsv('"studentId","name"\r\n"u","Nguyễn Văn A"\r\n', 'STUDENT_DEBT')
 saveCsv('\uFEFFalready-bom', 'STUDENT_DEBT')
 // Blob.text() strips a leading BOM while decoding, so inspect the encoded bytes.
 const first = new Uint8Array(await blobs[0].arrayBuffer())
 expect([...first.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
 expect(new TextDecoder().decode(first)).toBe('"studentId","name"\r\n"u","Nguyễn Văn A"\r\n')
 const second = new Uint8Array(await blobs[1].arrayBuffer())
 expect([...second.slice(0, 3)]).toEqual([0xef, 0xbb, 0xbf])
 expect([...second.slice(3, 6)].map((byte) => String.fromCharCode(byte)).join('')).toBe('alr')
 expect(click).toHaveBeenCalledTimes(2)
})
