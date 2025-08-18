import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"

export async function requireCoach() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  // For now, allow any authenticated user to access coach pages
  // You can add role-based checks here later if needed
  // if (user.role !== "coach") {
  //   redirect("/unauthorized")
  // }
  
  return user
}
