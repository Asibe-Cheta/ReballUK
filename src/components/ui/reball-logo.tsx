"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
        <div className={`bg-black rounded-lg flex items-center justify-center ${
          size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
        }`}>
          <span className={`text-white font-bold ${
            size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
          }`}>
            R
          </span>
        </div>
        <span className={`font-bold text-black ${
          size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl"
        }`}>
          REBALL
        </span>
      </div>
    )
  }

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  const sizeClasses = {
    sm: {
      container: "w-6 h-6",
      text: "text-xs",
      brandText: "text-lg"
    },
    md: {
      container: "w-8 h-8",
      text: "text-sm",
      brandText: "text-xl"
    },
    lg: {
      container: "w-10 h-10",
      text: "text-lg",
      brandText: "text-2xl"
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`
        ${sizeClasses[size].container}
        ${isDark ? "bg-white" : "bg-black"}
        rounded-lg flex items-center justify-center
        transition-colors duration-200
      `}>
        <span className={`
          ${sizeClasses[size].text}
          ${isDark ? "text-black" : "text-white"}
          font-bold
        `}>
          R
        </span>
      </div>
      
      {/* Brand Text */}
      <span className={`
        ${sizeClasses[size].brandText}
        ${isDark ? "text-white" : "text-black"}
        font-bold
        transition-colors duration-200
      `}>
        REBALL
      </span>
    </div>
  )
}
