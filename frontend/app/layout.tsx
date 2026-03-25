import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Portal Inmobiliario Local",
  description: "MVP para publicar, buscar y gestionar propiedades en una ciudad y zonas cercanas."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-sand text-ink antialiased`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(181,137,77,0.16),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(245,241,235,0.96))]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
