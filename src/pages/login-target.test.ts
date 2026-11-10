import { expect, it } from 'vitest'
import { loginTarget } from './LoginPage'

it.each([
 [undefined, '/'],
 [null, '/'],
 [42, '/'],
 [{}, '/'],
 [{ from: '/admin/users?page=2' }, '/admin/users?page=2'],
 [{ from: '//evil.test/admin' }, '/'],
 [{ from: 'https://evil.test' }, '/'],
 [{ from: '/login' }, '/'],
 [{ from: '/login?from=x' }, '/'],
 [{ from: '/portal' }, '/portal'],
])('returns a safe internal target for %j', (state, target) => {
 expect(loginTarget(state)).toBe(target)
})
