import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-gray-900 dark:text-white py-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1 - Brand & Contact */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center font-marker text-2xl mb-4">
              <Image 
                src="/logos/logo-main.svg"
                alt="REBALL Logo"
                width={32}
                height={32}
                className="mr-3 dark:hidden"
              />
              <Image 
                src="/logos/logo-white.svg"
                alt="REBALL Logo"
                width={32}
                height={32}
                className="mr-3 hidden dark:block"
              />
              <span>REBALL</span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Professional football training platform specializing in 1v1 scenario training with unique SISW and TAV video analysis methodologies.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">harry@reball.uk</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">+44 (0) 20 1234 5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">London, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-6 border-l border-r border-gray-200 dark:border-gray-700 px-8">
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/terms" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Column 3 - Training Programs & Social Media */}
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Training Programs</h3>
            <div className="space-y-3">
              <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Strikers Training
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Wingers Training
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                CAM Training
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Full-backs Training
              </Link>
            </div>
            
            {/* Social Media */}
            <div className="pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 REBALL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
