"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from 'next-themes';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

export default function MainNavbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isMounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-60 transition-all duration-300 flex ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:bg-black/90 dark:border-gray-800' 
        : 'bg-black/20 backdrop-blur-sm dark:bg-black/30'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* LEFT SIDE: Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {isMounted && (
                <Image
                  src={theme === 'dark' ? "/logos/logo-white.svg" : "/logos/logo-main.svg"}
                  alt="REBALL"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 hover:scale-110"
                />
              )}
              <span className={`font-bold text-lg sm:text-xl ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>REBALL</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`font-medium transition-all duration-300 hover:opacity-70 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}
              >
                Home
              </Link>
              
              <div className="relative group">
                <Link 
                  href="/about" 
                  className={`font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                    isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                  }`}
                >
                  About Us
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className={`absolute top-full left-0 mt-2 w-48 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border ${
                  isScrolled ? 'bg-white/95 border-gray-200 dark:bg-black/95 dark:border-gray-800' : 'bg-white/95 border-gray-200 dark:bg-black/20 dark:border-white/10'
                }`}>
                  <Link href="/about#faq" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                    isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                  }`}>FAQs</Link>
                  <Link href="/about#meet-harry" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                    isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                  }`}>Meet Harry</Link>
                  <Link href="/about#values" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                    isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                  }`}>Our Values</Link>
                </div>
              </div>
              
              <Link 
                href="/programs" 
                className={`font-medium transition-all duration-300 hover:opacity-70 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}
              >
                Programmes
              </Link>
              
              <div className="relative group">
                <Link 
                  href="/programs" 
                  className={`font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                    isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                  }`}
                >
                  Courses
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className={`absolute top-full left-0 mt-2 w-80 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border max-h-96 overflow-y-auto ${
                  isScrolled ? 'bg-white/98 border-gray-200 dark:bg-black/98 dark:border-gray-800' : 'bg-white/95 border-gray-200 dark:bg-black/95 dark:border-white/30'
                }`}>
                  <div className="grid grid-cols-2 gap-1">
                    <Link href="/programs/strikers" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Strikers</Link>
                    <Link href="/programs/wingers" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Wingers</Link>
                    <Link href="/programs/cam" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Central Attacking Midfielders</Link>
                    <Link href="/programs/cm" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Central Midfielders</Link>
                    <Link href="/programs/cdm" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Central Defensive Midfielders</Link>
                    <Link href="/programs/fb" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Full-backs</Link>
                    <Link href="/programs/cb" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                    }`}>Centre-backs</Link>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/services" 
                className={`font-medium transition-all duration-300 hover:opacity-70 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}
              >
                Services
              </Link>
              
              <Link 
                href="/contact" 
                className={`font-medium transition-all duration-300 hover:opacity-70 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* RIGHT SIDE: Theme Toggle, Profile, and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Profile Dropdown */}
            <div className="hidden md:block relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 hover:scale-110"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  isScrolled ? 'bg-gray-200 border-gray-300 dark:bg-white/20 dark:border-white/30' : 'bg-white/20 border-white/30'
                }`}>
                  {user ? (
                    <span className={`font-medium text-sm ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                    }`}>
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <User className={`w-4 h-4 ${
                      isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                    }`} />
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                } ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isProfileOpen && (
                <div className={`absolute top-full right-0 mt-2 w-48 backdrop-blur-md rounded-2xl p-2 z-50 shadow-lg border ${
                  isScrolled ? 'bg-white/95 border-gray-200 dark:bg-black/95 dark:border-gray-800' : 'bg-white/95 border-gray-200 dark:bg-black/20 dark:border-white/10'
                }`}>
                  {user ? (
                    <>
                      <Link href="/dashboard" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black mb-1 flex items-center gap-2 ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                      }`}>
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link href="/profile" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black mb-1 flex items-center gap-2 ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                      }`}>
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link href="/settings" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black mb-1 flex items-center gap-2 ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                      }`}>
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className={`border-t my-1 ${
                        isScrolled ? 'border-gray-200 dark:border-white/20' : 'border-white/20'
                      }`}></div>
                      <button
                        onClick={toggleTheme}
                        className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black w-full text-left flex items-center gap-2 ${
                          isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                        }`}
                      >
                        {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      <div className={`border-t my-1 ${
                        isScrolled ? 'border-gray-200 dark:border-white/20' : 'border-gray-200 dark:border-white/20'
                      }`}></div>
                      <button
                        onClick={handleSignOut}
                        className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black w-full text-left flex items-center gap-2 ${
                          isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black mb-1 ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                      }`}>
                        Sign In
                      </Link>
                      <Link href="/register" className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black mb-1 ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                      }`}>
                        Register
                      </Link>
                      <div className={`border-t my-1 ${
                        isScrolled ? 'border-gray-200 dark:border-white/20' : 'border-gray-200 dark:border-white/20'
                      }`}></div>
                      <button
                        onClick={toggleTheme}
                        className={`block p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-white hover:text-gray-700 dark:hover:text-black w-full text-left flex items-center gap-2 ${
                          isScrolled ? 'text-gray-700 dark:text-white' : 'text-gray-700 dark:text-white'
                        }`}
                      >
                        {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:scale-110"
              >
                {isMounted && theme === 'dark' ? (
                  <Sun className={`h-5 w-5 ${isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'}`} />
                ) : (
                  <Moon className={`h-5 w-5 ${isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'}`} />
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:opacity-80 transition-colors p-2 ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 backdrop-blur-xl border-t ${
              isScrolled ? 'bg-white/95 border-gray-200 dark:bg-black/95 dark:border-gray-800' : 'bg-background-secondary/50 border-white/10'
            }`}>
              
              {/* Mobile Navigation Links */}
              <Link 
                href="/" 
                className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                } hover:text-gray-900 dark:hover:text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/about" 
                className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                } hover:text-gray-900 dark:hover:text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              <Link 
                href="/programs" 
                className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                } hover:text-gray-900 dark:hover:text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Programmes
              </Link>
              
              {/* Mobile Courses Section */}
              <div className="space-y-1">
                <div className={`px-3 py-2 font-medium ${
                  isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                }`}>
                  Courses
                </div>
                <Link 
                  href="/programs/strikers" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Strikers
                </Link>
                <Link 
                  href="/programs/wingers" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wingers
                </Link>
                <Link 
                  href="/programs/cam" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Central Attacking Midfielders
                </Link>
                <Link 
                  href="/programs/cm" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Central Midfielders
                </Link>
                <Link 
                  href="/programs/cdm" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Central Defensive Midfielders
                </Link>
                <Link 
                  href="/programs/fb" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Full-backs
                </Link>
                <Link 
                  href="/programs/cb" 
                  className={`block px-6 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Centre-backs
                </Link>
              </div>
              
              <Link 
                href="/services" 
                className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                } hover:text-gray-900 dark:hover:text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              
              <Link 
                href="/contact" 
                className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors duration-200 ${
                  isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                } hover:text-gray-900 dark:hover:text-white`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Auth Buttons or User Info */}
              {user ? (
                <div className={`pt-4 space-y-2 border-t ${
                  isScrolled ? 'border-gray-200 dark:border-white/10' : 'border-white/10'
                }`}>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      isScrolled ? 'bg-gray-200 border-gray-300 dark:bg-white/20 dark:border-white/30' : 'bg-white/20 border-white/30'
                    }`}>
                      <span className={`font-medium text-sm ${
                        isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'
                      }`}>
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                      }`}>
                        {user.name || user.email?.split('@')[0]}
                      </p>
                      <p className={`text-xs ${
                        isScrolled ? 'text-gray-600 dark:text-white/60' : 'text-white/60'
                      }`}>{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}>
                    Profile
                  </Link>
                  <div className={`border-t my-1 ${
                    isScrolled ? 'border-gray-200 dark:border-white/10' : 'border-white/10'
                  }`}></div>
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center gap-2 ${
                      isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                    } hover:text-gray-900 dark:hover:text-white`}
                  >
                    {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <div className={`border-t my-1 ${
                    isScrolled ? 'border-gray-200 dark:border-white/10' : 'border-white/10'
                  }`}></div>
                  <button
                    onClick={handleSignOut}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md ${
                      isScrolled ? 'text-red-600 dark:text-red-400' : 'text-red-400'
                    } hover:text-red-700 dark:hover:text-red-300`}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className={`pt-4 space-y-2 border-t ${
                  isScrolled ? 'border-gray-200 dark:border-white/10' : 'border-white/10'
                }`}>
                  <Link href="/login" className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}>
                    Sign In
                  </Link>
                  <Link href="/register" className={`block px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md ${
                    isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                  } hover:text-gray-900 dark:hover:text-white`}>
                    Register
                  </Link>
                  <div className={`border-t my-1 ${
                    isScrolled ? 'border-gray-200 dark:border-white/10' : 'border-white/10'
                  }`}></div>
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center gap-2 ${
                      isScrolled ? 'text-gray-700 dark:text-white/70' : 'text-white/70'
                    } hover:text-gray-900 dark:hover:text-white`}
                  >
                    {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
