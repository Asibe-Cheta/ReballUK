"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sun, Moon, User, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('click', handleClickOutside)
    handleTheme()

    const observer = new MutationObserver(handleTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('click', handleClickOutside)
      observer.disconnect()
    }
  }, [isMounted])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleLogout = async () => {
    await logout()
    setIsProfileOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-60 transition-all duration-300 flex ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-black/20 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logos/logo-white.svg"
              alt="REBALL"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-white font-bold text-lg sm:text-xl">REBALL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8">
            <Link 
              href="/" 
              className="font-medium transition-all duration-300 hover:opacity-70 text-white px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>
            
            <div className="relative group">
              <Link 
                href="/about" 
                className="font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-white/10"
              >
                About Us
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border border-white/20">
                <Link href="/about#faq" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white">FAQs</Link>
                <Link href="/about#meet-harry" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white">Meet Harry</Link>
                <Link href="/about#values" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white">Our Values</Link>
              </div>
            </div>
            
            <div className="relative group">
              <Link 
                href="#" 
                className="font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-white/10"
              >
                Resources
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border border-white/20">
                <Link href="#" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white">REBALL Academy</Link>
              </div>
            </div>
            
            <Link 
              href="#contact" 
              className="font-medium transition-all duration-300 hover:opacity-70 text-white px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side - Profile Icon */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 text-white hover:scale-110"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                  {user ? (
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-white ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl p-2 z-50 shadow-lg border border-white/20">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white mb-1 flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white mb-1 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link href="/settings" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white mb-1 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white mb-1">
                        Sign In
                      </Link>
                      <Link href="/register" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white mb-1">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
