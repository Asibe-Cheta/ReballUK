"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

const logos = [
  {
    name: 'FIFA',
    light: '/images/logos/fifa-black.svg',
    dark: '/images/logos/fifa-white.svg',
    alt: 'FIFA Logo'
  },
  {
    name: 'UEFA Champions League',
    light: '/images/logos/uefa-champions-league-black.svg',
    dark: '/images/logos/uefa-champions-league-white.svg',
    alt: 'UEFA Champions League Logo'
  },
  {
    name: 'Premier League',
    light: '/images/logos/premier-league-black.svg',
    dark: '/images/logos/premier-league-white.svg',
    alt: 'Premier League Logo'
  },
  {
    name: 'La Liga',
    light: '/images/logos/la-liga-black.svg',
    dark: '/images/logos/la-liga-white.svg',
    alt: 'La Liga Logo'
  },
  {
    name: 'Bundesliga',
    light: '/images/logos/bundesliga-black.svg',
    dark: '/images/logos/bundesliga-white.svg',
    alt: 'Bundesliga Logo'
  },
  {
    name: 'Serie A',
    light: '/images/logos/serie-a-black.svg',
    dark: '/images/logos/serie-a-white.svg',
    alt: 'Serie A Logo'
  },
  {
    name: 'Ligue 1',
    light: '/images/logos/ligue-1-black.svg',
    dark: '/images/logos/ligue-1-white.svg',
    alt: 'Ligue 1 Logo'
  },
  {
    name: 'Europa League',
    light: '/images/logos/uefa-europa-league-black.svg',
    dark: '/images/logos/uefa-europa-league-white.svg',
    alt: 'UEFA Europa League Logo'
  }
]

export default function LogoCarousel() {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
            Trusted by football organizations worldwide
          </h3>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white dark:from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white dark:from-black to-transparent z-10"></div>
          
          {/* Logo container with infinite scroll */}
          <div className="flex animate-scroll space-x-16 sm:space-x-24">
            {/* First set of logos */}
            {logos.map((logo, index) => (
              <div key={`first-${index}`} className="flex-shrink-0">
                <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src={theme === 'dark' ? logo.dark : logo.light}
                    alt={logo.alt}
                    width={128}
                    height={80}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to a simple text if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-gray-400 dark:text-gray-600 font-semibold text-sm">${logo.name}</span>`
                      }
                    }}
                  />
                </div>
              </div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {logos.map((logo, index) => (
              <div key={`second-${index}`} className="flex-shrink-0">
                <div className="w-24 sm:w-32 h-16 sm:h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src={theme === 'dark' ? logo.dark : logo.light}
                    alt={logo.alt}
                    width={128}
                    height={80}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<span class="text-gray-400 dark:text-gray-600 font-semibold text-sm">${logo.name}</span>`
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
