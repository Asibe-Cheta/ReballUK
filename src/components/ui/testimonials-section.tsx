"use client"

import { useState } from "react"
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
    id: "will-lars",
    name: "Will Lars",
    position: "Striker",
    playerImage: "/Testimonials/will-lars/player-image.jpg",
    quote: "REBALL's 1v1 training completely transformed my game. The SISW analysis showed me exactly what I was doing wrong in crucial moments. I've never felt more confident in front of goal.",
    rating: 5
  },
  {
    id: "tylor-holmes", 
    name: "Tylor Holmes",
    position: "Winger",
    playerImage: "/Testimonials/tylor-holmes/player-image.webp",
    quote: "The position-specific training at REBALL is incredible. Harry's TAV breakdowns helped me understand the tactical side of 1v1 scenarios I never even considered before.",
    rating: 5
  },
  {
    id: "josh-johnson",
    name: "Josh Johnson", 
    position: "Midfielder",
    playerImage: "/Testimonials/josh-johnson/player-image.jpg",
    quote: "After just a few sessions with REBALL, my decision-making in 1v1 situations improved dramatically. The video analysis is game-changing - you see your mistakes and learn instantly.",
    rating: 5
  }
]

export default function TestimonialsSection() {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

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

        {/* Testimonials Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
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

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Game?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of players who have already improved their 1v1 skills with REBALL's innovative training methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Start Training Today
              </Link>
              <Link href="/resources" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
