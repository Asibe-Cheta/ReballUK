import { ArrowRight, Play, Target, Video, TrendingUp, CheckCircle, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";

export default function Home() {
  return (
    <div className="min-h-screen">
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
        <div className="floating-orb w-32 h-32 top-20 left-10 opacity-30"></div>
        <div className="floating-orb w-24 h-24 top-40 right-20 opacity-30"></div>
        <div className="floating-orb w-20 h-20 bottom-40 left-1/4 opacity-30"></div>

        <div className="container text-center relative z-10 mt-20">
          <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl leading-none mb-8">
            Football Training
            Program
          </AnimatedHeroHeading>
          
          <p className="text-xl md:text-2xl text-text-gray dark:text-medium-gray mb-12 max-w-4xl mx-auto font-light">
            Learn the specific tactical, movement and technical information you need to instantly increase your game success in the exact scenarios you face
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="#">Start Training Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="#" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="glass rounded-full px-6 py-3 flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>SISW Analysis</span>
            </div>
            <div className="glass rounded-full px-6 py-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>TAV Breakdowns</span>
            </div>
            <div className="glass rounded-full px-6 py-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>1v1 Mastery</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Track Your Progress Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title font-marker text-left mb-8">Track Your Progress</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                Monitor your 1v1 performance with detailed analytics and personalized insights delivered through our intuitive mobile app and web dashboard.
              </p>
              <p className="text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
                Get real-time feedback on your technique, tactical decisions, and improvement areas. Our AI-powered analysis helps you identify patterns and accelerate your development.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="simple-card p-4">
                  <h4 className="font-semibold mb-2">Success Rate</h4>
                  <p className="text-2xl font-bold text-green-600">87%</p>
                </div>
                <div className="simple-card p-4">
                  <h4 className="font-semibold mb-2">Sessions</h4>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
              </div>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                See Full Dashboard
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="simple-card p-8 max-w-sm w-full">
                <div className="bg-white/5 rounded-2xl p-6">
                  {/* Mobile App UI Preview */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Dashboard</h3>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="glass rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-semibold">Weekly Progress</h4>
                      <span className="text-xs text-green-600">+12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="progress-fill w-3/4"></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="glass rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold mb-3">1v1 Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-text-gray mb-1">Success Rate</p>
                        <p className="text-lg font-bold text-green-600">87%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-gray mb-1">Attempts</p>
                        <p className="text-lg font-bold">156</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="py-2 text-sm">Book Session</Button>
                    <Button variant="outline" size="sm" className="py-2 text-sm">View Analysis</Button>
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
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-marker">What Makes REBALL Different</h2>
            <p className="section-subtitle">Revolutionary training methods that focus on the moments that matter most in football</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* SISW Feature */}
            <div className="glow-card p-8" data-card="sisw">
              <span className="glow"></span>
              <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-6">
                <Video className="w-8 h-8 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">SISW Analysis</h3>
              <p className="text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                Session in Slow-motion with Voiceover - detailed breakdown of your performance with expert commentary
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* TAV Feature */}
            <div className="glow-card p-8" data-card="tav">
              <span className="glow"></span>
              <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">TAV Breakdowns</h3>
              <p className="text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                Technical Analysis Videos with Match of the Day style analysis of key tactical moments
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 1v1 Training */}
            <div className="glow-card p-8" data-card="mastery">
              <span className="glow"></span>
              <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-pure-white dark:text-pure-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1v1 Mastery</h3>
              <p className="text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                Specialized training for the moments that decide games - attacking and defending 1v1 scenarios
              </p>
              <Link href="#" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Training Programs Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title font-marker">Training Programs</h2>
            <p className="section-subtitle">Position-specific 1v1 training designed for your role on the pitch</p>
          </div>

                              <div className="grid md:grid-cols-4 gap-6">
            {/* Strikers */}
            <div className="glow-card p-6" data-card="strikers">
              <span className="glow"></span>
              <h3 className="text-xl font-bold mb-4">Strikers</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 with Keeper</span>
                </li>
              </ul>
            </div>

            {/* Wingers */}
            <div className="glow-card p-6" data-card="wingers">
              <span className="glow"></span>
              <h3 className="text-xl font-bold mb-4">Wingers</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Crossing</span>
                </li>
              </ul>
            </div>

            {/* CAM */}
            <div className="glow-card p-6" data-card="cam">
              <span className="glow"></span>
              <h3 className="text-xl font-bold mb-4">CAM</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Finishing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Crossing</span>
          </li>
              </ul>
            </div>

            {/* Full-backs */}
            <div className="glow-card p-6" data-card="fullbacks">
              <span className="glow"></span>
              <h3 className="text-xl font-bold mb-4">Full-backs</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">1v1 Attacking Crossing</span>
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
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title font-marker text-left mb-8">Meet Harry</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                Founder of REBALL and passionate football coach dedicated to revolutionizing 1v1 training through innovative video analysis and tactical expertise.
              </p>
              <p className="text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
                With years of experience in professional football training, Harry identified the gap in specific 1v1 scenario coaching and created REBALL to fill that void. His unique SISW and TAV methodologies have helped hundreds of players improve their game.
              </p>
              <Link href="mailto:harry@reball.uk" className="inline-flex items-center gap-2 font-semibold hover:opacity-70 transition-opacity">
                Contact Harry: harry@reball.uk
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="glow-card p-4 rounded-3xl max-w-sm relative" data-card="harry-founder">
                <span className="glow"></span>
                <Image 
                  src="/images/about/harry-founder.jpg"
                  alt="Harry - REBALL Founder"
                  width={320}
                  height={320}
                  className="object-cover rounded-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black px-4 py-2 rounded-full text-sm font-semibold">
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
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="section-title font-marker mb-8">Ready to Level Up?</h2>
            <p className="section-subtitle mb-12">Join hundreds of players who have transformed their 1v1 game with REBALL</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="#">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="#">Book a Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
