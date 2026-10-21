export const instant = false;

import { createCustomer } from "@/modules/tenants/actions";

interface Props {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function NuevoClientePage({ params, searchParams }: Props) {
  const { tenantId } = await params;
  const { error } = await searchParams;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Nuevo cliente</h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{decodeURIComponent(error)}</p>
      )}

      <form action={createCustomer} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <input type="hidden" name="tenant_id" value={tenantId} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (opcional)</label>
          <input name="name" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input name="phone" type="tel" placeholder="0991234567" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo (opcional)</label>
          <input name="email" type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black" />
        </div>

        <p className="text-xs text-gray-400">Al registrar confirmas que el cliente dio su consentimiento para guardar sus datos.</p>

        <button type="submit" className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
          Crear cliente y tarjeta
        </button>
      </form>
    </div>
  );
}
