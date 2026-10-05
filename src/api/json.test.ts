import { describe, expect, it } from 'vitest'
import { encodeJson, parseJson } from './json'
describe('exact API numbers', () => {
 it('preserves VND, aggregate decimals and 64-bit versions through request serialization', () => {
  const text = '{"amount":9999999999999999999,"total":19999999999999999998.00,"expectedVersion":9223372036854775807,"page":2}'
  const value = parseJson(text) as { amount: bigint; total: unknown; expectedVersion: bigint; page: number }
  expect(value.amount).toBe(9999999999999999999n)
  expect(value.expectedVersion).toBe(9223372036854775807n)
  expect(value.page).toBe(2)
  expect(encodeJson(value)).toBe(text)
 })
 it('rejects malformed JSON instead of silently replacing data', () => {
  expect(() => parseJson('{')).toThrow()
 })
})
