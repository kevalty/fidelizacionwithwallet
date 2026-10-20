export const instant = false;

import { getTenantLocations } from "@/modules/tenants/queries";
import { addLocation } from "@/modules/tenants/actions";

interface Props {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function LocalesPage({ params, searchParams }: Props) {
  const { tenantId } = await params;
  const { error } = await searchParams;
  const locations = await getTenantLocations(tenantId);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Locales</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {decodeURIComponent(error)}
        </div>
      )}

      <div className="space-y-3">
        {locations.length === 0 ? (
          <p className="text-sm text-gray-500">No hay locales registrados.</p>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            >
              <p className="text-sm font-medium text-gray-900">{loc.name}</p>
              {loc.address && (
                <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
              )}
            </div>
          ))
        )}
      </div>

      <form action={addLocation} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Agregar local</h3>
        <input type="hidden" name="tenant_id" value={tenantId} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            name="name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Sucursal Norte"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            name="address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Av. Canónigo Ramos, Riobamba"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Agregar local
        </button>
      </form>
    </div>
  );
}
