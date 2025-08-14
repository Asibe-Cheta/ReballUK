import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import GlowCardTracker from "@/components/ui/glow-card-tracker";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ThemeProvider } from "next-themes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  console.log("=== DASHBOARD LAYOUT AUTH CHECK ===");
  console.log("Session:", session ? {
    user: session.user ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
    expires: session.expires
  } : null);
  console.log("Has session:", !!session);
  console.log("Has user:", !!session?.user);

  if (!session) {
    console.log("No session found, redirecting to login-simple");
    redirect("/login-simple");
  }
  
  console.log("Session valid, proceeding to dashboard");

  const user = {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    profile: {
      firstName: session.user.name?.split(' ')[0] || '',
      lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      position: session.user.position || 'GENERAL',
      trainingLevel: session.user.trainingLevel || 'BEGINNER'
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <GlowCardTracker />
      <DashboardLayout user={user}>
        {children}
      </DashboardLayout>
    </ThemeProvider>
  );
}
