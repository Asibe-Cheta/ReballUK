import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, Play, BookOpen, Award, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essential 1v1 Attacking CAM Crossing Course - REBALL",
  description: "Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists.",
  keywords: "REBALL, CAM training, 1v1 attacking, crossing course, football training, CAM development",
};

export default function EssentialCAM1v1AttackingCrossingCourse() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-semibold mb-4">
                Essential Level
              </span>
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm font-semibold ml-2">
                1v1 Attacking Crossing
              </span>
            </div>
            <AnimatedHeroHeading className="font-marker text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 dark:text-white">
              Essential 1v1 Attacking CAM Crossing Course
            </AnimatedHeroHeading>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                <Link href="/register">Enroll Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Course Overview
                </h2>
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game where you&apos;ll learn how to beat defenders on the inside and outside and execute perfect crosses for assists.
                  </p>
                  <p>
                    You&apos;ll also learn about identifying opportunities for early deliveries based on space and techniques for when the defender prevents delivery.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Duration: 4-6 weeks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Level: Essential</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Position: CAM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">Prerequisites: None</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What You&apos;ll Learn
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Master the essential skills every CAM needs for 1v1 attacking
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Beat defenders on the inside and outside
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Learn the techniques to beat defenders in both directions and create crossing opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Decision-making to deal with defender unpredictability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Develop the ability to read defenders and make quick decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Execute perfect crosses to get assists
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Master crossing techniques to deliver assists consistently.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Opportunities for early deliveries
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Identify when to deliver early based on space and positioning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Techniques for when early delivery is prevented
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Learn alternative techniques when defenders block early crossing options.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Improve Your Attacking?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join this essential course and start creating more assists today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6">
                <Link href="/register">Enroll Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                <Link href="/programs">View All Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

