export const instant = false;

import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { registerCustomer } from "@/modules/tenants/actions";

interface Props {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function TagPage({ params, searchParams }: Props) {
  const { tagId } = await params;
  const { error } = await searchParams;

  // Returning customer: redirect to their card
  const cookieStore = await cookies();
  const savedToken = cookieStore.get(`card_${tagId}`)?.value;
  if (savedToken && !error) redirect(`/c/${savedToken}`);

  const db = createServiceClient();
  const { data: tenant } = await db
    .from("tenants")
    .select("id, name, programs(stamps_required, reward_text, active)")
    .eq("slug", tagId)
    .in("status", ["active", "trial"])
    .single();

  if (!tenant) notFound();

  const programs = tenant.programs as { stamps_required: number; reward_text: string; active: boolean }[] | null;
  const program = Array.isArray(programs) ? programs.find((p) => p.active) : programs;

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#111210] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-[#C8963E]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic" }}>
              {tenant.name[0]}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#111210]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            {tenant.name}
          </h1>
          {program && (
            <p className="text-sm text-gray-500">
              Junta {program.stamps_required} sellos y gana: <strong>{program.reward_text}</strong>
            </p>
          )}
        </div>

        {/* Form */}
        <form action={registerCustomer} className="space-y-4">
          <input type="hidden" name="slug" value={tagId} />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 text-center">
              {decodeURIComponent(error)}
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
              <input
                name="phone"
                type="tel"
                placeholder="0987654321"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#111210]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (opcional)</label>
              <input
                name="name"
                type="text"
                placeholder="Tu nombre"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#111210]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#111210] text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors"
          >
            Unirme al programa
          </button>

          <p className="text-xs text-gray-400 text-center">
            Al registrarte aceptas que {tenant.name} guarde tu teléfono para enviarte
            información del programa de fidelización.
          </p>
        </form>
      </div>
    </div>
  );
}
