import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const SECRET_STR = process.env.AUTH_SECRET || 'dev-only-change-me-in-production-please'
const SECRET = new TextEncoder().encode(SECRET_STR)
const COOKIE_NAME = 'udc_admin'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function hashPassword(pw) {
  return bcrypt.hash(pw, 10)
}

export async function verifyPassword(pw, hash) {
  return bcrypt.compare(pw, hash)
}

export async function signAdminToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (_) {
    return null
  }
}

export async function setAuthCookie(token) {
  const c = await cookies()
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function clearAuthCookie() {
  const c = await cookies()
  c.set(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
}

export async function getCurrentAdmin() {
  const c = await cookies()
  const token = c.get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifyAdminToken(token)
}

export const AUTH_COOKIE = COOKIE_NAME
