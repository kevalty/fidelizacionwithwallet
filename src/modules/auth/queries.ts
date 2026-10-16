import { SupabaseClient } from "@supabase/supabase-js";

export async function getMemberRole(
  supabase: SupabaseClient,
  userId: string
): Promise<{ role: string; tenant_id: string } | null> {
  const { data } = await supabase
    .from("tenant_members")
    .select("role, tenant_id")
    .eq("user_id", userId)
    .single();
  return data;
}
