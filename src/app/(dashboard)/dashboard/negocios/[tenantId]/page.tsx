export const instant = false;

import Link from "next/link";
import { getTenant, getTenantStats } from "@/modules/tenants/queries";
import { notFound } from "next/navigation";

const planNames: Record<string, string> = {
  basic: "Básico",
  pro: "Pro",
  chain: "Cadena",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trial: "bg-yellow-100 text-yellow-800",
  suspended: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabel: Record<string, string> = {
  active: "Activo",
  trial: "Prueba",
  suspended: "Suspendido",
  cancelled: "Cancelado",
};

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function TenantPage({ params }: Props) {
  const { tenantId } = await params;
  let tenant, stats;
  try {
    [tenant, stats] = await Promise.all([getTenant(tenantId), getTenantStats(tenantId)]);
  } catch {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: stats.customers, label: "Clientes" },
          { value: stats.stamps, label: "Sellos" },
          { value: stats.redemptions, label: "Canjes" },
          { value: stats.activeCards, label: "Tarjetas activas" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-4xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Información</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Nombre</dt>
            <dd className="font-medium text-gray-900">{tenant.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Slug</dt>
            <dd className="font-medium text-gray-900">{tenant.slug}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Plan</dt>
            <dd className="font-medium text-gray-900">{planNames[tenant.plan_id ?? "basic"] ?? tenant.plan_id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Estado</dt>
            <dd>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[tenant.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {statusLabel[tenant.status] ?? tenant.status}
              </span>
            </dd>
          </div>
        </dl>
        <Link
          href={`/dashboard/negocios/${tenantId}/programa`}
          className="inline-block border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          Editar programa →
        </Link>
      </div>
    </div>
  );
}
