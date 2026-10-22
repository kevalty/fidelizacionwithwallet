export const instant = false;

import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getTenant } from "@/modules/tenants/queries";
import PrintButton from "./print-button";

interface Props {
  params: Promise<{ tenantId: string }>;
}

export default async function QRPage({ params }: Props) {
  const { tenantId } = await params;
  let tenant;
  try { tenant = await getTenant(tenantId); } catch { notFound(); }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://fidelizacionwithwallet.vercel.app";
  const url = `${base}/t/${tenant.slug}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 2, width: 300 });

  return (
    <div className="p-6 max-w-sm mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">QR de registro</h2>
        <p className="text-sm text-gray-500 mt-1">Pégalo en la mesa o en el mostrador.</p>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 inline-block"
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <p className="text-xs text-gray-400 break-all">{url}</p>

      <PrintButton />
    </div>
  );
}
