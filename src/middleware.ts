import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"


 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request})
    // we need to know we are in which url
    const url = request.nextUrl

    //redirection startegy
    // if you have token and you are visting '/signin' route, then no need to visit it, visit to dashboard
    if (token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')  ||
            url.pathname.startsWith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

  // return NextResponse.redirect(new URL('/', request.url))
  // If no token and user is trying to access the dashboard, redirect to home
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',  // all paths in dashboard
    '/verify/:path*'
  ]
}