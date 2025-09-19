import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Since Firebase Auth is handled client-side, we'll redirect unauthenticated users to login
// The actual auth check happens in the AuthProvider component
export function middleware(request: NextRequest) {
  // Check if the request is for a protected dashboard route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // For Firebase Auth, we'll let the client-side AuthProvider handle the redirect
    // This middleware just ensures the auth context is checked on protected routes

    // Add a header to indicate this is a protected route
    const response = NextResponse.next()
    response.headers.set("x-protected-route", "true")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
