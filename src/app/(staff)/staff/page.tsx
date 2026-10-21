export const instant = false;

import { createClient } from "@/lib/supabase-server";
import { getMemberRole } from "@/modules/auth/queries";
import { findCustomerCard } from "@/modules/tenants/queries";
import { staffStamp, staffRedeem } from "@/modules/tenants/actions";

interface Props {
  searchParams: Promise<{ phone?: string; stamped?: string; redeemed?: string; error?: string }>;
}

export default async function StaffPage({ searchParams }: Props) {
  const { phone, stamped, redeemed, error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const member = await getMemberRole(supabase, user!.id);

  const trimmedPhone = phone?.trim();
  const result = trimmedPhone ? await findCustomerCard(member!.tenant_id, trimmedPhone) : null;

  const cards = result?.cards as { id: string; stamp_count: number; status: string; public_token: string; programs: { stamps_required: number; reward_text: string } | { stamps_required: number; reward_text: string }[] | null }[] | null;
  const card = Array.isArray(cards) ? cards[0] : cards ?? null;
  const prog = card ? (Array.isArray(card.programs) ? card.programs[0] : card.programs) : null;
  const stampsRequired = prog?.stamps_required ?? 10;
  const stampCount = card?.stamp_count ?? 0;
  const canRedeem = stampCount >= stampsRequired;

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <h2 className="text-base font-semibold text-gray-900">Buscar cliente</h2>

      {/* Phone search form — GET so the phone stays in the URL */}
      <form method="get" action="/staff" className="flex gap-2">
        <input
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="Teléfono del cliente"
          required
          autoFocus
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Buscar
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{decodeURIComponent(error)}</p>
      )}
      {stamped && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2 font-medium">¡Sello agregado!</p>
      )}
      {redeemed && (
        <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2 font-medium">🎁 Premio canjeado. Tarjeta reiniciada.</p>
      )}

      {trimmedPhone && !result && (
        <p className="text-sm text-gray-500 text-center py-4">Cliente no encontrado con ese teléfono.</p>
      )}

      {result && card && (
        <div className="bg-[#0d1f1a] rounded-2xl p-6 text-white">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-sm font-semibold">{result.name ?? result.phone}</p>
              {result.name && <p className="text-xs text-white/40 mt-0.5">{result.phone}</p>}
              {prog && <p className="text-xs text-white/60 mt-2">{prog.reward_text}</p>}
            </div>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic" }}
            >
              {stampCount}
              <span className="text-white/30 text-base">/{stampsRequired}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {Array.from({ length: stampsRequired }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: i < stampCount ? "#C8963E" : "rgba(255,255,255,0.08)",
                  border: i < stampCount ? "none" : "1.5px dashed rgba(255,255,255,0.2)",
                  color: i < stampCount ? "white" : "transparent",
                }}
              >
                ✓
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <form action={staffStamp}>
              <input type="hidden" name="card_id" value={card.id} />
              <input type="hidden" name="phone" value={trimmedPhone} />
              <button
                type="submit"
                disabled={canRedeem}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: canRedeem ? "rgba(255,255,255,0.1)" : "#C8963E",
                  color: canRedeem ? "rgba(255,255,255,0.3)" : "white",
                  cursor: canRedeem ? "not-allowed" : "pointer",
                }}
              >
                + Agregar sello
              </button>
            </form>

            {canRedeem && (
              <form action={staffRedeem}>
                <input type="hidden" name="card_id" value={card.id} />
                <input type="hidden" name="phone" value={trimmedPhone} />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-[#0d1f1a] hover:bg-white/90 transition-colors"
                >
                  🎁 Canjear
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
