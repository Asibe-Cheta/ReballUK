import { requireCoach } from "@/lib/coach-auth"
import { CoachSidebar } from "@/components/coach/coach-sidebar"
import { CoachHeader } from "@/components/coach/coach-header"

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireCoach()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CoachHeader />
      <div className="flex">
        <CoachSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
