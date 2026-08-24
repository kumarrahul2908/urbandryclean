import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me-in-production-please')
const COOKIE_NAME = 'udc_admin'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  // Only guard /admin/* pages (not /admin/login and not API routes)
  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    const url = req.nextUrl.clone(); url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    const url = req.nextUrl.clone(); url.pathname = '/admin/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
