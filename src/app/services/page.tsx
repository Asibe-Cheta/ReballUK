import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, Video, BookOpen, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - REBALL | Professional Football Training Services",
  description: "Discover REBALL's comprehensive football training services including individual coaching, video analysis, and personalized development programs.",
  keywords: "REBALL, football services, individual coaching, video analysis, football training, player development",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 dark:text-white">
              Our Services
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Comprehensive football training services designed to accelerate your development and maximize your potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Services Coming Soon
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We&apos;re currently developing a comprehensive range of football training services to complement our programs. 
                Stay tuned for exciting new offerings that will take your game to the next level.
              </p>
            </div>

            {/* Service Preview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <Video className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Video Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Detailed video breakdowns of your performance with expert analysis and improvement recommendations.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Individual Coaching
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  One-on-one coaching sessions tailored to your specific needs and development goals.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <BookOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Training Plans
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Customized training programs designed around your schedule and specific areas for improvement.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <MessageSquare className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Progress Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Comprehensive progress monitoring with detailed reports and milestone achievements.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Performance Testing
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Regular assessments to measure improvement and identify areas for continued development.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Goal Setting
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Personalized goal setting and achievement tracking to keep you motivated and focused.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Want to be the first to know?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Sign up for our newsletter to get notified when these services become available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-black hover:bg-gray-800 text-white">
                  <Link href="/register">Join Our Community</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Programs CTA */}
      <section className="py-20 bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Training Journey Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              While we develop our additional services, explore our comprehensive training programs designed for every position.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6">
                <Link href="/programs">View Programs</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
