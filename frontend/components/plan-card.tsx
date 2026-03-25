import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/button";
import { PlanBadge } from "@/components/badge";
import { Plan } from "@/lib/types";

const perks: Record<string, string[]> = {
  free: ["Hasta 3 propiedades activas", "WhatsApp visible", "Datos reales obligatorios"],
  basic: ["Más publicaciones y fotos", "Mejor posicionamiento", "Insignia visual destacada"],
  premium: ["Prioridad en búsquedas", "Mayor exposición en home", "Ideal para inmobiliarias activas"]
};

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className="glass-panel flex h-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-slate-500">Plan</p>
          <h3 className="mt-2 text-3xl font-semibold">{plan.name}</h3>
        </div>
        <PlanBadge label={plan.badge_label} slug={plan.slug} />
      </div>

      <p className="text-sm leading-7 text-slate-600">
        Hasta {plan.max_properties} propiedades activas y {plan.max_images_per_property} imágenes por aviso.
      </p>

      <div className="space-y-3">
        {(perks[plan.slug] ?? perks.free).map((perk) => (
          <div key={perk} className="flex items-center gap-3 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-pine" />
            <span>{perk}</span>
          </div>
        ))}
      </div>

      <Button href="/publicar" variant={plan.slug === "premium" ? "secondary" : "ghost"} className="mt-auto">
        Quiero este plan
      </Button>
    </article>
  );
}
