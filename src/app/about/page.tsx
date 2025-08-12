import Image from "next/image";
import Link from "next/link";
import { Mail, Award, Target, Users, Heart, Shield, Lightbulb } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - REBALL | Professional Football Training Platform",
  description: "Learn about REBALL's mission to revolutionize 1v1 football training. Meet our founder Harry and discover our innovative SISW and TAV methodologies.",
  keywords: "REBALL, football training, 1v1 training, SISW, TAV, Harry founder, football coaching",
};

// Company values data
const values = [
  {
    id: "excellence",
    title: "Excellence",
    description: "We strive for the highest quality in every training session, video analysis, and player interaction.",
    icon: Award,
  },
  {
    id: "innovation",
    title: "Innovation",
    description: "Our SISW and TAV methodologies represent cutting-edge approaches to football training and analysis.",
    icon: Lightbulb,
  },
  {
    id: "personalized",
    title: "Personalized",
    description: "Every player is unique. We tailor our training programs to individual needs and playing styles.",
    icon: Target,
  },
  {
    id: "community",
    title: "Community",
    description: "Building a supportive network of players, coaches, and football enthusiasts who grow together.",
    icon: Users,
  },
  {
    id: "passion",
    title: "Passion",
    description: "Our love for football drives everything we do, from training design to player development.",
    icon: Heart,
  },
  {
    id: "integrity",
    title: "Integrity",
    description: "Honest feedback, transparent processes, and ethical coaching practices in all our interactions.",
    icon: Shield,
  },
];

