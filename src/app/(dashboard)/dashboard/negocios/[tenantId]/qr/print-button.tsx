"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
    >
      Imprimir
    </button>
  );
}
