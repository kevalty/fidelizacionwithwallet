export const instant = false;

import Link from "next/link";
import { getTenantClients } from "@/modules/tenants/queries";
import { createServiceClient } from "@/lib/supabase";

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function ClientesPage({ params }: Props) {
  const { tenantId } = await params;
  const [clients, tenantRow] = await Promise.all([
    getTenantClients(tenantId),
    createServiceClient()
      .from("tenants")
      .select("slug")
      .eq("id", tenantId)
      .single()
      .then(({ data }) => data),
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Clientes</h2>
        <Link
          href={`/api/tenants/${tenantId}/export`}
          className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >
          Exportar CSV
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {clients.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500 text-center">
            No hay clientes registrados aún.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Nombre / Teléfono", "Correo", "Sellos", "Estado tarjeta", "Registro"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((c) => {
                const card = Array.isArray(c.cards) ? c.cards[0] : null;
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{c.phone ?? "—"}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{c.email ?? "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{card?.stamp_count ?? 0}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{card?.status ?? "—"}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(c.created_at).toLocaleDateString("es-EC")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
