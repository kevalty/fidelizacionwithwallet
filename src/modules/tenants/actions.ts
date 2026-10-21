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

export async function createCustomer(formData: FormData) {
  const db = createServiceClient();
  const tenantId = formData.get("tenant_id") as string;
  const name = (formData.get("name") as string).trim() || null;
  const phone = (formData.get("phone") as string).trim() || null;
  const email = (formData.get("email") as string).trim() || null;

  if (!phone && !email) {
    redirect(`/dashboard/negocios/${tenantId}/clientes/nuevo?error=Teléfono+o+correo+requerido`);
  }

  const { data: customer, error: ce } = await db
    .from("customers")
    .insert({ tenant_id: tenantId, name, phone: phone || null, email: email || null })
    .select("id")
    .single();

  if (ce) {
    const msg = ce.message.includes("unique") ? "Cliente+ya+registrado" : encodeURIComponent(ce.message);
    redirect(`/dashboard/negocios/${tenantId}/clientes/nuevo?error=${msg}`);
  }

  await db.from("consents").insert({
    customer_id: customer.id,
    tenant_id: tenantId,
    type: "data_storage",
    version: "1.0",
    granted: true,
    channel: "staff",
  });

  const { data: program } = await db
    .from("programs")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("active", true)
    .single();

  if (program) {
    await db.from("cards").insert({
      tenant_id: tenantId,
      program_id: program.id,
      customer_id: customer.id,
    });
  }

  redirect(`/dashboard/negocios/${tenantId}/clientes/${customer.id}`);
}

export async function addStamp(formData: FormData) {
  const db = createServiceClient();
  const cardId = formData.get("card_id") as string;
  const tenantId = formData.get("tenant_id") as string;
  const customerId = formData.get("customer_id") as string;

  const { error } = await db.from("stamp_events").insert({
    idempotency_key: crypto.randomUUID(),
    card_id: cardId,
    tenant_id: tenantId,
    method: "staff_scan",
  });

  if (error) {
    redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}`);
}

export async function redeemCard(formData: FormData) {
  const db = createServiceClient();
  const cardId = formData.get("card_id") as string;
  const tenantId = formData.get("tenant_id") as string;
  const customerId = formData.get("customer_id") as string;

  await db.from("redemptions").insert({ card_id: cardId, tenant_id: tenantId });
  // Reset stamp count so the customer can start a new cycle
  await db.from("cards").update({ stamp_count: 0 }).eq("id", cardId);

  redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}`);
}
