export const instant = false;

import Link from "next/link";
import { getGlobalStats, getAllTenants } from "@/modules/tenants/queries";

const statusLabel: Record<string, string> = {
  active: "Activo",
  trial: "Prueba",
  suspended: "Suspendido",
  cancelled: "Cancelado",
};

const statusColor: Record<string, string> = {
  active: "#16a34a",
  trial: "#C8963E",
  suspended: "#dc2626",
  cancelled: "#6b6b62",
};

export default async function DashboardPage() {
  const [stats, tenants] = await Promise.all([getGlobalStats(), getAllTenants()]);
  const recent = tenants.slice(0, 5);

  return (
    <div style={{ padding: "32px 32px", maxWidth: 900 }}>
      <h1
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 32,
          color: "var(--ink)",
          marginBottom: 32,
        }}
      >
        Inicio
      </h1>

      {/* Metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Negocios activos", value: stats.activeTenants },
          { label: "Clientes totales", value: stats.totalCustomers },
          { label: "Sellos hoy", value: stats.stampsToday },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              border: "1px solid var(--border)",
              padding: "24px 24px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 40,
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--muted)",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
            <div
              style={{
                marginTop: 12,
                height: 3,
                borderRadius: 999,
                backgroundColor: "var(--gold-light)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "40%",
                  borderRadius: 999,
                  backgroundColor: "var(--gold)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent tenants */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          border: "1px solid var(--border)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Negocios recientes
          </h2>
          <Link
            href="/dashboard/negocios"
            style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}
          >
            Ver todos →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p style={{ padding: "24px", fontSize: 14, color: "var(--muted)" }}>
            No hay negocios aún.
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {recent.map((t) => (
              <li key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <Link
                  href={`/dashboard/negocios/${t.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 24px",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "var(--gold-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--gold)",
                        fontFamily: "var(--font-fraunces), Georgia, serif",
                        fontStyle: "italic",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", margin: 0 }}>
                        {t.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{t.slug}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: statusColor[t.status] ?? "var(--muted)",
                      backgroundColor:
                        t.status === "active"
                          ? "rgba(22,163,74,0.1)"
                          : t.status === "trial"
                            ? "rgba(200,150,62,0.1)"
                            : "rgba(107,107,98,0.1)",
                      padding: "3px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {statusLabel[t.status] ?? t.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
