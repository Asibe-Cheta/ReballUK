"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image"

interface ReballLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function ReballLogo({ size = "md", className = "" }: ReballLogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Image
          src="/logos/logo-black.svg"
          alt="REBALL"
          width={size === "sm" ? 24 : size === "lg" ? 40 : 32}
          height={size === "sm" ? 24 : size === "lg" ? 40 : 32}
          className="transition-opacity duration-200"
        />
      </div>
    )
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  const sizeClasses = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 }
  }

  const { width, height } = sizeClasses[size]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Image
        src={isDark ? "/logos/logo-white.svg" : "/logos/logo-black.svg"}
        alt="REBALL"
        width={width}
        height={height}
        className="transition-opacity duration-200"
      />
    </div>
  )
}
