import { ArrowRight, Play, Target, Video, TrendingUp, CheckCircle, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import MainHeader from "@/components/header/main-header";
// import MobileHeader from "@/components/header/mobile-header";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Headers */}
      <MainHeader />
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
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-8 sm:mb-12 max-w-4xl mx-auto font-light leading-relaxed">
            For tactical football training and technical information you need to instantly increase your 1v1 success in the exact scenarios you face
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 max-w-lg mx-auto">
            <Button 
              asChild 
              size="default" 
              className="bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300 text-sm px-6 py-3 w-full sm:w-auto font-medium transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <Link href="#">Start Training Now</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="default" 
              className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-black text-sm px-6 py-3 w-full sm:w-auto font-medium transition-all duration-300 hover:scale-105 shadow-sm"
            >
              <Link href="#" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="glass rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2">
              <Video className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>SISW Analysis</span>
            </div>
            <div className="glass rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>TAV Breakdowns</span>
            </div>
            <div className="glass rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>1v1 Mastery</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Track Your Progress Section */}
      <section className="section">
        <div className="container px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <h2 className="section-title font-marker text-left mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl">Track Your Progress</h2>
              <p className="text-lg sm:text-xl text-text-gray dark:text-medium-gray mb-4 sm:mb-6 leading-relaxed">
                Monitor your 1v1 performance with detailed analytics and personalized insights delivered through our intuitive mobile app and web dashboard.
              </p>
              <p className="text-text-gray dark:text-medium-gray mb-6 sm:mb-8 leading-relaxed">
                Get real-time feedback on your technique, tactical decisions, and improvement areas. Our AI-powered analysis helps you identify patterns and accelerate your development.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="simple-card p-3 sm:p-4">
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Success Rate</h4>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">87%</p>
                </div>
                <div className="simple-card p-3 sm:p-4">
                  <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Sessions</h4>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">24</p>
                </div>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
                See Full Dashboard
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="simple-card p-4 sm:p-8 max-w-xs sm:max-w-sm w-full">
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                  {/* Mobile App UI Preview */}
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold">Dashboard</h3>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="glass rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs sm:text-sm font-semibold">Weekly Progress</h4>
                      <span className="text-xs text-green-600">+12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="progress-fill w-3/4"></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="glass rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">1v1 Performance</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <p className="text-xs text-text-gray mb-1">Success Rate</p>
                        <p className="text-base sm:text-lg font-bold text-green-600">87%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-gray mb-1">Attempts</p>
                        <p className="text-base sm:text-lg font-bold">156</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="py-1 sm:py-2 text-xs sm:text-sm">Book Session</Button>
                    <Button variant="outline" size="sm" className="py-1 sm:py-2 text-xs sm:text-sm">View Analysis</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* What Makes REBALL Different Section */}
      <section className="section gradient-bg">
        <div className="container px-4 sm:px-6">
          <div className="section-header">
            <h2 className="section-title font-marker text-2xl sm:text-3xl md:text-4xl">What Makes REBALL Different</h2>
            <p className="section-subtitle text-base sm:text-lg">Revolutionary training methods that focus on the moments that matter most in football</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* SISW Feature */}
            <div className="glow-card p-6 sm:p-8" data-card="sisw">
              <span className="glow"></span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">SISW Analysis</h3>
              <p className="text-text-gray dark:text-medium-gray mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Session in Slow-motion with Voiceover - detailed breakdown of your performance with expert commentary
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
                Learn more
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* TAV Feature */}
            <div className="glow-card p-6 sm:p-8" data-card="tav">
              <span className="glow"></span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">TAV Breakdowns</h3>
              <p className="text-text-gray dark:text-medium-gray mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Technical Analysis Videos with Match of the Day style analysis of key tactical moments
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
                Learn more
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* 1v1 Training */}
            <div className="glow-card p-6 sm:p-8" data-card="mastery">
              <span className="glow"></span>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">1v1 Mastery</h3>
              <p className="text-text-gray dark:text-medium-gray mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Specialized training for the moments that decide games - attacking and defending 1v1 scenarios
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
                Learn more
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Training Programs Section */}
      <section className="section">
        <div className="container px-4 sm:px-6">
          <div className="section-header">
            <h2 className="section-title font-marker text-2xl sm:text-3xl md:text-4xl">Training Programs</h2>
            <p className="section-subtitle text-base sm:text-lg">Position-specific 1v1 training designed for your role on the pitch</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Strikers */}
            <div className="glow-card p-4 sm:p-6" data-card="strikers">
              <span className="glow"></span>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Strikers</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 with Keeper</span>
                </li>
              </ul>
            </div>

            {/* Wingers */}
            <div className="glow-card p-4 sm:p-6" data-card="wingers">
              <span className="glow"></span>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Wingers</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Crossing</span>
                </li>
              </ul>
            </div>

            {/* CAM */}
            <div className="glow-card p-4 sm:p-6" data-card="cam">
              <span className="glow"></span>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">CAM</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Crossing</span>
                </li>
              </ul>
            </div>

            {/* Full-backs */}
            <div className="glow-card p-4 sm:p-6" data-card="fullbacks">
              <span className="glow"></span>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Full-backs</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">1v1 Attacking Crossing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Meet Harry Section */}
      <section className="section gradient-bg">
        <div className="container px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
            <div>
              <h2 className="section-title font-marker text-left mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl">Meet Harry</h2>
              <p className="text-lg sm:text-xl text-text-gray dark:text-medium-gray mb-4 sm:mb-6 leading-relaxed">
                Founder of REBALL and passionate football coach dedicated to revolutionizing 1v1 training through innovative video analysis and tactical expertise.
              </p>
              <p className="text-text-gray dark:text-medium-gray mb-6 sm:mb-8 leading-relaxed">
                With years of experience in professional football training, Harry identified the gap in specific 1v1 scenario coaching and created REBALL to fill that void. His unique SISW and TAV methodologies have helped hundreds of players improve their game.
              </p>
              <Link href="mailto:harry@reball.uk" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
                Contact Harry: harry@reball.uk
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="glow-card p-3 sm:p-4 rounded-3xl max-w-xs sm:max-w-sm relative" data-card="harry-founder">
                <span className="glow"></span>
                <Image 
                  src="/images/about/harry-founder.jpg"
                  alt="Harry - REBALL Founder"
                  width={320}
                  height={320}
                  className="object-cover rounded-2xl"
                />
                <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                  Founder & Coach
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* CTA Section */}
      <section className="section">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="section-title font-marker mb-6 sm:mb-8 text-2xl sm:text-3xl md:text-4xl">Ready to Level Up?</h2>
            <p className="section-subtitle mb-8 sm:mb-12 text-base sm:text-lg">Join hundreds of players who have transformed their 1v1 game with REBALL</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Link href="#">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                <Link href="#">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}