import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, Play, BookOpen, Award, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced 1v1 Attacking Striker Finishing Course - REBALL",
  description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goalscorer in the exact 8 1v1 scenarios you face in the game.",
  keywords: "REBALL, striker training, advanced 1v1 attacking, finishing course, football training, striker development",
};

export default function AdvancedStriker1v1AttackingCourse() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-semibold mb-4">
                Advanced Level
              </span>
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm font-semibold ml-2">
                1v1 Attacking
              </span>
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full text-sm font-semibold">
                  <Lock className="w-4 h-4" />
                  Requires Essential Course
                </span>
              </div>
            </div>
            <AnimatedHeroHeading className="font-marker text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 dark:text-white">
              Advanced 1v1 Attacking Striker Finishing Course
            </AnimatedHeroHeading>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goalscorer in the exact 8 1v1 scenarios you face in the game
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

      {/* Prerequisites Section */}
      <section className="py-12 bg-orange-50 dark:bg-orange-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800">
              <Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Prerequisites Required
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                This advanced course requires completion of the Essential 1v1 Attacking Striker Finishing Course first.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/programs/striker-1v1-attacking-essential">
                  Complete Essential Course First
                </Link>
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
                  Advanced Course Overview
                </h2>
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    Building on the essential principles, this advanced course takes your 1v1 attacking abilities to the next level. You&apos;ll master the sophisticated techniques that separate elite strikers from the rest.
                  </p>
                  <p>
                    Through advanced scenario analysis and high-level tactical concepts, you&apos;ll develop the mental and technical skills needed to dominate in any 1v1 situation, regardless of the defender&apos;s approach or the game context.
                  </p>
                  <p>
                    This course is designed for players who have mastered the fundamentals and are ready to become unstoppable goalscorers in 1v1 situations.
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Duration: 6-8 weeks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Level: Advanced</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Position: Strikers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">Prerequisites: Essential Course</span>
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
                Advanced Skills You&apos;ll Master
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Take your 1v1 attacking to elite levels with these advanced techniques
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Elite Tactical Intelligence
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Master advanced reading of game situations, defender psychology, and optimal timing for 1v1 engagements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Advanced Movement Mastery
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Learn sophisticated movement patterns that create maximum separation and optimal finishing angles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Elite Finishing Techniques
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Master advanced finishing techniques including power, placement, and deception to beat any goalkeeper.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Play className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Complex Scenario Mastery
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Handle the most challenging 1v1 scenarios including multiple defenders and high-pressure situations.
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
                        Elite Decision Making
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Develop lightning-fast decision-making skills for complex 1v1 scenarios with multiple options.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Champion Mindset
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Build the mental strength and confidence of elite strikers to perform under the highest pressure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Advanced Course Modules
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Elite-level training covering the most advanced 1v1 attacking concepts
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Module 1: Advanced Tactical Analysis and Game Reading",
                "Module 2: Elite Movement Patterns and Body Positioning",
                "Module 3: Advanced Finishing from All Angles",
                "Module 4: Beating Elite Defenders and Goalkeepers", 
                "Module 5: Advanced Deception and Feinting Techniques",
                "Module 6: High-Pressure 1v1 Situations",
                "Module 7: Complex Multi-Option Scenarios",
                "Module 8: Elite Performance Under Pressure"
              ].map((module, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {module}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Become Unstoppable?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Take your finishing to elite levels with this advanced course designed for serious strikers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6">
                <Link href="/register">Enroll Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                <Link href="/programs">View All Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
