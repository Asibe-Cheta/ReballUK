import { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard'

export const metadata: Metadata = {
  title: 'Admin Dashboard | REBALL',
  description: 'Admin dashboard for managing REBALL platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 ml-16 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
