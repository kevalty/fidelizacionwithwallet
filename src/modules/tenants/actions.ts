"use server";

import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import { getMemberRole } from "@/modules/auth/queries";

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

  redirect(`/dashboard/negocios/${tenantId}/programa?saved=1`);
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
    // Generate token here — DB default (base64url) not supported in Postgres 15.
    const publicToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const { error: cardError } = await db.from("cards").insert({
      tenant_id: tenantId,
      program_id: program.id,
      customer_id: customer.id,
      public_token: publicToken,
    });
    if (cardError) {
      redirect(`/dashboard/negocios/${tenantId}/clientes/nuevo?error=${encodeURIComponent("Tarjeta no creada: " + cardError.message)}`);
    }
  } else {
    redirect(`/dashboard/negocios/${tenantId}/clientes/nuevo?error=El+negocio+no+tiene+programa+activo`);
  }

  redirect(`/dashboard/negocios/${tenantId}/clientes/${customer.id}`);
}

export async function createCardForCustomer(formData: FormData) {
  const db = createServiceClient();
  const tenantId = formData.get("tenant_id") as string;
  const customerId = formData.get("customer_id") as string;

  const { data: program } = await db
    .from("programs").select("id").eq("tenant_id", tenantId).eq("active", true).single();

  if (!program) {
    redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}?error=No+hay+programa+activo`);
  }

  const publicToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const { error } = await db.from("cards").insert({
    tenant_id: tenantId, program_id: program.id, customer_id: customerId, public_token: publicToken,
  });

  if (error) {
    redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/dashboard/negocios/${tenantId}/clientes/${customerId}`);
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

export async function registerCustomer(formData: FormData) {
  const db = createServiceClient();
  const slug = formData.get("slug") as string;
  const phone = (formData.get("phone") as string).trim();
  const name = ((formData.get("name") as string) || "").trim() || null;

  if (!phone) redirect(`/t/${slug}?error=Teléfono+requerido`);

  const { data: tenant } = await db
    .from("tenants")
    .select("id, programs(id, active)")
    .eq("slug", slug)
    .in("status", ["active", "trial"])
    .single();

  if (!tenant) redirect(`/t/${slug}?error=Negocio+no+encontrado`);

  // Return existing card if already registered
  const { data: existing } = await db
    .from("customers")
    .select("id, cards(id, public_token)")
    .eq("tenant_id", tenant.id)
    .eq("phone", phone)
    .single();

  if (existing) {
    const cards = existing.cards as { id: string; public_token: string }[] | null;
    const card = Array.isArray(cards) ? cards[0] : cards;
    if (card) redirect(`/c/${card.public_token}`);
  }

  const { data: customer, error: ce } = await db
    .from("customers")
    .insert({ tenant_id: tenant.id, name, phone })
    .select("id")
    .single();

  if (ce) redirect(`/t/${slug}?error=${encodeURIComponent(ce.message)}`);

  await db.from("consents").insert({
    customer_id: customer.id,
    tenant_id: tenant.id,
    type: "data_storage",
    version: "1.0",
    granted: true,
    channel: "self",
  });

  const programs = tenant.programs as { id: string; active: boolean }[] | null;
  const program = Array.isArray(programs) ? programs.find((p) => p.active) : programs;
  if (!program) redirect(`/t/${slug}?error=Negocio+sin+programa+activo`);

  const publicToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  const { error: cardError } = await db.from("cards").insert({
    tenant_id: tenant.id,
    program_id: program.id,
    customer_id: customer.id,
    public_token: publicToken,
  });

  if (cardError) redirect(`/t/${slug}?error=${encodeURIComponent(cardError.message)}`);

  redirect(`/c/${publicToken}`);
}

export async function staffStamp(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const member = await getMemberRole(supabase, user.id);
  if (!member) redirect("/login");

  const db = createServiceClient();
  const cardId = formData.get("card_id") as string;
  const phone = formData.get("phone") as string;

  const { data: card } = await db.from("cards").select("tenant_id").eq("id", cardId).single();
  if (!card || card.tenant_id !== member.tenant_id) {
    redirect(`/staff?phone=${encodeURIComponent(phone)}&error=Tarjeta+no+válida`);
  }

  const { error } = await db.from("stamp_events").insert({
    idempotency_key: crypto.randomUUID(),
    card_id: cardId,
    tenant_id: member.tenant_id,
    method: "staff_scan",
  });

  if (error) redirect(`/staff?phone=${encodeURIComponent(phone)}&error=${encodeURIComponent(error.message)}`);

  redirect(`/staff?phone=${encodeURIComponent(phone)}&stamped=1`);
}

export async function staffRedeem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const member = await getMemberRole(supabase, user.id);
  if (!member) redirect("/login");

  const db = createServiceClient();
  const cardId = formData.get("card_id") as string;
  const phone = formData.get("phone") as string;

  const { data: card } = await db.from("cards").select("tenant_id").eq("id", cardId).single();
  if (!card || card.tenant_id !== member.tenant_id) {
    redirect(`/staff?phone=${encodeURIComponent(phone)}&error=Tarjeta+no+válida`);
  }

  await db.from("redemptions").insert({ card_id: cardId, tenant_id: member.tenant_id });
  await db.from("cards").update({ stamp_count: 0 }).eq("id", cardId);

  redirect(`/staff?phone=${encodeURIComponent(phone)}&redeemed=1`);
}
