import { expect, it } from 'vitest'
import { instantNanos } from './instant'
it('compares fractional instants exactly without millisecond rounding', () => {
 expect(instantNanos('2026-12-01T09:00:00.000000001Z') - instantNanos('2026-12-01T09:00:00Z')).toBe(1n)
 expect(instantNanos('2026-12-01T09:00:00.123456789Z') - instantNanos('2026-12-01T09:00:00.123456788Z')).toBe(1n)
 expect(instantNanos('1970-01-01T00:00:00Z')).toBe(0n)
 expect(instantNanos('1969-12-31T23:59:59.9Z')).toBe(-100000000n)
})
it('rejects rollover dates, ambiguous local times and overprecision', () => {
 for (const value of ['2026-02-29T00:00:00Z', '2026-13-01T00:00:00Z', '2026-12-01T24:00:00Z', '2026-12-01T00:60:00Z', '2026-12-01T09:00:00', '2026-12-01T09:00:00.1234567890Z', '']) expect(() => instantNanos(value)).toThrow()
 expect(() => instantNanos('2024-02-29T00:00:00Z')).not.toThrow()
})
