"use server";

import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";

export async function createTenant(formData: FormData) {
  const db = createServiceClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const plan_id = (formData.get("plan_id") as string) || "basic";
  const locationName = formData.get("location_name") as string;
  const locationAddress = (formData.get("location_address") as string) || null;
  const stampsRequired = parseInt(formData.get("stamps_required") as string, 10) || 5;
  const rewardText = formData.get("reward_text") as string;

  if (!name || !slug || !rewardText) {
    redirect("/dashboard/negocios/nuevo?error=Completa+todos+los+campos+requeridos");
  }

  const { data: tenant, error: tenantError } = await db
    .from("tenants")
    .insert({ name, slug, plan_id, status: "trial" })
    .select("id")
    .single();

  if (tenantError) {
    const msg = tenantError.message.includes("unique")
      ? "El+slug+ya+existe"
      : encodeURIComponent(tenantError.message);
    redirect(`/dashboard/negocios/nuevo?error=${msg}`);
  }

  await db.from("locations").insert({
    tenant_id: tenant.id,
    name: locationName || name,
    address: locationAddress,
  });

  await db.from("programs").insert({
    tenant_id: tenant.id,
    name: `Programa ${name}`,
    stamps_required: stampsRequired,
    reward_text: rewardText,
    stamp_mode: "staff_scan",
    active: true,
  });

  redirect(`/dashboard/negocios/${tenant.id}`);
}

export async function updateProgram(formData: FormData) {
  const db = createServiceClient();

  const programId = formData.get("program_id") as string;
  const tenantId = formData.get("tenant_id") as string;
  const stampsRequired = parseInt(formData.get("stamps_required") as string, 10);
  const rewardText = formData.get("reward_text") as string;

  if (!programId || !tenantId || !rewardText || isNaN(stampsRequired)) {
    redirect(`/dashboard/negocios/${tenantId}/programa?error=Datos+inválidos`);
  }

  const { error } = await db
    .from("programs")
    .update({ stamps_required: stampsRequired, reward_text: rewardText })
    .eq("id", programId)
    .eq("tenant_id", tenantId);

  if (error) {
    redirect(`/dashboard/negocios/${tenantId}/programa?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/negocios/${tenantId}/programa`);
}

export async function addLocation(formData: FormData) {
  const db = createServiceClient();

  const tenantId = formData.get("tenant_id") as string;
  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || null;

  if (!tenantId || !name) {
    redirect(`/dashboard/negocios/${tenantId}/locales?error=Nombre+requerido`);
  }

  const { error } = await db
    .from("locations")
    .insert({ tenant_id: tenantId, name, address });

  if (error) {
    redirect(`/dashboard/negocios/${tenantId}/locales?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/negocios/${tenantId}/locales`);
}
