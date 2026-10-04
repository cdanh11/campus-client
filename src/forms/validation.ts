import type { Rule } from 'antd/es/form'

// Organization trims exactly six ASCII whitespace characters; people use Java String.trim().
export function trimOrganization(value: string): string { return value.replace(/^[ \t\n\r\v\f]+|[ \t\n\r\v\f]+$/g, '') }
export function trimJava(value: string): string {
 let begin = 0
 let end = value.length
 while (begin < end && value.charCodeAt(begin) <= 32) begin++
 while (end > begin && value.charCodeAt(end - 1) <= 32) end--
 return value.slice(begin, end)
}
export function codePointLength(value: string): number { return Array.from(value).length }

export function nameRule(min: number, max: number, trim = trimJava): Rule {
 return { validator: async (_rule, value: unknown) => {
  const length = typeof value === 'string' ? codePointLength(trim(value)) : 0
  if (length < min || length > max) throw new Error('Nhập từ ' + min + ' đến ' + max + ' ký tự.')
 } }
}

export function validPassword(value: string): boolean {
 const length = codePointLength(value)
 // Java Character.isWhitespace (non-breaking spaces are deliberately excluded).
 const whitespace = new Set(Array.from('\t\n\v\f\r \u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200a\u2028\u2029\u205f\u3000'))
 const blank = Array.from(value).every((character) => {
  const code = character.charCodeAt(0)
  return whitespace.has(character) || (code >= 0x1c && code <= 0x1f)
 })
 return !blank && length >= 12 && length <= 64 && new TextEncoder().encode(value).length <= 72
}
export const passwordRule: Rule = { validator: async (_rule, value: unknown) => {
 if (typeof value !== 'string' || !validPassword(value)) throw new Error('Mật khẩu cần 12–64 ký tự, tối đa 72 byte UTF-8 và không chỉ gồm khoảng trắng.')
} }
export const contactEmailRule: Rule = { validator: async (_rule, value: unknown) => {
 if (value === undefined || value === null || value === '') return
 if (typeof value !== 'string') throw new Error('Email không hợp lệ.')
 const normalized = trimJava(value)
 if (!normalized) return
 if (normalized.length > 320 || !normalized.includes('@')) throw new Error('Email cần có @ và tối đa 320 ký tự.')
} }
