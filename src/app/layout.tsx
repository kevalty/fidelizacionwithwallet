import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fideliza — Tarjetas de sellos para tu negocio",
  description:
    "Programa de fidelización con Apple Wallet y Google Wallet. Sin app, sin complicaciones.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${jakarta.variable}`}
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          backgroundColor: "#FAFAF7",
          color: "#111210",
        }}
      >
        {children}
      </body>
    </html>
  );
}
