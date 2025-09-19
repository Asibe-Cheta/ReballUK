"use client"

import { usePathname } from "next/navigation"
import MainNavbar from "@/components/navbar/main-navbar"
import Footer from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're on a dashboard page
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                         pathname?.startsWith('/coach') || 
                         pathname?.startsWith('/admin') ||
                         pathname?.startsWith('/bookings') ||
                         pathname?.startsWith('/progress') ||
                         pathname?.startsWith('/video-analysis') ||
                         pathname?.startsWith('/my-bookings') ||
                         pathname?.startsWith('/profile') ||
                         pathname?.startsWith('/settings') ||
                         pathname?.startsWith('/1v1-scenarios') ||
                         pathname?.startsWith('/training')

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardPage && <MainNavbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboardPage && <Footer />}
    </div>
  )
}
