"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { 
  User, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  ChevronDown,
  Home,
  BarChart3,
  Target,
  Calendar,
  Trophy,
  Users,
  PlayCircle,
  Bell,
  Search
} from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

import ReballLogo from "@/components/ui/reball-logo"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    name: string
    email: string
    profile?: {
      firstName?: string
      lastName?: string
      position?: string
      trainingLevel?: string
    }
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()


  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: true },
    { name: "Bookings", href: "/bookings", icon: Calendar, current: false },
    { name: "Progress", href: "/progress", icon: BarChart3, current: false },
    { name: "Video Analysis", href: "/video-analysis", icon: PlayCircle, current: false },
    { name: "My Bookings", href: "/my-bookings", icon: Target, current: false },
    { name: "Achievements", href: "/achievements", icon: Trophy, current: false },
    { name: "Community", href: "/community", icon: Users, current: false },
  ]

  const userDisplayName = user.profile?.firstName || user.name || "Player"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? "w-16" : "w-64"} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <ReballLogo size="md" />
          )}
          {sidebarCollapsed && (
            <ReballLogo size="sm" className="mx-auto" />
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronDown 
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${sidebarCollapsed ? "rotate-90" : ""}`} 
              />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {!sidebarCollapsed && (
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
              </h3>
            </div>
          )}
          
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className={`${sidebarCollapsed ? "mx-auto" : "mr-3"} w-5 h-5 flex-shrink-0`} />
                {!sidebarCollapsed && item.name}
              </Link>
            ))}
          </div>

          {!sidebarCollapsed && (
            <>
              <div className="mt-8 mb-4">
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quick Stats
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Training Level
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {user.profile?.trainingLevel || "BEGINNER"}
                  </div>
                </div>
                
                <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm font-medium text-green-900 dark:text-green-100">
                    Position
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {user.profile?.position || "GENERAL"}
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? "ml-16" : "ml-64"} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search training sessions, goals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {userDisplayName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.profile?.trainingLevel || "Beginner"}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {userDisplayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {userDisplayName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="mr-3 w-4 h-4" />
                        Profile
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="mr-3 w-4 h-4" />
                        Settings
                      </Link>

                      {/* Dark Mode Toggle */}
                      <button
                        onClick={toggleTheme}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="mr-3 w-4 h-4" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="mr-3 w-4 h-4" />
                            Dark Mode
                          </>
                        )}
                      </button>

                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-3 w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </div>
  )
}
