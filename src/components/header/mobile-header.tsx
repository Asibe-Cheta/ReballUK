"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Sun, Moon, User, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
      if (!target.closest('.mobile-profile-dropdown')) {
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
    setIsMenuOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20' 
        : 'bg-black/20 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 text-white hover:scale-110"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logos/logo-white.svg"
              alt="REBALL"
              width={32}
              height={32}
              className="w-8 h-8 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-white font-bold text-lg">REBALL</span>
          </Link>

          {/* Profile Icon - Right */}
          <div className="relative mobile-profile-dropdown">
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

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                <Link 
                  href="/" 
                  className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="space-y-1">
                  <div className="p-3 text-white font-medium">About Us</div>
                  <Link 
                    href="/about#faq" 
                    className="block p-3 ml-4 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    FAQs
                  </Link>
                  <Link 
                    href="/about#meet-harry" 
                    className="block p-3 ml-4 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meet Harry
                  </Link>
                  <Link 
                    href="/about#values" 
                    className="block p-3 ml-4 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Our Values
                  </Link>
                </div>
                
                <div className="space-y-1">
                  <div className="p-3 text-white font-medium">Resources</div>
                  <Link 
                    href="#" 
                    className="block p-3 ml-4 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    REBALL Academy
                  </Link>
                </div>
                
                <Link 
                  href="#contact" 
                  className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={toggleTheme}
                  className="w-full p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white flex items-center gap-2"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
