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
        ? 'bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 dark:bg-black/20 dark:border-white/10' 
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
              <span className="text-white font-bold text-lg sm:text-xl dark:text-white">REBALL</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
              <Link 
                href="/" 
                className="font-medium transition-all duration-300 hover:opacity-70 text-white px-4 py-2 rounded-lg hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Home
              </Link>
              
              <div className="relative group">
                <Link 
                  href="/about" 
                  className="font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  About Us
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border border-white/20 dark:bg-black/20 dark:border-white/10">
                  <Link href="/about#faq" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white dark:hover:bg-white dark:hover:text-black">FAQs</Link>
                  <Link href="/about#meet-harry" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white dark:hover:bg-white dark:hover:text-black">Meet Harry</Link>
                  <Link href="/about#values" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white dark:hover:bg-white dark:hover:text-black">Our Values</Link>
                </div>
              </div>
              
              <div className="relative group">
                <Link 
                  href="#" 
                  className="font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
                >
                  Resources
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-lg border border-white/20 dark:bg-black/20 dark:border-white/10">
                  <Link href="#" className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white dark:hover:bg-white dark:hover:text-black">REBALL Academy</Link>
                </div>
              </div>
              
              <Link 
                href="#contact" 
                className="font-medium transition-all duration-300 hover:opacity-70 text-white px-4 py-2 rounded-lg hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* RIGHT SIDE: Theme Toggle, Profile, and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Profile Dropdown */}
            <div className="block relative profile-dropdown">
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
                      <div className="border-t border-white/20 my-1"></div>
                      <button
                        onClick={toggleTheme}
                        className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white w-full text-left flex items-center gap-2"
                      >
                        {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                      <div className="border-t border-white/20 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white w-full text-left flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
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
                      <div className="border-t border-white/20 my-1"></div>
                      <button
                        onClick={toggleTheme}
                        className="block p-3 rounded-lg transition-colors hover:bg-white hover:text-black text-white w-full text-left flex items-center gap-2"
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
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-white/10 text-white hover:scale-110"
              >
                {isMounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-white/80 transition-colors p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background-secondary/50 backdrop-blur-xl border-t border-white/10">
              
              {/* Mobile Navigation Links */}
              <Link 
                href="/" 
                className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                href="/about" 
                className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              <Link 
                href="#" 
                className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              
              <Link 
                href="#contact" 
                className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Auth Buttons or User Info */}
              {user ? (
                <div className="pt-4 space-y-2 border-t border-white/10">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {user.name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-white/60 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md">
                    Profile
                  </Link>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
                  >
                    {isMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {isMounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-white/10">
                  <Link href="/login" className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md">
                    Sign In
                  </Link>
                  <Link href="/register" className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md">
                    Register
                  </Link>
                  <div className="border-t border-white/10 my-1"></div>
                  <button
                    onClick={toggleTheme}
                    className="w-full text-left px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md flex items-center gap-2"
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
