import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import GlowCardTracker from "@/components/ui/glow-card-tracker";

export default async function DashboardLayout({
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

  return (
    <div>
      <GlowCardTracker />
      {children}
    </div>
  );
}
