import Link from "next/link";
import { Bath, BedDouble, CarFront, MapPin, Ruler } from "lucide-react";

import { PlanBadge } from "@/components/badge";
import { formatPrice } from "@/lib/format";
import { PropertyRecord } from "@/lib/types";

export function PropertyCard({ property }: { property: PropertyRecord }) {
  return (
    <article className="glass-panel overflow-hidden">
      <div
        className="h-60 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.45)), url(${property.cover_image_url})`
        }}
      />

      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <PlanBadge label={property.plan.badge_label} slug={property.plan.slug} />
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {property.operation_label}
          </span>
        </div>

        <div>
          <p className="text-3xl font-semibold text-ink">{formatPrice(property.price, property.currency)}</p>
          <Link href={`/propiedades/${property.slug}`} className="mt-2 block text-2xl font-semibold hover:text-gold">
            {property.title}
          </Link>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            <span>
              {property.zone}, {property.city}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-gold" />
            <span>{property.square_meters} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-gold" />
            <span>{property.bedrooms} dorm.</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-gold" />
            <span>{property.bathrooms} baños</span>
          </div>
          <div className="flex items-center gap-2">
            <CarFront className="h-4 w-4 text-gold" />
            <span>{property.garage ? "Cochera" : "Sin cochera"}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <span>{property.advertiser.public_display_name}</span>
          <Link href={`/propiedades/${property.slug}`} className="font-semibold text-ink hover:text-gold">
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
