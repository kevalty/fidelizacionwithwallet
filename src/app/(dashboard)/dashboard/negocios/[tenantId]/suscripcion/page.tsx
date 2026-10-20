export const instant = false;

import { getTenant } from "@/modules/tenants/queries";
import { createServiceClient } from "@/lib/supabase";
import { notFound } from "next/navigation";

const statusLabel: Record<string, string> = {
  active: "Activo",
  trial: "Prueba",
  suspended: "Suspendido",
  cancelled: "Cancelado",
};

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function SuscripcionPage({ params }: Props) {
  const { tenantId } = await params;
  let tenant;
  try {
    tenant = await getTenant(tenantId);
  } catch {
    notFound();
  }

  const db = createServiceClient();
  const { data: plan } = await db
    .from("plans")
    .select("id, name, price_usd")
    .eq("id", tenant.plan_id ?? "basic")
    .single();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Suscripción</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Plan</dt>
            <dd className="font-medium text-gray-900">{plan?.name ?? tenant.plan_id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Precio</dt>
            <dd className="font-medium text-gray-900">
              {plan ? `$${plan.price_usd}/mes` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Estado</dt>
            <dd className="font-medium text-gray-900">
              {statusLabel[tenant.status] ?? tenant.status}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Desde</dt>
            <dd className="font-medium text-gray-900">
              {new Date(tenant.created_at).toLocaleDateString("es-EC")}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          El cobro y cambio de plan se gestiona manualmente por ahora.
        </p>
      </div>
    </div>
  );
}
