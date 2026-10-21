"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Inicio", icon: "◈" },
  { href: "/dashboard/negocios", label: "Negocios", icon: "⊞" },
];

export default function NavSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        flexShrink: 0,
        backgroundColor: "#111210",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 22,
            color: "white",
            letterSpacing: "-0.01em",
          }}
        >
          Fideliza
        </span>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
          Panel de control
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {NAV.map(({ href, label, icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 2,
                textDecoration: "none",
                backgroundColor: active ? "rgba(200,150,62,0.15)" : "transparent",
                color: active ? "#C8963E" : "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
                border: active
                  ? "1px solid rgba(200,150,62,0.25)"
                  : "1px solid transparent",
              }}
            >
              <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: "16px 12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
            paddingLeft: 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userEmail}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "9px 12px",
            borderRadius: 10,
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
