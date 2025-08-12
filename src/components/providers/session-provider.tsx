"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

export default function AuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  // Debug logging
  console.log("SessionProvider - Session:", session ? {
    user: session.user ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
    expires: session.expires
  } : null);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
