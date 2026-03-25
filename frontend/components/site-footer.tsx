import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-[#efe7dc]">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Un marketplace inmobiliario creíble para validar rápido.</h3>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            La plataforma publica avisos, no intermedia operaciones ni garantiza la exactitud absoluta del contenido.
            Cada anunciante es responsable por la información cargada y el portal puede moderar, pausar o eliminar
            publicaciones.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p>Contacto demo: hola@portalinmobiliario.local</p>
          <p>Panel para anunciantes: usuario demo y administración incluidos.</p>
          <p>Hecho para correr en local con Next.js, Django REST Framework y SQLite.</p>
        </div>
      </Container>
    </footer>
  );
}
