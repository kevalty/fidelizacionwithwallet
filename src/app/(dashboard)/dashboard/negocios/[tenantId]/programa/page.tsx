export const instant = false;

import { getTenantProgram } from "@/modules/tenants/queries";
import { updateProgram } from "@/modules/tenants/actions";

interface Props {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function ProgramaPage({ params, searchParams }: Props) {
  const { tenantId } = await params;
  const { error } = await searchParams;
  const program = await getTenantProgram(tenantId);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Programa de sellos</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {decodeURIComponent(error)}
        </div>
      )}

      {program === null ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500">Este negocio aún no tiene programa activo.</p>
        </div>
      ) : (
        <form action={updateProgram} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <input type="hidden" name="program_id" value={program.id} />
          <input type="hidden" name="tenant_id" value={tenantId} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sellos requeridos
            </label>
            <input
              name="stamps_required"
              type="number"
              min={1}
              max={50}
              defaultValue={program.stamps_required}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Premio
            </label>
            <input
              name="reward_text"
              defaultValue={program.reward_text}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Guardar cambios
          </button>
        </form>
      )}
    </div>
  );
}
