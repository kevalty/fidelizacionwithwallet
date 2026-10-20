export const instant = false;

import Link from "next/link";
import { getAllTenants } from "@/modules/tenants/queries";

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

export default async function NegociosPage() {
  const tenants = await getAllTenants();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Negocios</h1>
        <Link
          href="/dashboard/negocios/nuevo"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Nuevo negocio
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {tenants.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500 text-center">
            No hay negocios registrados.{" "}
            <Link href="/dashboard/negocios/nuevo" className="text-black underline">
              Crear uno.
            </Link>
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Nombre", "Plan", "Estado", "Fecha"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-3">
                    <Link href={`/dashboard/negocios/${t.id}`} className="block">
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.slug}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{t.plan_id}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[t.status] ?? "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabel[t.status] ?? t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString("es-EC")}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link
                      href={`/dashboard/negocios/${t.id}`}
                      className="text-sm text-gray-400 hover:text-gray-900"
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
