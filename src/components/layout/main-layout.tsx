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
                         pathname?.startsWith('/admin')

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
