"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { PlanBadge } from "@/components/badge";
import { getDashboardProperties } from "@/lib/api";
import { compactDate, formatPrice } from "@/lib/format";
import { AdvertiserProfile, PropertyRecord } from "@/lib/types";

export default function PanelPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdvertiserProfile | null>(null);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("portal_token");
    const storedProfile = window.localStorage.getItem("portal_profile");

    if (!token) {
      router.push("/ingresar");
      return;
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile) as AdvertiserProfile);
    }

    getDashboardProperties(token)
      .then((data) => setProperties(data))
      .catch(() => {
        window.localStorage.removeItem("portal_token");
        router.push("/ingresar");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    window.localStorage.removeItem("portal_token");
    window.localStorage.removeItem("portal_refresh");
    window.localStorage.removeItem("portal_profile");
    window.localStorage.removeItem("portal_user");
    router.push("/ingresar");
  }

  const activeProperties = properties.filter((property) => ["published", "paused", "reserved"].includes(property.state));

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow">Panel del anunciante</span>
            <h1 className="mt-4 text-5xl font-semibold">Gestioná tu cartera publicada.</h1>
          </div>
          <div className="flex gap-3">
            <Button href="/panel/propiedades/nueva" variant="secondary">
              Nueva propiedad
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="glass-panel space-y-5 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Perfil activo</p>
              <h2 className="mt-3 text-3xl font-semibold">{profile?.public_display_name ?? "Cargando..."}</h2>
              <p className="mt-2 text-sm text-slate-600">{profile?.advertiser_type_label ?? ""}</p>
            </div>

            {profile ? (
              <>
                <PlanBadge label={profile.plan.badge_label} slug={profile.plan.slug} />
                <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700">
                  <p>Límite de activas: {profile.plan.max_properties}</p>
                  <p>Imágenes por aviso: {profile.plan.max_images_per_property}</p>
                  <p>Activas hoy: {activeProperties.length}</p>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Teléfono: {profile.phone}</p>
                  <p>Email: {profile.email}</p>
                  {profile.license_number ? <p>Matrícula: {profile.license_number}</p> : null}
                </div>
              </>
            ) : null}
          </aside>

          <section className="glass-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold">Tus propiedades</h2>
                <p className="text-sm text-slate-600">Editá descripción, imágenes, precios y estado de publicación.</p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Cargando propiedades...</p>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold">{property.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {property.city}, {property.zone} · {formatPrice(property.price, property.currency)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          Estado: {property.state} · Publicado: {compactDate(property.published_at)}
                        </p>
                      </div>
                      <Link
                        href={`/panel/propiedades/${property.id}/editar`}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-50"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}

                {properties.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 px-6 py-10 text-center text-slate-600">
                    Todavía no hay propiedades cargadas para este anunciante.
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
