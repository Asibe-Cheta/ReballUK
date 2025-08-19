import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHeroHeading from "@/components/ui/animated-hero-heading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - REBALL | Legal Information",
  description: "Read REBALL's terms and conditions, cancellation policy, and privacy policy for our football training services.",
  keywords: "REBALL terms, conditions, cancellation policy, privacy policy, football training legal",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-background dark:bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedHeroHeading className="font-marker text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900 dark:text-white">
              Terms & Conditions
            </AnimatedHeroHeading>
            <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
              Last Updated: 19/08/2025
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Welcome to REBALL, an elite football player development company. By accessing or using our services, including booking training sessions via our website, you agree to the following Terms and Conditions.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* General Terms */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">1. General</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>These Terms & Conditions apply to all users who book training sessions, participate in our programs, or access our services.</p>
                <p>We reserve the right to modify these terms at any time. Continued use of our services implies acceptance of any changes.</p>
              </div>
            </div>

            {/* Booking & Payments */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">2. Booking & Payments</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>All bookings must be made through our official website or authorized representatives.</p>
                <p>Full payment must be made at the time of booking.</p>
                <p>Prices for training sessions may vary and are subject to change without prior notice.</p>
              </div>
            </div>

            {/* Code of Conduct */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">3. Code of Conduct</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>Participants are expected to follow our training guidelines and respect coaches, staff, and fellow players.</p>
                <p>Any misconduct, including abusive behavior or failure to comply with instructions, may result in suspension or expulsion from our programs.</p>
              </div>
            </div>

            {/* Health & Safety */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">4. Health & Safety</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>Participants must disclose any medical conditions before booking.</p>
                <p>REBALL is not liable for injuries sustained during training, though all reasonable safety measures will be taken.</p>
                <p>Parents/guardians of minors must ensure their child is fit to participate.</p>
              </div>
            </div>

            {/* Liability & Disclaimers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">5. Liability & Disclaimers</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>REBALL shall not be held responsible for any personal injury, property damage, or losses incurred during training sessions.</p>
                <p>We do not guarantee specific performance improvements through our training programs.</p>
              </div>
            </div>

            {/* Termination of Service */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">6. Termination of Service</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>We reserve the right to refuse or cancel services to anyone violating these terms.</p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">CANCELLATION POLICY</h2>
              
              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">1. Client Cancellations</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>Clients who purchase a 121 session may cancel or reschedule a session up to 48 hours before the scheduled time for a full refund or credit.</p>
                  <p>Clients who purchase a group session may cancel for a full refund or credit or reschedule for a discounted 121 session up to 48 hours before the scheduled time.</p>
                  <p>Cancellations made within 48 hours of the session will not be eligible for a refund, except in cases of medical emergencies (proof required).</p>
                  <p>No-shows will result in full payment being retained with no refund or credit.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">2. REBALL Cancellations</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>If we need to cancel or reschedule a session due to unforeseen circumstances (e.g., bad weather, coach unavailability), clients will be offered:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>A rescheduled session at no extra cost, OR</li>
                    <li>A full refund or credit for future bookings.</li>
                  </ul>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">3. Refund Process</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>Approved refunds will be processed within 7-10 business days through the original payment method.</p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">PRIVACY POLICY</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Effective Date: 19/08/2025</p>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed mb-12">
                <p>At REBALL, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you book training sessions or interact with our website.</p>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">1. Information We Collect</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p><strong>Personal Information:</strong> Name, email, phone number, address, age, and emergency contact details.</p>
                  <p><strong>Payment Information:</strong> Securely processed through third-party providers (we do not store payment details).</p>
                  <p><strong>Health Information:</strong> Any medical conditions relevant to training safety (voluntarily provided).</p>
                  <p><strong>Usage Data:</strong> Information about your interactions with our website and services.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">2. How We Use Your Information</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>To process bookings and payments.</p>
                  <p>To communicate session updates, offers, and important information.</p>
                  <p>To improve our services based on customer feedback and analytics.</p>
                  <p>To comply with legal and regulatory requirements.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">3. Data Protection & Security</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>We implement security measures to protect your data from unauthorized access.</p>
                  <p>Your data will not be shared with third parties, except for essential service providers (e.g., payment processors).</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">4. Cookies & Tracking</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>Our website uses cookies to enhance user experience and analyze website traffic.</p>
                  <p>Users may disable cookies through their browser settings, though some website functions may be affected.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">5. Your Rights</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>You have the right to request access, correction, or deletion of your personal data.</p>
                  <p>To make any such requests, please contact us at <a href="mailto:harry@reball.uk" className="text-blue-600 dark:text-blue-400 hover:underline">harry@reball.uk</a>.</p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">6. Updates to This Policy</h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>We may update this policy periodically. Continued use of our services implies acceptance of any changes.</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Questions About These Terms?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If you have any questions about our Terms & Conditions, Cancellation Policy, or Privacy Policy, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Link href="mailto:harry@reball.uk">Email Harry</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
