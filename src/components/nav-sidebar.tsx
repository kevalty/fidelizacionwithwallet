"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/logout-button";

const links = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/negocios", label: "Negocios" },
];

interface NavSidebarProps {
  userEmail: string;
}

export default function NavSidebar({ userEmail }: NavSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-900 text-white w-56 flex-shrink-0 flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-gray-700">
        <span className="font-bold text-lg tracking-tight">Fideliza</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-900"
                  : "flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700 space-y-2">
        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
