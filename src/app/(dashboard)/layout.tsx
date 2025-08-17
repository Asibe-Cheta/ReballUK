import GlowCardTracker from "@/components/ui/glow-card-tracker";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ThemeProvider } from "next-themes";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Replace with custom auth check
  const user = {
    id: "temp-user-id",
    name: "Player",
    email: "player@reball.uk",
    profile: {
      firstName: "Player",
      lastName: "",
      position: "GENERAL",
      trainingLevel: "BEGINNER"
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
