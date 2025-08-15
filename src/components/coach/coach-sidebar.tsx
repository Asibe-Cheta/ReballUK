"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Calendar,
  BarChart3,
  MessageSquare,
  Video,
  Settings,
  Home,
  FileText,
  Bell,
  TrendingUp
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/coach/coach-dashboard", icon: Home },
  { name: "Users", href: "/coach/users", icon: Users },
  { name: "Sessions", href: "/coach/sessions", icon: Calendar },
  { name: "Analytics", href: "/coach/analytics", icon: BarChart3 },
  { name: "Communications", href: "/coach/communications", icon: MessageSquare },
  { name: "Content", href: "/coach/content", icon: Video },
  { name: "Reports", href: "/coach/reports", icon: FileText },
  { name: "Notifications", href: "/coach/notifications", icon: Bell },
  { name: "Performance", href: "/coach/performance", icon: TrendingUp },
  { name: "Settings", href: "/coach/settings", icon: Settings },
]

export function CoachSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Coach Portal
        </h2>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
