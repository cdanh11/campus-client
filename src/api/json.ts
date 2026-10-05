import { parse, stringify, LosslessNumber } from 'lossless-json'

// Safe integers remain numbers for page controls; large integers and decimals stay exact.
export function parseJson(text: string): unknown {
 return parse(text, null, (value) => {
  if (/^-?\d+$/.test(value)) {
   const integer = BigInt(value)
   return integer >= BigInt(Number.MIN_SAFE_INTEGER) && integer <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : integer
  }
  return new LosslessNumber(value)
 })
}
export function encodeJson(value: unknown): string { return stringify(value) ?? 'null' }
