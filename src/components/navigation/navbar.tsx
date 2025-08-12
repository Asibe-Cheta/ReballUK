"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const navbarClasses = isScrolled 
    ? "navbar-solid" 
    : "navbar-transparent";

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 py-4 ${navbarClasses}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link href="/" className={`flex items-center font-marker text-xl font-bold ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
          <Image 
            src="/logos/logo-black.svg"
            alt="REBALL Logo"
            width={32}
            height={32}
            className={`${isScrolled ? '' : 'hidden'}`}
          />
          <Image 
            src="/logos/logo-white.svg"
            alt="REBALL Logo"
            width={32}
            height={32}
            className={`${isScrolled ? 'hidden' : ''}`}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          <li>
            <Link href="/" className={`font-medium transition-all duration-300 hover:opacity-70 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
              Home
            </Link>
          </li>
          <li className="relative group">
            <Link href="/about" className={`font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
              About Us <ChevronDown className="w-4 h-4" />
            </Link>
            <div className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link href="/about#faq" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">FAQs</Link>
              <Link href="/about#meet-harry" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">Meet Harry</Link>
              <Link href="/about#values" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">Our Values</Link>
            </div>
          </li>
          <li className="relative group">
            <Link href="#" className={`font-medium transition-all duration-300 hover:opacity-70 flex items-center gap-1 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
              Resources <ChevronDown className="w-4 h-4" />
            </Link>
            <div className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <Link href="#" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">REBALL Academy</Link>
            </div>
          </li>
          <li>
            <Link href="#contact" className={`font-medium transition-all duration-300 hover:opacity-70 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
              Contact
            </Link>
          </li>
        </ul>

                  {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 hover:bg-black/10 dark:hover:bg-white/10 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center gap-2">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl p-2 transform -translate-y-2 opacity-0 invisible group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link href="/dashboard" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">
                      Profile
                    </Link>
                    <Link href="/settings" className="block p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white">
                      Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-dark-text dark:text-pure-white flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className={`hidden md:inline font-medium transition-all duration-300 hover:opacity-70 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}>
                  Sign In
                </Link>
                <Button asChild>
                  <Link href="/register">Register Now</Link>
                </Button>
              </>
            )}
          </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 ${isScrolled ? 'text-dark-text dark:text-pure-white' : 'text-pure-white'}`}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </nav>
  );
}