// FAQ data
const faqs = [
  {
    id: "what-is-sisw",
    question: "What is SISW (Session in Slow-motion with Voiceover)?",
    answer: "SISW is our innovative training methodology where we record your training sessions and provide detailed slow-motion analysis with expert voiceover commentary. This allows you to see exactly what happened in crucial moments and understand how to improve your technique, timing, and decision-making in 1v1 scenarios.",
  },
  {
    id: "what-is-tav",
    question: "What is TAV (Technical Analysis Videos)?",
    answer: "TAV provides Match of the Day style analysis of key tactical moments from professional football matches and your own training sessions. We break down successful 1v1 scenarios, explaining the technical and tactical elements that led to success, helping you understand and replicate these patterns in your own game.",
  },
  {
    id: "who-is-training-for",
    question: "Who is REBALL training suitable for?",
    answer: "REBALL training is designed for dedicated football players of all levels who want to improve their 1v1 game. Whether you're a youth player looking to develop fundamental skills, a semi-professional seeking that extra edge, or an amateur player wanting to maximize your potential, our programs are tailored to your specific position and goals.",
  },
  {
    id: "how-long-sessions",
    question: "How long are the training sessions?",
    answer: "Our training sessions typically range from 60 to 90 minutes, depending on the specific program and your individual needs. This includes warm-up, focused 1v1 scenario work, video recording for later analysis, and cool-down. The SISW analysis videos are usually delivered within 48 hours of your session.",
  },
  {
    id: "what-positions",
    question: "Do you offer position-specific training?",
    answer: "Absolutely! We offer specialized 1v1 training for Strikers (attacking finishing, 1v1 with keeper), Wingers (attacking finishing, attacking crossing), CAM (attacking finishing, attacking crossing), and Full-backs (attacking crossing). Each program focuses on the specific 1v1 scenarios most relevant to your position.",
  },
  {
    id: "how-to-get-started",
    question: "How do I get started with REBALL?",
    answer: "Getting started is easy! Simply contact us through our contact form or email Harry directly at harry@reball.uk. We'll discuss your goals, current level, and preferred training schedule. You can then book your first session where we'll assess your current abilities and create a personalized training plan.",
  },
  {
    id: "technology-requirements",
    question: "What technology is used for the video analysis?",
    answer: "We use professional-grade cameras and video analysis software to capture and review your training sessions. The SISW and TAV content is delivered through our secure online platform, accessible via your mobile device or computer. No special equipment is required on your end - just come ready to train!",
  },
  {
    id: "pricing-packages",
    question: "What training packages do you offer?",
    answer: "We offer flexible training packages to suit different needs and budgets. Options include single sessions, weekly training programs, monthly intensives, and long-term development packages. Contact us for detailed pricing information and to discuss which package would be best for your goals.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-pure-white to-light-gray dark:from-dark-gray dark:to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6">
              About Us
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
              Revolutionizing football training through innovative 1v1 scenario analysis 
              and personalized video coaching methodologies.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-marker text-4xl md:text-5xl mb-6">Our Story</h2>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-text-gray dark:text-medium-gray">
                    REBALL was born from a simple observation: the moments that decide football matches 
                    happen in 1v1 scenarios, yet traditional training often overlooks these crucial situations.
                  </p>
                  <p className="text-text-gray dark:text-medium-gray">
                                      Our founder Harry recognized that players needed more than just generic drills - they 
                  needed specific, targeted training that prepared them for the exact scenarios they&apos;d 
                  face on the pitch. This insight led to the development of our revolutionary SISW and 
                    TAV methodologies.
                  </p>
                  <p className="text-text-gray dark:text-medium-gray">
                    Today, REBALL continues to push the boundaries of football training, combining 
                    cutting-edge video analysis with proven coaching techniques to help players master 
                    their 1v1 game and achieve their full potential.
                  </p>
                </div>
              </div>
              <div className="lg:order-first">
                <div className="glow-card p-8 rounded-3xl" data-card="mission">
                  <span className="glow"></span>
                  <h3 className="font-marker text-2xl mb-4">Our Mission</h3>
                  <p className="text-text-gray dark:text-medium-gray mb-6">
                    To provide every football player with the specific tactical, movement, and technical 
                    information they need to instantly increase their game success in the exact scenarios they face.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pure-black dark:bg-pure-white rounded-full"></div>
                      <span className="text-sm">Personalized 1v1 training programs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pure-black dark:bg-pure-white rounded-full"></div>
                      <span className="text-sm">Innovative video analysis methodologies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pure-black dark:bg-pure-white rounded-full"></div>
                      <span className="text-sm">Position-specific scenario training</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Harry Section */}
      <section id="meet-harry" className="py-20 bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4">Meet Harry</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray">
                Founder & Head Coach
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative glow-card p-4 rounded-3xl" data-card="harry-photo">
                  <span className="glow"></span>
                  <Image 
                    src="/images/about/harry-founder.jpg"
                    alt="Harry - REBALL Founder"
                    width={400}
                    height={400}
                    className="object-cover rounded-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black px-6 py-3 rounded-2xl font-semibold">
                    Founder & Coach
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Passionate Football Coach & Innovator</h3>
                  <div className="space-y-4 text-lg text-text-gray dark:text-medium-gray leading-relaxed">
                    <p>
                      Harry&apos;s journey in football began on the local pitches, where he quickly realized 
                      that the difference between good and great players wasn&apos;t just talent - it was 
                      preparation for the specific moments that mattered most.
                    </p>
                    <p>
                      With years of experience in professional football training and a keen eye for 
                      tactical innovation, Harry identified a critical gap in traditional coaching: 
                      the lack of specific 1v1 scenario preparation.
                    </p>
                    <p>
                      This observation led to the creation of REBALL&apos;s unique SISW and TAV methodologies, 
                      which have helped hundreds of players improve their game through targeted, 
                      scenario-specific training.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex items-center gap-2">
                    <Link href="mailto:harry@reball.uk">
                      <Mail className="w-4 h-4" />
                      harry@reball.uk
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/contact">Book a Consultation</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section id="values" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4">Our Values</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray max-w-3xl mx-auto">
                The principles that guide everything we do at REBALL, from training design to player development.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <div key={value.id} className="glow-card p-8 rounded-2xl text-center group" data-card={value.id}>
                    <span className="glow"></span>
                    <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-pure-white dark:text-pure-black" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                    <p className="text-text-gray dark:text-medium-gray leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-b from-pure-white to-light-gray dark:from-dark-gray dark:to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray">
                Everything you need to know about REBALL training programs and methodologies.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="glow-card rounded-xl" data-card={`faq-${faq.id}`}>
                  <span className="glow"></span>
                  <AccordionItem value={faq.id} className="px-6 border-none">
                    <AccordionTrigger className="text-left py-6 hover:no-underline">
                      <span className="font-semibold pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-text-gray dark:text-medium-gray leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-marker text-4xl md:text-5xl mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
              Join hundreds of players who have transformed their 1v1 game with REBALL&apos;s innovative training methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">Get Started Today</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="mailto:harry@reball.uk">Contact Harry Directly</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
