"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Define routes where navbar and footer should be hidden
  const isDashboard = pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/admin') ||
                     pathname.startsWith('/training') ||
                     pathname.startsWith('/1v1-scenarios') ||
                     pathname.startsWith('/video-analysis') ||
                     pathname.startsWith('/progress');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
