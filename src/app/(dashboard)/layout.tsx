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
  
  if (!session) {
    redirect("/login-simple");
  }

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
