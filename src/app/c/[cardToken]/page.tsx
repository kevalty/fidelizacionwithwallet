export const instant = false;

import { notFound } from "next/navigation";
import { getCardByToken } from "@/modules/tenants/queries";

interface Props {
  params: Promise<{ cardToken: string }>;
}

export default async function CardPage({ params }: Props) {
  const { cardToken } = await params;
  const card = await getCardByToken(cardToken);
  if (!card) notFound();

  const program = Array.isArray(card.programs) ? card.programs[0] : card.programs;
  const customer = Array.isArray(card.customers) ? card.customers[0] : card.customers;
  const tenant = Array.isArray(card.tenants) ? card.tenants[0] : card.tenants;

  const stampsRequired = program?.stamps_required ?? 10;
  const stampCount = card.stamp_count;
  const rewardText = program?.reward_text ?? "";
  const canRedeem = stampCount >= stampsRequired;

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Tenant name */}
        <div className="text-center">
          <p className="text-sm text-gray-500">{tenant?.name}</p>
          <h1 className="text-xl font-bold text-[#111210] mt-1" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
            {customer?.name ? `Hola, ${customer.name}` : "Tu tarjeta de sellos"}
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[#0d1f1a] rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Tarjeta de sellos</p>
              <p className="text-sm font-medium">{rewardText}</p>
            </div>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic" }}
            >
              {stampCount}
              <span className="text-white/30 text-base">/{stampsRequired}</span>
            </span>
          </div>

          {/* Stamp circles */}
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

          {canRedeem && (
            <div className="bg-[#C8963E]/20 border border-[#C8963E]/40 rounded-xl px-4 py-3 text-center">
              <p className="text-sm font-semibold text-[#C8963E]">🎁 ¡Premio disponible!</p>
              <p className="text-xs text-white/60 mt-1">Muestra esta pantalla al personal</p>
            </div>
          )}
        </div>

        {/* Progress text */}
        {!canRedeem && (
          <p className="text-center text-sm text-gray-500">
            Te faltan <strong className="text-[#111210]">{stampsRequired - stampCount}</strong> sello{stampsRequired - stampCount !== 1 ? "s" : ""} para ganar: {rewardText}
          </p>
        )}

        {/* Add to wallet placeholder */}
        <button
          disabled
          className="w-full border border-gray-200 bg-white text-gray-400 py-3 rounded-xl text-sm font-medium cursor-not-allowed"
        >
          Agregar a la wallet — próximamente
        </button>
      </div>
    </div>
  );
}
