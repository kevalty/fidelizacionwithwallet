export const instant = false;

import Link from "next/link";
import { getTenant } from "@/modules/tenants/queries";
import { notFound } from "next/navigation";

const tabs = [
  { href: "", label: "Resumen" },
  { href: "/clientes", label: "Clientes" },
  { href: "/programa", label: "Programa" },
  { href: "/locales", label: "Locales" },
  { href: "/suscripcion", label: "Suscripción" },
];

interface Props {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}

export default async function TenantLayout({ children, params }: Props) {
  const { tenantId } = await params;
  let tenant;
  try {
    tenant = await getTenant(tenantId);
  } catch {
    notFound();
  }

  const base = `/dashboard/negocios/${tenantId}`;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-0">
        <p className="text-xs text-gray-400 mb-1">Negocio</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{tenant.name}</h1>
        <nav className="flex gap-1">
          {tabs.map(({ href, label }) => (
            <Link
              key={href}
              href={`${base}${href}`}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
