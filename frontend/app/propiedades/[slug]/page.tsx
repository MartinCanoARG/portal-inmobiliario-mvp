export const dynamic = "force-dynamic";

import { Bath, BedDouble, CarFront, ExternalLink, MapPin, Phone, Ruler, Trees, Waves } from "lucide-react";

import { PlanBadge } from "@/components/badge";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PropertyCard } from "@/components/property-card";
import { PropertyMap } from "@/components/property-map";
import { getProperties, getProperty } from "@/lib/api";
import { compactDate, formatPrice } from "@/lib/format";

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  const related = (await getProperties(`city=${encodeURIComponent(property.city)}`))
    .filter((item) => item.slug !== property.slug)
    .slice(0, 2);

  const whatsapp = property.advertiser.whatsapp
    ? `https://wa.me/${property.advertiser.whatsapp.replace(/[^\d]/g, "")}`
    : null;

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
              <div
                className="min-h-[460px] rounded-[32px] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.15), rgba(15,23,42,0.45)), url(${property.cover_image_url})`
                }}
              />
              <div className="grid gap-4">
                {(property.images ?? []).slice(1, 3).map((image) => (
                  <div
                    key={image.id}
                    className="min-h-[220px] rounded-[28px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.image_url})` }}
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <PlanBadge label={property.plan.badge_label} slug={property.plan.slug} />
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{property.operation_label}</span>
                  </div>
                  <h1 className="mt-5 text-5xl font-semibold">{property.title}</h1>
                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.address || property.zone}, {property.city}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-semibold text-ink">{formatPrice(property.price, property.currency)}</p>
                  <p className="mt-2 text-sm text-slate-500">Publicado {compactDate(property.published_at)}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  [<Ruler key="r" className="h-4 w-4 text-gold" />, `${property.square_meters} m2`],
                  [<BedDouble key="b" className="h-4 w-4 text-gold" />, `${property.bedrooms} dorm.`],
                  [<Bath key="ba" className="h-4 w-4 text-gold" />, `${property.bathrooms} banos`],
                  [<CarFront key="c" className="h-4 w-4 text-gold" />, property.garage ? "Cochera" : "Sin cochera"],
                  [<Trees key="t" className="h-4 w-4 text-gold" />, property.patio ? "Patio" : "Sin patio"],
                  [<Waves key="w" className="h-4 w-4 text-gold" />, property.pool ? "Pileta" : "Sin pileta"]
                ].map(([icon, text], index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span>{text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rich-copy mt-8">
                <p>{property.description}</p>
              </div>
            </div>

            <div className="glass-panel p-6">
              <div className="mb-4">
                <h2 className="text-3xl font-semibold">Ubicacion y contexto</h2>
                <p className="mt-2 text-sm text-slate-600">
                  La direccion puede ser exacta o aproximada. Confirma siempre los detalles con el anunciante.
                </p>
              </div>
              <PropertyMap properties={[property]} height="420px" />
            </div>
          </div>

          <div className="space-y-6">
            <aside className="glass-panel space-y-6 p-8">
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: property.advertiser.logo_url
                      ? `url(${property.advertiser.logo_url})`
                      : "linear-gradient(135deg, #d6c5b0, #f5f1eb)"
                  }}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {property.advertiser.advertiser_type_label}
                  </p>
                  <h2 className="text-2xl font-semibold">{property.advertiser.public_display_name}</h2>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                <p>{property.advertiser.description}</p>
                {property.advertiser.license_number ? (
                  <p className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-700">
                    Matricula: {property.advertiser.license_number}
                  </p>
                ) : null}
                <p>Tipo de publicacion: {property.advertiser.advertiser_type_label}</p>
              </div>

              <div className="space-y-3">
                {whatsapp ? (
                  <Button href={whatsapp} variant="secondary" className="w-full gap-2">
                    Contactar por WhatsApp
                  </Button>
                ) : null}
                <Button href={`tel:${property.advertiser.phone}`} variant="ghost" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Llamar al anunciante
                </Button>
                {property.advertiser.website ? (
                  <Button href={property.advertiser.website} variant="ghost" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Visitar sitio web
                  </Button>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950">
                Este portal solo publica avisos y no intermedia operaciones. La exactitud del contenido depende del
                anunciante y la plataforma puede moderar o eliminar publicaciones.
              </div>
            </aside>
          </div>
        </div>

        {related.length ? (
          <section className="space-y-6">
            <h2 className="text-4xl font-semibold">Mas propiedades en {property.city}</h2>
            <div className="grid gap-6 xl:grid-cols-2">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
