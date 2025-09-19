'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  UserCheck,
  Settings,
  FileText,
  Calendar,
  Shield
} from 'lucide-react'
import ReballLogo from '@/components/ui/reball-logo'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Player Management',
    href: '/admin/players',
    icon: Users,
  },
  {
    name: 'Profile Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Profile Submissions',
    href: '/admin/profiles',
    icon: UserCheck,
  },
  {
    name: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'Create Coach',
    href: '/admin/create-coach',
    icon: Shield,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [sidebarHovered, setSidebarHovered] = useState(false)

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
        sidebarHovered ? "w-64" : "w-16"
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16`}
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarHovered ? (
            <ReballLogo size="md" />
          ) : (
            <ReballLogo size="sm" className="mx-auto" />
          )}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                <item.icon className={`${sidebarHovered ? "mr-3" : "mx-auto"} h-5 w-5`} />
                {sidebarHovered && item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
