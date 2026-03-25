export const dynamic = "force-dynamic";

import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PlanCard } from "@/components/plan-card";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { getPlans, getProperties } from "@/lib/api";

export default async function HomePage() {
  const [plans, properties] = await Promise.all([getPlans(), getProperties()]);
  const featured = properties.slice(0, 6);

  return (
    <div className="pb-20">
      <section className="hero-grid relative overflow-hidden py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <span className="eyebrow">Portal local para venta y alquiler</span>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold leading-none text-ink sm:text-6xl lg:text-7xl">
                Un marketplace inmobiliario serio para destacar propiedades y captar contactos reales.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Publicaciones para inmobiliarias y particulares, búsqueda por ciudad y barrio, resultados con mapa y
                un panel privado listo para operar en local desde el primer día.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button href="/propiedades" variant="secondary" className="gap-2">
                Explorar propiedades
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/publicar" variant="ghost">
                Publicá tus propiedades
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Búsqueda ordenada", "Premium, Básico y Free con prioridad comercial clara."],
                ["Mapa interactivo", "Visualizá resultados y detalle de ubicación en OpenStreetMap."],
                ["Panel privado", "Alta, edición y control de estado para cada aviso."]
              ].map(([title, copy]) => (
                <div key={title} className="glass-panel p-5">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <SearchBar />
            <div className="glass-panel grid gap-5 p-6 md:grid-cols-3">
              <div>
                <Building2 className="h-8 w-8 text-gold" />
                <p className="mt-3 text-3xl font-semibold">12+</p>
                <p className="text-sm text-slate-600">Propiedades demo listas para mostrar.</p>
              </div>
              <div>
                <Sparkles className="h-8 w-8 text-gold" />
                <p className="mt-3 text-3xl font-semibold">3 planes</p>
                <p className="text-sm text-slate-600">Modelo comercial pensado para monetizar rápido.</p>
              </div>
              <div>
                <ShieldCheck className="h-8 w-8 text-gold" />
                <p className="mt-3 text-3xl font-semibold">Sin fricción</p>
                <p className="text-sm text-slate-600">El visitante busca sin login y contacta directo al anunciante.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Propiedades destacadas</span>
              <h2 className="mt-4 text-4xl font-semibold">Inventario listo para demo comercial</h2>
            </div>
            <Button href="/propiedades" variant="ghost">
              Ver todos los resultados
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel p-8">
            <span className="eyebrow">Para inmobiliarias y particulares</span>
            <h2 className="mt-6 text-4xl font-semibold">Publicá con una presencia que inspire confianza.</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Mostrá tu marca, matrícula, canales de contacto y destacá avisos según el plan. El portal no intermedia
              operaciones: funciona como vitrina profesional para atraer consultas calificadas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/publicar" variant="secondary">
                Conocer planes
              </Button>
              <Button href="/ingresar" variant="ghost">
                Ingresar al panel
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
