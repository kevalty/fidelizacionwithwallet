import { connection } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function getGlobalStats() {
  // connection() opts into dynamic rendering so new Date() is per-request
  await connection();
  const db = createServiceClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [{ count: activeTenants }, { count: totalCustomers }, { count: stampsToday }] =
    await Promise.all([
      db.from("tenants").select("*", { count: "exact", head: true }).eq("status", "active"),
      db.from("customers").select("*", { count: "exact", head: true }),
      db
        .from("stamp_events")
        .select("*", { count: "exact", head: true })
        .gte("stamped_at", today.toISOString()),
    ]);

  return {
    activeTenants: activeTenants ?? 0,
    totalCustomers: totalCustomers ?? 0,
    stampsToday: stampsToday ?? 0,
  };
}

export async function getAllTenants() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("tenants")
    .select("id, slug, name, plan_id, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTenant(tenantId: string) {
  const db = createServiceClient();
  const { data, error } = await db
    .from("tenants")
    .select("id, slug, name, plan_id, status, created_at")
    .eq("id", tenantId)
    .single();
  if (error) throw error;
  return data;
}

export async function getTenantStats(tenantId: string) {
  const db = createServiceClient();
  const [
    { count: customers },
    { count: stamps },
    { count: redemptions },
    { count: activeCards },
  ] = await Promise.all([
    db
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    db
      .from("stamp_events")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    db
      .from("redemptions")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId),
    db
      .from("cards")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active"),
  ]);

  return {
    customers: customers ?? 0,
    stamps: stamps ?? 0,
    redemptions: redemptions ?? 0,
    activeCards: activeCards ?? 0,
  };
}

export async function getTenantClients(tenantId: string) {
  const db = createServiceClient();
  const { data, error } = await db
    .from("customers")
    .select("id, name, phone, email, created_at, cards(stamp_count, status)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTenantProgram(tenantId: string) {
  const db = createServiceClient();
  const { data } = await db
    .from("programs")
    .select("id, name, stamps_required, reward_text, stamp_mode, active")
    .eq("tenant_id", tenantId)
    .eq("active", true)
    .single();
  return data ?? null;
}

export async function getTenantLocations(tenantId: string) {
  const db = createServiceClient();
  const { data, error } = await db
    .from("locations")
    .select("id, name, address, lat, lng, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
