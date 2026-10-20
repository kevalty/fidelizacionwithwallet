import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params;
  const db = createServiceClient();

  const [{ data: customers, error }, { data: tenant }] = await Promise.all([
    db
      .from("customers")
      .select("id, name, phone, email, created_at, cards(stamp_count, status)")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
    db.from("tenants").select("slug").eq("id", tenantId).single(),
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = customers ?? [];
  const header = "nombre,telefono,correo,sellos,estado,fecha_registro";
  const lines = rows.map((c) => {
    const card = Array.isArray(c.cards) ? c.cards[0] : null;
    const escape = (v: string | null | undefined) => {
      if (v == null) return "";
      // Wrap in quotes if contains comma, newline or quote
      if (/[,"\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
      return v;
    };
    return [
      escape(c.name),
      escape(c.phone),
      escape(c.email),
      String(card?.stamp_count ?? 0),
      escape(card?.status ?? ""),
      escape(c.created_at),
    ].join(",");
  });

  const csv = [header, ...lines].join("\n");
  const slug = tenant?.slug ?? tenantId;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clientes-${slug}.csv"`,
    },
  });
}
