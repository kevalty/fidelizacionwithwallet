import { createTenant } from "@/modules/tenants/actions";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function NuevoNegocioPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuevo negocio</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={createTenant} className="space-y-8">
        {/* Negocio */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Negocio</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Café Riobamba"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="cafe-riobamba"
            />
            <p className="text-xs text-gray-400 mt-1">Solo letras minúsculas, números y guiones.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              name="plan_id"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              <option value="basic">Básico — $17/mes</option>
              <option value="pro">Pro — $35/mes</option>
              <option value="chain">Cadena — $79/mes</option>
            </select>
          </div>
        </section>

        {/* Local */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Local principal</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del local *
            </label>
            <input
              name="location_name"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Sucursal Centro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              name="location_address"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Av. Daniel León Borja, Riobamba"
            />
          </div>
        </section>

        {/* Programa */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Programa de sellos</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sellos requeridos *
            </label>
            <input
              name="stamps_required"
              type="number"
              min={1}
              max={50}
              defaultValue={5}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Premio *
            </label>
            <input
              name="reward_text"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="1 café gratis"
            />
          </div>
        </section>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 w-full"
        >
          Crear negocio
        </button>
      </form>
    </div>
  );
}
