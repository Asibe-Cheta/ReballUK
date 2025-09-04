"use client"

import { ChevronDown, Play } from "lucide-react";
import Link from "next/link";
import TestimonialsSection from "@/components/ui/testimonials-section";
// import MobileHeader from "@/components/header/mobile-header";

export default function Home() {

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Headers */}
      {/* <MobileHeader /> */}

      {/* Hero Section */}
      <section className="hero min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/hero/video-poster.jpeg"
          >
            <source src="/videos/hero/hero-training.mp4" type="video/mp4" />
            <source src="/videos/hero/hero-training.webm" type="video/webm" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>
        
        {/* Floating orbs - now more subtle over video */}
        <div className="floating-orb w-16 h-16 sm:w-32 sm:h-32 top-10 sm:top-20 left-5 sm:left-10 opacity-30"></div>
        <div className="floating-orb w-12 h-12 sm:w-24 sm:h-24 top-20 sm:top-40 right-10 sm:right-20 opacity-30"></div>
        <div className="floating-orb w-10 h-10 sm:w-20 sm:h-20 bottom-20 sm:bottom-40 left-1/4 opacity-30"></div>

        <div className="container text-center relative z-10 mt-24 sm:mt-28 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-8 sm:mb-12 max-w-4xl mx-auto font-bold leading-tight">
            Do you want to instantly increase your game success?
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            Learn the specific tactical, movement and technical information you need to instantly increase your success in the exact scenarios you face in the game
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 sm:mb-12 max-w-3xl mx-auto">
            {/* Primary CTA Button */}
            <Link href="/register" className="group relative overflow-hidden bg-black hover:bg-gray-900 text-white border-2 border-white hover:border-gray-300 text-lg px-10 py-5 w-full sm:w-auto font-bold transition-all duration-500 hover:scale-105 shadow-2xl rounded-xl min-w-[250px] transform hover:-translate-y-1 inline-block text-center">
              <span className="relative z-10">Register Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
            
            {/* Secondary CTA Button */}
            <Link href="/resources" className="group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-black text-lg px-10 py-5 w-full sm:w-auto font-bold transition-all duration-500 hover:scale-105 shadow-2xl rounded-xl min-w-[250px] transform hover:-translate-y-1 inline-block text-center">
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Play className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                Learn More
              </span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
      </section>


      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}