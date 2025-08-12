import type { Metadata } from "next";
import { Permanent_Marker, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/conditional-layout";
import { Toaster } from "@/components/ui/sonner";
import GlowCardTracker from "@/components/ui/glow-card-tracker";
import AuthSessionProvider from "@/components/providers/session-provider";
import { auth } from "@/lib/auth-server";

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "REBALL - Revolutionary Football Management",
  description: "The future of football management with AI-powered insights, advanced analytics, and immersive gameplay.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${permanentMarker.variable} ${poppins.variable} antialiased font-poppins`}
      >
        <AuthSessionProvider session={session}>
          <GlowCardTracker />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
