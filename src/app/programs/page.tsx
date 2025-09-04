"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import { Target, Users, Trophy, Star, CheckCircle, Clock, ChevronDown } from "lucide-react";
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

interface Position {
  id: string;
  name: string;
  shortName: string;
  courses: Course[];
}

const positions: Position[] = [
  {
    id: "strikers",
    name: "Strikers",
    shortName: "ST",
    courses: [
      {
        id: "striker-1v1-attacking-essential",
        title: "Essential 1v1 Attacking Striker Finishing Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly get more goals in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Attacking",
        available: true,
        positions: ["Strikers"]
      },
      {
        id: "striker-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking Striker Finishing Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goalscorer in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Attacking",
        available: true,
        positions: ["Strikers"]
      },
      {
        id: "striker-1v1-keeper-essential",
        title: "Essential 1v1's with Keeper Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v1's with Keeper",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-1v1-keeper-advanced",
        title: "Advanced 1v1's with Keeper Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v1's with Keeper",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-runs-finishing-essential",
        title: "Essential Runs & Finishing in Box Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Runs & Finishing in Box",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-runs-finishing-advanced",
        title: "Advanced Runs & Finishing in Box Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Runs & Finishing in Box",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-1v2-essential",
        title: "Essential 1v2 Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v2",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-1v2-advanced",
        title: "Advanced 1v2 Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v2",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-dribbling-essential",
        title: "Essential Dribbling Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Dribbling",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-dribbling-advanced",
        title: "Advanced Dribbling Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Dribbling",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["Strikers"]
      },
      {
        id: "striker-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["Strikers"]
      }
    ]
  },
  {
    id: "wingers",
    name: "Wingers",
    shortName: "WG",
    courses: [
      {
        id: "winger-1v1-attacking-essential",
        title: "Essential 1v1 Attacking Winger Crossing Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly get more assists in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Attacking",
        available: true,
        positions: ["Wingers"]
      },
      {
        id: "winger-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking Winger Crossing Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goal creator in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Attacking",
        available: true,
        positions: ["Wingers"]
      },
      {
        id: "winger-1v1-keeper-essential",
        title: "Essential 1v1's with Keeper Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v1's with Keeper",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-1v1-keeper-advanced",
        title: "Advanced 1v1's with Keeper Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v1's with Keeper",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-runs-finishing-essential",
        title: "Essential Runs & Finishing in Box Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Runs & Finishing in Box",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-runs-finishing-advanced",
        title: "Advanced Runs & Finishing in Box Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Runs & Finishing in Box",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-1v2-essential",
        title: "Essential 1v2 Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v2",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-1v2-advanced",
        title: "Advanced 1v2 Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v2",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-dribbling-essential",
        title: "Essential Dribbling Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Dribbling",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-dribbling-advanced",
        title: "Advanced Dribbling Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Dribbling",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["Wingers"]
      },
      {
        id: "winger-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["Wingers"]
      }
    ]
  },
  {
    id: "cam",
    name: "Central Attacking Midfielders",
    shortName: "CAM",
    courses: [
      {
        id: "cam-1v1-attacking-essential",
        title: "Essential 1v1 Attacking CAM Crossing Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly get more assists in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Attacking",
        available: true,
        positions: ["CAM"]
      },
      {
        id: "cam-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking CAM Crossing Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goal creator in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Attacking",
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
    ]
  },
  {
    id: "cm",
    name: "Centre-Mids",
    shortName: "CM",
    courses: [
      {
        id: "cm-1v1-attacking-essential",
        title: "Essential 1v1 Attacking CM Crossing Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly get more assists in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Attacking",
        available: true,
        positions: ["CM"]
      },
      {
        id: "cm-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking CM Crossing Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goal creator in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Attacking",
        available: true,
        positions: ["CM"]
      },
      {
        id: "cm-dribbling-essential",
        title: "Essential Dribbling Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Dribbling",
        available: false,
        positions: ["CM"]
      },
      {
        id: "cm-dribbling-advanced",
        title: "Advanced Dribbling Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Dribbling",
        available: false,
        positions: ["CM"]
      },
      {
        id: "cm-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["CM"]
      },
      {
        id: "cm-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["CM"]
      }
    ]
  },
  {
    id: "cdm",
    name: "Central Defending Midfielders",
    shortName: "CDM",
    courses: [
      {
        id: "cdm-1v1-attacking-essential",
        title: "Essential 1v1 Attacking CDM Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v1 Attacking",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking CDM Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v1 Attacking",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-1v1-defending-essential",
        title: "Essential 1v1 Defending Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v1 Defending",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-1v1-defending-advanced",
        title: "Advanced 1v1 Defending Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v1 Defending",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-screening-essential",
        title: "Essential Screening Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Screening",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-screening-advanced",
        title: "Advanced Screening Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Screening",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-dribbling-essential",
        title: "Essential Dribbling Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Dribbling",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-dribbling-advanced",
        title: "Advanced Dribbling Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Dribbling",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["CDM"]
      },
      {
        id: "cdm-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["CDM"]
      }
    ]
  },
  {
    id: "fb",
    name: "Full-back",
    shortName: "FB",
    courses: [
      {
        id: "fb-1v1-attacking-essential",
        title: "Essential 1v1 Attacking Full-back Crossing Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly get more assists in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Attacking",
        available: true,
        positions: ["Full-back"]
      },
      {
        id: "fb-1v1-attacking-advanced",
        title: "Advanced 1v1 Attacking Full-back Crossing Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable goal creator in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Attacking",
        available: true,
        positions: ["Full-back"]
      },
      {
        id: "fb-1v1-defending-essential",
        title: "Essential 1v1 Defending Course",
        description: "Coming Soon",
        level: "Essential",
        type: "1v1 Defending",
        available: false,
        positions: ["Full-back"]
      },
      {
        id: "fb-1v1-defending-advanced",
        title: "Advanced 1v1 Defending Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "1v1 Defending",
        available: false,
        positions: ["Full-back"]
      },
      {
        id: "fb-dribbling-essential",
        title: "Essential Dribbling Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Dribbling",
        available: false,
        positions: ["Full-back"]
      },
      {
        id: "fb-dribbling-advanced",
        title: "Advanced Dribbling Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Dribbling",
        available: false,
        positions: ["Full-back"]
      },
      {
        id: "fb-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["Full-back"]
      },
      {
        id: "fb-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["Full-back"]
      }
    ]
  },
  {
    id: "cb",
    name: "Centre-back",
    shortName: "CB",
    courses: [
      {
        id: "cb-1v1-defending-essential",
        title: "Essential 1v1 Defending Course",
        description: "Learn the specific essential tactical, movement and technical information you need to instantly improve your defending in the exact 8 1v1 scenarios you face in the game",
        level: "Essential",
        type: "1v1 Defending",
        available: true,
        positions: ["Centre-back"]
      },
      {
        id: "cb-1v1-defending-advanced",
        title: "Advanced 1v1 Defending Course",
        description: "Learn the specific advanced tactical, movement and technical information you need to become an unstoppable defender in the exact 8 1v1 scenarios you face in the game",
        level: "Advanced",
        type: "1v1 Defending",
        available: true,
        positions: ["Centre-back"]
      },
      {
        id: "cb-receiving-essential",
        title: "Essential Receiving Course",
        description: "Coming Soon",
        level: "Essential",
        type: "Receiving",
        available: false,
        positions: ["Centre-back"]
      },
      {
        id: "cb-receiving-advanced",
        title: "Advanced Receiving Course",
        description: "Coming Soon",
        level: "Advanced",
        type: "Receiving",
        available: false,
        positions: ["Centre-back"]
      }
    ]
  }
];

export default function ProgramsPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchParams(params);
    const position = params.get('position');
    if (position) {
      setSelectedPosition(position);
    }
  }, []);

  const handlePositionSelect = (positionId: string) => {
    setSelectedPosition(positionId);
    setShowScrollIndicator(true);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('position', positionId);
    window.history.pushState({}, '', url.toString());
    
    // Hide scroll indicator after 5 seconds
    setTimeout(() => {
      setShowScrollIndicator(false);
    }, 5000);
  };

  const selectedPositionData = selectedPosition 
    ? positions.find(p => p.id === selectedPosition)
    : null;

  const availableCourses = selectedPositionData?.courses.filter(course => course.available) || [];
  const comingSoonCourses = selectedPositionData?.courses.filter(course => !course.available) || [];

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 dark:text-white">
              Training Programs
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Position-specific training programs designed to improve your game in the exact scenarios you face on the pitch
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

      {/* Position Selection */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Position
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Select your position to view available training programs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => handlePositionSelect(position.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    selectedPosition === position.id
                      ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{position.shortName}</div>
                    <div className="text-sm font-medium">{position.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Down Indicator */}
      {showScrollIndicator && (
        <section className="py-8 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center gap-4 animate-bounce">
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Scroll down to proceed
                </div>
                <ChevronDown className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Course Display */}
      {selectedPositionData && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedPositionData.name} Programs
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Available training courses for {selectedPositionData.name}
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
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Essential'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              }`}>
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
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Essential'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                              }`}>
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
      )}

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
