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
              Let&apos;s give you a taste of what your experience would look like with REBALL
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                <Link href="/register">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Experience Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Your REBALL Training Experience
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Firstly, create an account to see your full local training options. Depending on your playing level and the time of year; you will have the option to either join our weekly small group sessions or train on your own in our 1-2-1 sessions.
              </p>
            </div>

            {/* Training Options */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Small Group Sessions
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    The training courses for the weekly small group sessions are already prearranged and sizes are kept to a maximum of 4 players per session to ensure you receive the attention you deserve!
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    1-2-1 Sessions
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    However, if you want to choose the training course and receive all the attention you can get, our 1-2-1 sessions are the option for you.
                  </p>
                </div>
              </div>
            </div>

            {/* Training Priority */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8 mb-16">
              <div className="flex items-start gap-4">
                <Clock className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Training Priority System
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Please note, not everyone can train straight away with REBALL. You will be prioritised to train with us depending on a combination of whether you&apos;ve trained with us before, your playing level, time to sign up, and reasons for training.
                  </p>
                </div>
              </div>
            </div>

            {/* Convenient Sessions */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Convenient Sessions
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Our aim is to make our Successful Impact Sessions as convenient as possible. Not only by distance, but also by time, we will host sessions within the availability you provide us. We also keep every session as light as possible to not affect your playing week physically. In our sessions you will learn the specific tactical, movement, and technical information you need to instantly increase your game success in the exact scenarios you face in the game. So while you won&apos;t be feeling as if you&apos;ve been hit by a bus, you may be wishing you brought a notepad!
                </p>
              </div>
            </div>

            {/* Session Wrapped Videos */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Session &apos;Wrapped&apos; Videos
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  But luckily for you, our recommended subscription features our Successful Impact Session &apos;Wrapped&apos; video, which summarises all the key information covered in each session that you need to instantly increase your success in every game scenario. You can watch this video back at any time, and any place. So you may not need that notepad after all..
                </p>
              </div>
            </div>

            {/* Post-Training Recovery */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Post-Training Recovery
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                At the end of every session, we&apos;ll send you off with some post-training snacks and drinks to aid your recovery.
              </p>
            </div>

            {/* SISW and Game Analysis */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  SISW and Game Analysis
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Want to take your development even further? Subscribe to our SISW video and Game Analysis Video package to also receive an analysis video of your game performances, using visual drawing tools like the ones pundits use on Match of the Day - this package is only available with our 1-2-1&apos;s.
              </p>
            </div>

            {/* Course Completion Benefits */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-16">
              <div className="text-center mb-8">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Course Completion Benefits
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  At the end of every completed course, you&apos;ll get your &apos;REBALL Wrapped&apos; video, armed with your very best highlights from our Successful Impact Sessions.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Certified REBALL Status
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    With course completion, you&apos;re officially a certified REBALL. Meaning you&apos;ll have access to exclusive perks:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-2.5 h-2.5 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Discounts on REBALL collaborations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-2.5 h-2.5 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Skip the queue for future courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-2.5 h-2.5 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Priority booking access</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    REBALL Wrapped Video
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your personalized highlight reel showcasing your best moments and improvements from the course, perfect for sharing your progress and achievements.
                  </p>
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
              So, the REBALLUTION is here, are you ready to instantly increase your game success?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your account now and start your journey with REBALL&apos;s world-class training experience.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6">
                <Link href="/register">Create your account now!</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
