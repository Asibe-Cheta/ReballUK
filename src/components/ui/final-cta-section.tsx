"use client"

import Link from "next/link"

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Call to Action */}
        <div className="text-center">
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
