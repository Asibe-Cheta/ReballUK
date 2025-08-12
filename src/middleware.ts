import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth-config"
import { onboardingUtils } from "@/lib/onboarding"

const authMiddleware = NextAuth(authConfig).auth

export default authMiddleware(async function middleware(req) {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth?.user

  // Skip onboarding check for certain paths
  if (onboardingUtils.shouldSkipOnboardingCheck(pathname)) {
    return
  }

  // Only check onboarding for authenticated users on protected routes
  if (isAuthenticated && onboardingUtils.isProtectedRoute(pathname)) {
    try {
      // Check if user needs onboarding
      const userId = req.auth.user.id
      const onboardingStatus = await onboardingUtils.checkOnboardingStatus(userId)
      
      if (onboardingStatus.needsOnboarding) {
        // Redirect to welcome page for onboarding
        const welcomeUrl = new URL("/welcome", req.url)
        welcomeUrl.searchParams.set("callbackUrl", pathname)
        return Response.redirect(welcomeUrl)
      }
    } catch (error) {
      console.error("Onboarding check failed:", error)
      // On error, allow the request to continue rather than breaking the flow
    }
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
