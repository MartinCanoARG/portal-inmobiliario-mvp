export const dynamic = "force-dynamic";

import { Building2, HousePlus, Layers3, Users } from "lucide-react";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PlanCard } from "@/components/plan-card";
import { getPlans } from "@/lib/api";

export default async function PublishPage() {
  const plans = await getPlans();

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-panel p-8">
            <span className="eyebrow">Captación de anunciantes</span>
            <h1 className="mt-6 text-5xl font-semibold">Publicá rápido, mostrá tu marca y generá contactos directos.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Este MVP está pensado para inmobiliarias y particulares que quieren visibilidad local sin complejidad
              operativa. La plataforma muestra avisos, prioriza por plan y dirige las consultas al anunciante.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ingresar" variant="secondary">
                Ingresar al panel
              </Button>
              <Button href="/propiedades" variant="ghost">
                Ver ejemplo público
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Building2, "Inmobiliarias", "Perfil con marca, matrícula, web y mejor posicionamiento."],
              [Users, "Particulares", "Publicaciones simples con contacto directo y badge claro de Particular."],
              [HousePlus, "Más alcance", "Listado, detalle y mapa para una exposición comercial profesional."],
              [Layers3, "Planes escalables", "Free, Básico y Premium listos para evolucionar a monetización real."]
            ].map(([Icon, title, copy]) => (
              <div key={title as string} className="glass-panel p-6">
                <Icon className="h-8 w-8 text-gold" />
                <h2 className="mt-4 text-2xl font-semibold">{title as string}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="space-y-6">
          <div>
            <span className="eyebrow">Planes comerciales</span>
            <h2 className="mt-4 text-4xl font-semibold">Elegí cómo querés posicionarte dentro del portal.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
