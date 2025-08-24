"use client"

import { ArrowRight, Play, Target, Video, TrendingUp, CheckCircle, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import LogoCarousel from "@/components/ui/logo-carousel";
import TestimonialsSection from "@/components/ui/testimonials-section";
import { useState, useRef, useEffect } from "react";
// import MobileHeader from "@/components/header/mobile-header";

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set a timeout to handle video loading issues
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoLoading && !videoError) {
        console.warn('Video loading timeout - falling back to error state');
        setVideoError(true);
        setVideoLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [videoLoading, videoError]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const error = target.error;
    
    if (error) {
      console.error('Video error details:', {
        code: error.code,
        message: error.message,
        MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
        MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
        MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
        MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED
      });
    } else {
      console.error('Video loading failed - no error details available');
    }
    
    setVideoError(true);
    setVideoLoading(false);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  const handleVideoClick = async () => {
    if (videoRef.current && !videoError) {
      try {
        if (isVideoPlaying) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } else {
          await videoRef.current.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.error('Video playback error:', error);
        setVideoError(true);
      }
    }
  };

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

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* REBALL Training Platform Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    Revolutionary 1v1 Scenario Training
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Experience the future of football training with REBALL&apos;s revolutionary SISW and TAV methodologies. Our platform analyzes your exact game scenarios and provides personalized coaching insights.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">SISW Analysis</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Session in Slow-motion with Voiceover - detailed analysis of your training sessions with expert commentary</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">TAV Breakdowns</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Technical Analysis Videos - Match of the Day style analysis of key tactical moments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Position-Specific Training</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tailored programs for Strikers, Wingers, CAM, and Full-backs focusing on exact game scenarios</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/register" className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg">
                    Start Your Training Journey
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column - Video/Visual Element */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-2xl">
                  <div className="relative aspect-video bg-gradient-to-br from-black/20 to-black/40 dark:from-white/20 dark:to-white/40 rounded-2xl overflow-hidden group">
                    {/* Video or Fallback Image */}
                    {!videoError ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover cursor-pointer"
                        loop
                        playsInline
                        poster="/images/hero/video-poster.jpeg"
                        onClick={handleVideoClick}
                        onError={handleVideoError}
                        onLoadedData={handleVideoLoad}
                        preload="metadata"
                      >
                        <source src="/videos/hero/hero-training.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-16 h-16 text-gray-500 dark:text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Video preview unavailable</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Loading State */}
                    {videoLoading && !videoError && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-300 mx-auto mb-2"></div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading video...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Play Button Overlay - Only show if video is available */}
                    {!videoError && !videoLoading && (
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button 
                          onClick={handleVideoClick}
                          className="relative group/play"
                        >
                          <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-black dark:text-white ml-1" />
                          </div>
                          <div className="absolute inset-0 w-16 h-16 bg-white dark:bg-black rounded-full opacity-20 group-hover/play:scale-150 transition-transform duration-500"></div>
                        </button>
                      </div>
                    )}
                    
                    {/* Progress Bar Overlay - Only show if video is playing */}
                    {!videoError && !videoLoading && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-black/20 dark:bg-white/20 transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                        <div className="h-full bg-white dark:bg-black transition-all duration-100" style={{ width: '0%' }}></div>
                      </div>
                    )}
                    
                    {/* Overlay Text */}
                    <div className={`absolute bottom-4 left-4 right-4 transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}>
                      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-xl p-3">
                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">REBALL Training Platform</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Watch how our platform creates personalized training sessions based on your position and skill level</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white dark:text-black" />
                  </div>
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg">
                    <Video className="w-5 h-5 text-black dark:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}