export const instant = false;

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getMemberRole } from "@/modules/auth/queries";
import LogoutButton from "@/components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const member = await getMemberRole(supabase, user.id);
  if (!member || !["owner", "manager"].includes(member.role)) {
    // Staff lands here if they try to access dashboard — send them to staff.
    redirect("/staff");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Panel</span>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
