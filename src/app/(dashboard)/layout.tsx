export const instant = false;

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getMemberRole } from "@/modules/auth/queries";
import NavSidebar from "@/components/nav-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isSuperadmin = user.email === process.env.SUPERADMIN_EMAIL;

  if (!isSuperadmin) {
    const member = await getMemberRole(supabase, user.id);
    if (!member || !["owner", "manager"].includes(member.role)) {
      redirect("/staff");
    }
  }

  return (
    <div className="flex min-h-screen">
      <NavSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
}
