import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes (starts with these paths)
const protectedRoutes = ['/rooms-page', '/dashboard', '/profile',]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // If not logged in and route is protected → redirect to signin
  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}