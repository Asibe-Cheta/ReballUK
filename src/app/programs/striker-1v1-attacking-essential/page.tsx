import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, Play, BookOpen, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essential 1v1 Attacking Striker Finishing Course - REBALL",
  description: "Learn the specific essential tactical, movement and technical information you need to instantly get more goals in the exact 8 1v1 scenarios you face in the game.",
  keywords: "REBALL, striker training, 1v1 attacking, finishing course, football training, striker development",
};

export default function EssentialStriker1v1AttackingCourse() {
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
                1v1 Attacking
              </span>
            </div>
            <AnimatedHeroHeading className="font-marker text-3xl md:text-4xl lg:text-5xl mb-6 text-gray-900 dark:text-white">
              Essential 1v1 Attacking Striker Finishing Course
            </AnimatedHeroHeading>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Learn the specific essential tactical, movement and technical information you need to instantly get more goals in the exact 8 1v1 scenarios you face in the game
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
                    This essential course is designed specifically for strikers who want to improve their 1v1 attacking abilities and finishing in the box. You&apos;ll learn the fundamental principles that separate good strikers from great ones.
                  </p>
                  <p>
                    Through detailed analysis of the 8 most common 1v1 scenarios strikers face in games, you&apos;ll develop the tactical awareness, movement patterns, and technical skills needed to consistently create and convert goal-scoring opportunities.
                  </p>
                  <p>
                    Perfect for players looking to build a solid foundation in 1v1 attacking play before progressing to our advanced courses.
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
                    <span className="text-gray-700 dark:text-gray-300">Position: Strikers</span>
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
                Master the essential skills every striker needs for 1v1 situations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Tactical Awareness
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Understand when and how to engage in 1v1 situations, reading defender positioning and creating space for shots.
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
                        Movement Patterns
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Learn essential movement techniques to create separation from defenders and position yourself for optimal finishing.
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
                        Technical Skills
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Master the fundamental finishing techniques needed to convert 1v1 opportunities into goals consistently.
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
                        Scenario Analysis
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Study the 8 most common 1v1 scenarios strikers face and learn the optimal approach for each situation.
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
                        Decision Making
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Develop quick decision-making skills to choose the right finishing option based on the specific 1v1 scenario.
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
                        Confidence Building
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Build the mental strength and confidence needed to perform under pressure in crucial 1v1 moments.
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
                Course Modules
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comprehensive coverage of all essential 1v1 attacking scenarios
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Module 1: Introduction to 1v1 Attacking Principles",
                "Module 2: Creating Space and Separation",
                "Module 3: Finishing from Central Positions",
                "Module 4: Finishing from Wide Positions", 
                "Module 5: One-Touch Finishing Techniques",
                "Module 6: Finishing Under Pressure",
                "Module 7: Reading the Goalkeeper",
                "Module 8: Putting It All Together - Game Scenarios"
              ].map((module, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm">
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
              Ready to Improve Your Finishing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join this essential course and start scoring more goals in 1v1 situations today.
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
