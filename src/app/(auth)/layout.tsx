import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlowCardTracker from "@/components/ui/glow-card-tracker";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-light-gray to-off-white dark:from-dark-gray dark:via-charcoal dark:to-pure-black">
      <GlowCardTracker />
      
      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Back to Home */}
          <Button asChild variant="ghost" className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>

          {/* REBALL Logo */}
          <Link href="/" className="flex items-center font-marker text-xl font-bold">
            <Image 
              src="/logos/logo-black.svg"
              alt="REBALL Logo"
              width={28}
              height={28}
              className="mr-2 dark:hidden"
            />
            <Image 
              src="/logos/logo-white.svg"
              alt="REBALL Logo"
              width={28}
              height={28}
              className="mr-2 hidden dark:block"
            />
            REBALL
          </Link>

          {/* Spacer for layout balance */}
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Decorative Football Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating orbs */}
        <div className="floating-orb w-32 h-32 top-10 left-10 opacity-20"></div>
        <div className="floating-orb w-24 h-24 top-1/3 right-20 opacity-20"></div>
        <div className="floating-orb w-20 h-20 bottom-32 left-1/4 opacity-20"></div>
        <div className="floating-orb w-28 h-28 bottom-20 right-1/3 opacity-20"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px] opacity-30"></div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-sm text-text-gray dark:text-medium-gray">
          Professional Football Training Platform
        </p>
      </footer>
    </div>
  );
}
