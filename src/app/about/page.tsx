import Image from "next/image";
import Link from "next/link";
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                <Link href="/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
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
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  <p>
                    From my experience at three Premier League academies. I&apos;ve observed how difficult it is for players to prepare effectively for the scenarios they face in the game - I founded REBALL to fix this gap in modern player development.
                  </p>
                  <p>
                    We&apos;ve identified every exact scenario players face in the game according to the position and movement mechanics of defenders and attackers. We then coach players the specific tactical, movement and technical information they need to instantly increase their success in the exact scenarios they face in the game.
                  </p>
                  <p>
                    From grassroots to professional setups, players and coaches trust REBALL to accelerate their development with detailed, scenario-based training that mirrors the demands of the modern game. At REBALL, we&apos;re not a coaching supplier, we&apos;re a development partner - here to complement the work you already do. Our programs are built around one core belief: players improve fastest when trained in the exact scenarios they face in matches—not just with drills, but with context.
                  </p>
                  <p>
                    We&apos;ve had the pleasure of working in setups such as Argyle Community Trust, Saints Southwest and externally with players like Will Jenkins-Davies (Former Plymouth Argyle FC, now Bath City FC), Seb Campbell (Argyle FC Scholar, now breaking into the 1st team) and Tylor Love-Holmes (Truro City FC). All have seen measurable growth in their performances and confidence.
                  </p>
                  <p>
                    Our methods are already generating traction and results - and we&apos;re looking to share this impact further across the region. Whether you&apos;re a player, club, or football organisation seeking high-quality individual development, we&apos;re here to support.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                    <Link href="/register">Register Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Link href="/contact">Contact Us</Link>
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
