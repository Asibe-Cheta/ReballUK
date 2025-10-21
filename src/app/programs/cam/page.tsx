"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, Lock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

// Course data structure
interface Course {
  id: string;
  title: string;
  description: string;
  level: "Essential" | "Advanced";
  type: string;
  available: boolean;
  positions: string[];
}

const camCourses: Course[] = [
  {
    id: "cam-1v1-attacking-crossing-essential",
    title: "Essential 1v1 Attacking CAM Crossing Course",
    description: "Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and deliver assists. This course features the exact 8 1v1 attacking scenarios you face in the game.",
    level: "Essential",
    type: "1v1 Attacking Crossing",
    available: true,
    positions: ["CAM"]
  },
  {
    id: "cam-1v1-attacking-crossing-advanced",
    title: "Advanced 1v1 Attacking CAM Crossing Course",
    description: "Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and delivering assists. This course features the exact 8 1v1 attacking scenarios you face in the game.",
    level: "Advanced",
    type: "1v1 Attacking Crossing",
    available: true,
    positions: ["CAM"]
  },
  {
    id: "cam-1v1-attacking-finishing-essential",
    title: "Essential 1v1 Attacking CAM Finishing Course",
    description: "Learn the specific essential tactical, movement and technical information you need to instantly beat defenders and score goals. This course features the exact 8 1v1 attacking scenarios you face in the game.",
    level: "Essential",
    type: "1v1 Attacking Finishing",
    available: true,
    positions: ["CAM"]
  },
  {
    id: "cam-1v1-attacking-finishing-advanced",
    title: "Advanced 1v1 Attacking CAM Finishing Course",
    description: "Learn the specific advanced tactical, movement and technical information you need to become unstoppable in beating defenders and scoring goals. This course features the exact 8 1v1 attacking scenarios you face in the game.",
    level: "Advanced",
    type: "1v1 Attacking Finishing",
    available: true,
    positions: ["CAM"]
  },
  {
    id: "cam-dribbling-essential",
    title: "Essential Dribbling Course",
    description: "Coming Soon",
    level: "Essential",
    type: "Dribbling",
    available: false,
    positions: ["CAM"]
  },
  {
    id: "cam-dribbling-advanced",
    title: "Advanced Dribbling Course",
    description: "Coming Soon",
    level: "Advanced",
    type: "Dribbling",
    available: false,
    positions: ["CAM"]
  },
  {
    id: "cam-receiving-essential",
    title: "Essential Receiving Course",
    description: "Coming Soon",
    level: "Essential",
    type: "Receiving",
    available: false,
    positions: ["CAM"]
  },
  {
    id: "cam-receiving-advanced",
    title: "Advanced Receiving Course",
    description: "Coming Soon",
    level: "Advanced",
    type: "Receiving",
    available: false,
    positions: ["CAM"]
  },
  {
    id: "cam-runs-finishing-essential",
    title: "Essential Runs & Finishing in Box Course",
    description: "Coming Soon",
    level: "Essential",
    type: "Runs & Finishing in Box",
    available: false,
    positions: ["CAM"]
  },
  {
    id: "cam-runs-finishing-advanced",
    title: "Advanced Runs & Finishing in Box Course",
    description: "Coming Soon",
    level: "Advanced",
    type: "Runs & Finishing in Box",
    available: false,
    positions: ["CAM"]
  }
];

export default function CAMPage() {
  const availableCourses = camCourses.filter(course => course.available);
  const comingSoonCourses = camCourses.filter(course => !course.available);

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Link href="/programs" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to All Courses
              </Link>
            </div>
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 dark:text-white">
              CAM Training Courses
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Learn the specific tactical, movement and technical information you need to instantly increase your 1v1 attacking, dribbling, runs and finishing in the box and receiving success in the exact scenarios you face in the game
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                <Link href="/register">Start Training</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Display */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Available Training Courses
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comprehensive training courses specifically designed for central attacking midfielders
              </p>
            </div>

            {/* Available Courses */}
            {availableCourses.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Available Now
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {availableCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              course.level === 'Essential'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {course.level === 'Advanced' && <Lock className="w-3 h-3" />}
                              {course.level}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {course.type}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                      </div>
                      <Button asChild className="w-full bg-black hover:bg-gray-800 text-white">
                        <Link href={`/programs/${course.id}`}>
                          View Course Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coming Soon Courses */}
            {comingSoonCourses.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Coming Soon
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comingSoonCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 opacity-75"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              course.level === 'Essential'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {course.level === 'Advanced' && <Lock className="w-3 h-3" />}
                              {course.level}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {course.type}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {course.title}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Coming Soon
                          </p>
                        </div>
                      </div>
                      <Button disabled className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                        Coming Soon
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-black dark:bg-white text-white dark:text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Game?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of players who have already improved their skills with REBALL&apos;s innovative training methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6">
                <Link href="/register">Start Training Today</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
