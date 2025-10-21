"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PurchaseButton from "@/components/ui/purchase-button"
import { Clock, Users, Target, Award, PoundSterling, CheckCircle } from "lucide-react"

interface CoursePricingCardProps {
  courseId: string
  price: number
  duration: string
  level: string
  position: string
  prerequisites?: string
  features?: string[]
}

export default function CoursePricingCard({
  courseId,
  price,
  duration,
  level,
  position,
  prerequisites = "None",
  features = []
}: CoursePricingCardProps) {
  return (
    <Card className="sticky top-24 border-2 border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Course Details</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <PoundSterling className="h-4 w-4 mr-1" />
            {price.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Course Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{level}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{position}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Prerequisites</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{prerequisites}</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        {features.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">What's Included:</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Purchase Button */}
        <PurchaseButton
          type="course"
          courseId={courseId}
          price={price}
          size="lg"
          className="w-full"
        />

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe
          </p>
          <p className="text-xs text-center text-muted-foreground mt-1">
            30-day money-back guarantee
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

