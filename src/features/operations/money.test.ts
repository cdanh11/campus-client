import { expect, it } from 'vitest'
import { LosslessNumber } from 'lossless-json'
import { encodeJson, parseJson } from '../../api/json'
import { formatVnd, integerVnd, maxVnd, paymentAmount } from './money'
it('preserves nineteen-digit VND through response, form and numeric request JSON', () => {
 const response = parseJson('{"amount":9999999999999999999}') as { amount: bigint }
 expect(integerVnd(response.amount)).toBe(maxVnd)
 expect(paymentAmount(String(response.amount))).toBe(maxVnd)
 expect(encodeJson({ amount: paymentAmount(String(response.amount)) })).toBe('{"amount":9999999999999999999}')
 expect(formatVnd(response.amount)).toBe('9.999.999.999.999.999.999 VND')
})
it('rejects fractional, negative, zero, overflow and already-rounded unsafe Number inputs', () => {
 for (const input of ['0', '-1', '1.5', '1e3', '10000000000000000000', '', ' 1 ']) expect(() => paymentAmount(input)).toThrow()
 expect(() => integerVnd(9007199254740992)).toThrow()
 expect(() => integerVnd(new LosslessNumber('1.5'))).toThrow()
 expect(integerVnd(new LosslessNumber('9007199254740993.0'))).toBe(9007199254740993n)
 expect(integerVnd(0)).toBe(0n)
})
