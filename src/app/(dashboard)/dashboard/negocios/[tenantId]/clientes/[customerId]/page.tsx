export const instant = false;

import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerDetail } from "@/modules/tenants/queries";
import { addStamp, redeemCard, createCardForCustomer } from "@/modules/tenants/actions";

interface Props {
  params: Promise<{ tenantId: string; customerId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function CustomerDetailPage({ params, searchParams }: Props) {
  const { tenantId, customerId } = await params;
  const { error } = await searchParams;
  const customer = await getCustomerDetail(tenantId, customerId);
  if (!customer) notFound();

  const card = customer.card;
  const program = Array.isArray(card?.programs) ? card.programs[0] : card?.programs;
  const stampCount = card?.stamp_count ?? 0;
  const stampsRequired = program?.stamps_required ?? 10;
  const rewardText = program?.reward_text ?? "";
  const canRedeem = stampCount >= stampsRequired;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/negocios/${tenantId}/clientes`} className="text-sm text-gray-500 hover:text-gray-900">
          ← Clientes
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">{customer.name ?? customer.phone ?? customer.email}</h2>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{decodeURIComponent(error)}</p>
      )}

      {/* Customer info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex gap-6 text-sm">
        {customer.phone && <div><span className="text-gray-400">Teléfono </span><span className="text-gray-900">{customer.phone}</span></div>}
        {customer.email && <div><span className="text-gray-400">Correo </span><span className="text-gray-900">{customer.email}</span></div>}
        <div><span className="text-gray-400">Registro </span><span className="text-gray-900">{new Date(customer.created_at).toLocaleDateString("es-EC")}</span></div>
      </div>

      {card ? (
        <>
          {/* Loyalty card visual */}
          <div className="bg-[#0d1f1a] rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Tarjeta de sellos</p>
                <p className="text-sm font-medium">{rewardText}</p>
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontStyle: "italic" }}>
                {stampCount}<span className="text-white/30 text-base">/{stampsRequired}</span>
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

            {/* Actions */}
            <div className="flex gap-3">
              <form action={addStamp}>
                <input type="hidden" name="card_id" value={card.id} />
                <input type="hidden" name="tenant_id" value={tenantId} />
                <input type="hidden" name="customer_id" value={customerId} />
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
                <form action={redeemCard}>
                  <input type="hidden" name="card_id" value={card.id} />
                  <input type="hidden" name="tenant_id" value={tenantId} />
                  <input type="hidden" name="customer_id" value={customerId} />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-[#0d1f1a] hover:bg-white/90 transition-colors"
                  >
                    🎁 Canjear premio
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* History */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Últimos sellos</p>
              {customer.stamps.length === 0 ? (
                <p className="text-sm text-gray-400">Sin sellos aún</p>
              ) : (
                <ul className="space-y-2">
                  {customer.stamps.slice(0, 8).map((s) => (
                    <li key={s.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{s.method === "staff_scan" ? "Personal" : "Cliente"}</span>
                      <span className="text-gray-400">{new Date(s.stamped_at).toLocaleDateString("es-EC")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Canjes</p>
              {customer.redemptions.length === 0 ? (
                <p className="text-sm text-gray-400">Sin canjes aún</p>
              ) : (
                <ul className="space-y-2">
                  {customer.redemptions.map((r) => (
                    <li key={r.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">Premio canjeado</span>
                      <span className="text-gray-400">{new Date(r.redeemed_at).toLocaleDateString("es-EC")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
          <p className="text-sm text-gray-500">Este cliente no tiene tarjeta asignada.</p>
          <form action={createCardForCustomer}>
            <input type="hidden" name="tenant_id" value={tenantId} />
            <input type="hidden" name="customer_id" value={customerId} />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              Crear tarjeta
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
