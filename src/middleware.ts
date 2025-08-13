import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth-config"

// Use the same auth configuration as the server
const authMiddleware = NextAuth(authConfig).auth

export default authMiddleware(async function middleware(req) {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth?.user

  // Simple route protection without database calls
  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnAuth = pathname.startsWith('/login-simple') || pathname.startsWith('/register-simple')
  const isOnWelcome = pathname.startsWith('/welcome')
  
  // Skip middleware for certain paths
  const skipPaths = [
    "/api",
    "/_next",
    "/favicon.ico",
    "/debug-db.html",
  ]
  
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return
  }

  // Dashboard protection
  if (isOnDashboard && !isAuthenticated) {
    return Response.redirect(new URL('/login-simple', req.url))
  }

  // Auth pages - redirect if already logged in
  if (isOnAuth && isAuthenticated) {
    return Response.redirect(new URL('/dashboard', req.url))
  }

  // Welcome page requires authentication
  if (isOnWelcome && !isAuthenticated) {
    return Response.redirect(new URL('/login-simple', req.url))
  }
})

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
