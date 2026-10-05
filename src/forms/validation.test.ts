import { describe, expect, it } from 'vitest'
import { codePointLength, trimJava, trimOrganization, validPassword } from './validation'

describe('approved owner form boundaries', () => {
 it('counts Unicode code points without halving the approved emoji limit', () => {
  expect(codePointLength('😀'.repeat(100))).toBe(100)
  expect(codePointLength('Nguyễn Văn A')).toBe(12)
 })
 it('preserves boundary whitespace outside each owner definition', () => {
  expect(trimOrganization('\t\n\r\v\f UNIT \t')).toBe('UNIT')
  expect(trimOrganization('\u0000UNIT\u0000')).toBe('\u0000UNIT\u0000')
  expect(trimJava('\u0000STUDENT\u001f')).toBe('STUDENT')
  expect(trimJava('\u00a0STUDENT\u00a0')).toBe('\u00a0STUDENT\u00a0')
 })
 it('checks password code points and BCrypt UTF-8 bytes without trimming', () => {
  expect(validPassword('a'.repeat(11))).toBe(false)
  expect(validPassword('a'.repeat(12))).toBe(true)
  expect(validPassword('a'.repeat(64))).toBe(true)
  expect(validPassword('a'.repeat(65))).toBe(false)
  expect(validPassword('😀'.repeat(18))).toBe(true)
  expect(validPassword('😀'.repeat(19))).toBe(false)
  expect(validPassword(' '.repeat(12))).toBe(false)
  expect(validPassword(' secret password ')).toBe(true)
 })
})
