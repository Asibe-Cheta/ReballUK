import { auth } from "@/lib/auth-server"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"

export async function requireCoach() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login-simple")
  }

  if (session.user.role !== UserRole.COACH && session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  return session
}

export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login-simple")
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/dashboard")
  }

  return session
}

export function isCoach(userRole: UserRole): boolean {
  return userRole === UserRole.COACH || userRole === UserRole.ADMIN
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN
}
