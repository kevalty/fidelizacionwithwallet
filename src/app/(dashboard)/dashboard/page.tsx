export const instant = false;

import Link from "next/link";
import { getGlobalStats, getAllTenants } from "@/modules/tenants/queries";

const statusLabel: Record<string, string> = {
  active: "Activo",
  trial: "Prueba",
  suspended: "Suspendido",
  cancelled: "Cancelado",
};

export default async function DashboardPage() {
  const [stats, tenants] = await Promise.all([getGlobalStats(), getAllTenants()]);
  const recent = tenants.slice(0, 5);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-4xl font-bold text-gray-900">{stats.activeTenants}</p>
          <p className="text-sm text-gray-500 mt-1">Negocios activos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-4xl font-bold text-gray-900">{stats.totalCustomers}</p>
          <p className="text-sm text-gray-500 mt-1">Clientes totales</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-4xl font-bold text-gray-900">{stats.stampsToday}</p>
          <p className="text-sm text-gray-500 mt-1">Sellos hoy</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Negocios recientes</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-4 text-sm text-gray-500">No hay negocios aún.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/dashboard/negocios/${t.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.slug}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {statusLabel[t.status] ?? t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
