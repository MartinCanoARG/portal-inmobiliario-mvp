import Link from "next/link";

import { Container } from "@/components/container";

const links = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/publicar", label: "Publicar" },
  { href: "/ingresar", label: "Panel" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-sand/85 backdrop-blur-xl">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
            PI
          </div>
          <div>
            <div className="font-heading text-2xl font-semibold">Portal Inmobiliario</div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Local market MVP</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
