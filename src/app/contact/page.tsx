import { Mail, Phone, MapPin, Clock, Users, MessageCircle } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";

export const metadata: Metadata = {
  title: "Contact Us - REBALL | Get In Touch",
  description: "Contact REBALL for personalized football training programs. Reach out to Harry directly or use our contact form to discuss your 1v1 training needs.",
  keywords: "REBALL contact, football training inquiry, Harry REBALL, 1v1 training contact, football coaching contact",
};

// Contact information data
const contactInfo = {
  email: "harry@reball.uk",
  phone: "+44 (0) 7XXX XXXXXX", // Placeholder - replace with actual number
  address: {
    street: "Professional Training Facility",
    city: "Plymouth, Devon",
    postcode: "PL1 XXX",
    country: "South England, United Kingdom",
  },
  businessHours: {
    weekdays: "Monday - Friday: 8:00 AM - 8:00 PM",
    weekends: "Saturday - Sunday: 9:00 AM - 5:00 PM",
  },
};

// Contact methods data
const contactMethods = [
  {
    id: "email",
    title: "Email Us",
    description: "Send us a detailed message about your training goals",
    icon: Mail,
    action: "harry@reball.uk",
    href: "mailto:harry@reball.uk",
  },
  {
    id: "phone",
    title: "Call Us",
    description: "Speak directly with Harry about your training needs",
    icon: Phone,
    action: "Schedule a Call",
    href: "mailto:harry@reball.uk?subject=Call Request",
  },
  {
    id: "form",
    title: "Contact Form",
    description: "Fill out our detailed form for personalized guidance",
    icon: MessageCircle,
    action: "Complete Form Below",
    href: "#contact-form",
  },
];

// Why contact us reasons
const whyContactReasons = [
  {
    id: "consultation",
    title: "Free Consultation",
    description: "Discuss your goals and get personalized training recommendations",
    icon: Users,
  },
  {
    id: "assessment",
    title: "Skill Assessment",
    description: "Evaluate your current level and identify areas for improvement",
    icon: MapPin,
  },
  {
    id: "scheduling",
    title: "Flexible Scheduling",
    description: "Find training times that work with your busy schedule",
    icon: Clock,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-pure-white to-light-gray dark:from-dark-gray dark:to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6">
              Get In Touch
            </AnimatedHeroHeading>
            <p className="text-xl md:text-2xl text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
              Ready to transform your 1v1 game? Let&apos;s discuss how REBALL can help you reach your football goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="mailto:harry@reball.uk">Email Harry Directly</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="#contact-form">Fill Contact Form</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4">How to Reach Us</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray">
                Choose the method that works best for you
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div key={method.id} className="glow-card p-8 rounded-2xl text-center group" data-card={method.id}>
                    <span className="glow"></span>
                    <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-pure-white dark:text-pure-black" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{method.title}</h3>
                    <p className="text-text-gray dark:text-medium-gray mb-6 leading-relaxed">
                      {method.description}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={method.href}>{method.action}</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-20 bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-marker text-4xl md:text-5xl mb-4">Why Contact REBALL?</h2>
              <p className="text-xl text-text-gray dark:text-medium-gray">
                What you can expect when you reach out to us
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whyContactReasons.map((reason) => {
                const IconComponent = reason.icon;
                return (
                  <div key={reason.id} className="text-center">
                    <div className="w-16 h-16 bg-pure-black dark:bg-pure-white rounded-xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-pure-white dark:text-pure-black" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{reason.title}</h3>
                    <p className="text-text-gray dark:text-medium-gray leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <div className="mb-8">
                  <h2 className="font-marker text-4xl md:text-5xl mb-4">Send Us a Message</h2>
                  <p className="text-lg text-text-gray dark:text-medium-gray leading-relaxed">
                    Tell us about your football goals and how we can help you achieve them. 
                    We&apos;ll get back to you within 24 hours with personalized recommendations.
                  </p>
                </div>
                <div className="glow-card p-8 rounded-2xl" data-card="contact-form">
                  <span className="glow"></span>
                  <ContactForm />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  
                  {/* Email */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-pure-black dark:bg-pure-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-pure-white dark:text-pure-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <Link 
                        href={`mailto:${contactInfo.email}`}
                        className="text-text-gray dark:text-medium-gray hover:text-pure-black dark:hover:text-pure-white transition-colors"
                      >
                        {contactInfo.email}
                      </Link>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-pure-black dark:bg-pure-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-pure-white dark:text-pure-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-text-gray dark:text-medium-gray">
                        {contactInfo.phone}
                      </p>
                      <p className="text-sm text-text-gray dark:text-medium-gray">
                        Available by appointment
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-pure-black dark:bg-pure-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-pure-white dark:text-pure-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Training Location</h4>
                      <div className="text-text-gray dark:text-medium-gray">
                        <p>{contactInfo.address.street}</p>
                        <p>{contactInfo.address.city}, {contactInfo.address.postcode}</p>
                        <p>{contactInfo.address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pure-black dark:bg-pure-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-pure-white dark:text-pure-black" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Training Hours</h4>
                      <div className="text-text-gray dark:text-medium-gray space-y-1">
                        <p>{contactInfo.businessHours.weekdays}</p>
                        <p>{contactInfo.businessHours.weekends}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="glow-card p-6 rounded-xl" data-card="response-time">
                  <span className="glow"></span>
                  <h4 className="font-semibold mb-3">Response Time</h4>
                  <p className="text-text-gray dark:text-medium-gray text-sm leading-relaxed">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent training requests or questions, please call Harry directly or 
                    mention &quot;urgent&quot; in your message subject line.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="glow-card p-6 rounded-xl" data-card="quick-links">
                  <span className="glow"></span>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <div className="space-y-3">
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link href="/about">Learn More About REBALL</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link href="mailto:harry@reball.uk?subject=Training Program Inquiry">
                        Ask About Training Programs
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link href="mailto:harry@reball.uk?subject=Free Consultation Request">
                        Book Free Consultation
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-pure-white to-light-gray dark:from-dark-gray dark:to-charcoal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-marker text-4xl md:text-5xl mb-6">Ready to Master Your 1v1 Game?</h2>
            <p className="text-xl text-text-gray dark:text-medium-gray mb-8 leading-relaxed">
              Don&apos;t wait to start improving. Every day of training counts towards achieving your football goals.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="mailto:harry@reball.uk?subject=I'm Ready to Start Training">
                Start Your Training Journey
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
