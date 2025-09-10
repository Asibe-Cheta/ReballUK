"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Quote, User, Star } from "lucide-react"
import Link from "next/link"

interface Testimonial {
  id: string
  name: string
  position: string
  playerImage: string
  quote: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: "tylor",
    name: "Tylor",
    position: "Player",
    playerImage: "/Testimonials/tylor-holmes/player-image.webp",
    quote: "This really helped my decision making in a game because it was all game based scenarios and really helped me have better techniques to deal with it. I think he can really improve my game and help me in the future.",
    rating: 5
  },
  {
    id: "will",
    name: "Will",
    position: "Player",
    playerImage: "/Testimonials/will-lars/player-image.jpg",
    quote: "Detailed and specific to what we were working on, it was good to understand how the defenders momentum is important when creating space.",
    rating: 5
  },
  {
    id: "seb",
    name: "Seb",
    position: "Attacking Midfielder",
    playerImage: "/Testimonials/josh-johnson/player-image.jpg",
    quote: "It is realistic to game scenarios for me as a 10. It is a high standard of coaching and helps improve my end product and 1v1 scenarios.",
    rating: 5
  },
  {
    id: "charlie-huyton",
    name: "Charlie Huyton",
    position: "Coach",
    playerImage: "/images/about/harry-founder.jpg",
    quote: "Within the past 2-4 weeks, the lad's confidence and game success has significantly improved. Sessions replicate game-like situations and realistic movements for players to help them deal with pressurised situations within a game.",
    rating: 5
  },
  {
    id: "james",
    name: "James",
    position: "Player",
    playerImage: "/Testimonials/will-lars/player-image.jpg",
    quote: "Really good attention to detail and knowledge. The best 1-2-1 session I have had. The session was much more beneficial in terms of improvement, whereas other sessions have just got a lot of vague information and drills.",
    rating: 5
  },
  {
    id: "will-lars",
    name: "Will Lars",
    position: "Striker",
    playerImage: "/Testimonials/will-lars/player-image.jpg",
    quote: "100% it will increase my 1v1 game success, the little details on knowing when to cut inside and when to take it outside down the line will help my game massively.",
    rating: 5
  },
  {
    id: "josh",
    name: "Josh",
    position: "Player",
    playerImage: "/Testimonials/josh-johnson/player-image.jpg",
    quote: "Harry's session was up there with the best I've had purely because he focussed on key aspects I wanted to improve on and guided me through it every step of the way. The attention to detail was top class!",
    rating: 5
  },
  {
    id: "leon",
    name: "Leon",
    position: "Winger",
    playerImage: "/Testimonials/tylor-holmes/player-image.webp",
    quote: "The session was super detailed with how to improve my 1v1's which is something as a winger is not really coached anywhere else. It was so much more in depth and really looked at the scenarios that happen in a game in my position.",
    rating: 5
  },
  {
    id: "sam",
    name: "Sam",
    position: "Centre Midfielder",
    playerImage: "/Testimonials/josh-johnson/player-image.jpg",
    quote: "The session is more specific to me for what I need to master as centre mid.",
    rating: 5
  },
  {
    id: "jake",
    name: "Jake",
    position: "Full Back",
    playerImage: "/Testimonials/will-lars/player-image.jpg",
    quote: "I think the session will increase my 1v1 game success because as a full back, I feel like crossing and 1v1 scenarios are what I am in most of the time.",
    rating: 5
  }
]

export default function TestimonialsSection() {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ))
  }

  // Get the current set of 3 testimonials to display
  const getCurrentTestimonials = () => {
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  const currentTestimonials = getCurrentTestimonials()

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Players Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from our players about their experience with REBALL's innovative training methods and how it has transformed their game.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all duration-500 ease-in-out">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}-${index}`}
                className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 hover:shadow-2xl transition-all duration-300"
              >
                {/* Player Info */}
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4">
                    {!imageErrors[testimonial.id] ? (
                      <Image
                        src={testimonial.playerImage}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full border-2 border-gray-200 dark:border-gray-700"
                        onError={() => handleImageError(testimonial.id)}
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {testimonial.position}
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <Quote className="w-6 h-6 text-gray-400 dark:text-gray-500 mr-3 mt-1 flex-shrink-0" />
                    <blockquote className="text-gray-700 dark:text-gray-200 leading-relaxed italic text-sm lg:text-base">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-black dark:bg-white"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Are you ready to instantly increase your game success?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of players who have already improved their 1v1 skills with REBALL's innovative training methods.
            </p>
            <div className="flex justify-center">
              <Link href="/register" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
