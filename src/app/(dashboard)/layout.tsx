import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import GlowCardTracker from "@/components/ui/glow-card-tracker";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <GlowCardTracker />
      {children}
    </div>
  );
}
