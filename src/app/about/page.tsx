import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - REBALL | Professional Football Training Platform",
  description: "Learn about REBALL's mission to revolutionize 1v1 football training. Meet our founder Harry and discover our innovative SISW and TAV methodologies.",
  keywords: "REBALL, football training, 1v1 training, SISW, TAV, Harry founder, football coaching",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 dark:text-white">
              About Us
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Revolutionizing football training through innovative 1v1 scenario analysis 
              and personalized video coaching methodologies.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Meet Harry Section */}
      <section id="meet-harry" className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">Meet Harry</h2>
              <p className="text-xl text-gray-700 dark:text-gray-200">
                Founder & Head Coach
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                  <Image 
                    src="/images/about/harry-founder.jpg"
                    alt="Harry - REBALL Founder"
                    width={400}
                    height={400}
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-2xl font-semibold shadow-lg">
                    Founder & Coach
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Founder of REBALL</h3>
                  <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      From my experience of working in 3 Premier League Academies, I can tell you that you are not being prepared effectively for the scenarios you face in the game. This is because of two main reasons; firstly, you are never coached in the exact scenarios you face in the game. Secondly, the information you are being coached is either incomplete or inaccurate. This is because football coaches only coach and consider technical and tactical information. They rarely consider movement information - such as the position and movement mechanics of defenders and attackers.
                    </p>
                    <p>
                      This would be like learning to drive a car with an instructor in an empty car park. Then without any experience of driving outside the empty carpark, you were thrown into the deep end of your test. You would encounter scenarios you&apos;ve never learnt about before; different types of roundabouts, crossroads and motorways, all while driving around other unpredictable vehicles.
                    </p>
                    <p>
                      This is why I started REBALL, unlike other individual development coaches we don&apos;t coach you incomplete or inaccurate information in unrealistic game scenarios. Instead, we identify every exact scenario you face in the game according to the position and movement mechanics of defenders and attackers. We then coach you the specific tactical, movement and technical information you need to instantly increase your success in the exact scenarios you face in the game.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Link href="mailto:harry@reball.uk">
                      <Mail className="w-4 h-4" />
                      harry@reball.uk
                    </Link>
                  </Button>
                  <Button asChild className="bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                    <Link href="/contact">Book a Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
