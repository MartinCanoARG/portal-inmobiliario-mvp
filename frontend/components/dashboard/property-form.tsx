"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { saveDashboardProperty } from "@/lib/api";
import { PropertyRecord } from "@/lib/types";

type PropertyFormProps = {
  property?: PropertyRecord;
  mode: "create" | "edit";
};

function toInitialState(property?: PropertyRecord) {
  return {
    title: property?.title ?? "",
    description: property?.description ?? "",
    price: property ? String(property.price) : "",
    currency: property?.currency ?? "USD",
    operation_type: property?.operation_type ?? "sale",
    property_type: property?.property_type ?? "apartment",
    city: property?.city ?? "Rosario",
    zone: property?.zone ?? "",
    address: property?.address ?? "",
    latitude: property?.latitude ?? "-32.944242",
    longitude: property?.longitude ?? "-60.650539",
    square_meters: property ? String(property.square_meters) : "0",
    rooms: property ? String(property.rooms) : "0",
    bedrooms: property ? String(property.bedrooms) : "0",
    bathrooms: property ? String(property.bathrooms) : "0",
    garage: property?.garage ?? false,
    patio: property?.patio ?? false,
    pool: property?.pool ?? false,
    age: property ? String(property.age) : "0",
    state: property?.state ?? "draft",
    image_urls: property?.images?.map((image) => image.image_url).join("\n") ?? ""
  };
}

export function PropertyForm({ property, mode }: PropertyFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(toInitialState(property));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const groupedFields = useMemo(
    () => [
      ["title", "Título"],
      ["city", "Ciudad"],
      ["zone", "Zona o barrio"],
      ["address", "Dirección"]
    ],
    []
  );

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const token = window.localStorage.getItem("portal_token");
    if (!token) {
      router.push("/ingresar");
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        square_meters: Number(form.square_meters),
        rooms: Number(form.rooms),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        age: Number(form.age),
        image_urls: form.image_urls
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      };

      await saveDashboardProperty(token, payload, property ? String(property.id) : undefined);
      router.push("/panel");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo guardar la propiedad.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-6 p-6">
      <div className="grid gap-5 md:grid-cols-2">
        {groupedFields.map(([key, label]) => (
          <label key={key} className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">{label}</span>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(event) => updateField(key as keyof typeof form, event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            />
          </label>
        ))}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-slate-700">Descripción</span>
        <textarea
          rows={5}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["price", "Precio"],
          ["square_meters", "m²"],
          ["rooms", "Ambientes"],
          ["bedrooms", "Dormitorios"],
          ["bathrooms", "Baños"],
          ["age", "Antigüedad"],
          ["latitude", "Latitud"],
          ["longitude", "Longitud"]
        ].map(([key, label]) => (
          <label key={key} className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">{label}</span>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(event) => updateField(key as keyof typeof form, event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700">Moneda</span>
          <select
            value={form.currency}
            onChange={(event) => updateField("currency", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700">Operación</span>
          <select
            value={form.operation_type}
            onChange={(event) => updateField("operation_type", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
          >
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700">Tipo</span>
          <select
            value={form.property_type}
            onChange={(event) => updateField("property_type", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
          >
            <option value="house">Casa</option>
            <option value="apartment">Departamento</option>
            <option value="land">Terreno</option>
            <option value="shop">Local</option>
            <option value="office">Oficina</option>
            <option value="garage">Cochera</option>
            <option value="country_house">Quinta</option>
            <option value="warehouse">Galpón</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-semibold text-slate-700">Estado</span>
          <select
            value={form.state}
            onChange={(event) => updateField("state", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicada</option>
            <option value="paused">Pausada</option>
            <option value="reserved">Reservada</option>
            <option value="sold">Vendida</option>
            <option value="rented">Alquilada</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["garage", "Cochera"],
          ["patio", "Patio"],
          ["pool", "Pileta"]
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <input
              type="checkbox"
              checked={form[key as keyof typeof form] as boolean}
              onChange={(event) => updateField(key as keyof typeof form, event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
            />
            <span className="text-sm font-semibold text-slate-700">{label}</span>
          </label>
        ))}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-semibold text-slate-700">Imágenes</span>
        <textarea
          rows={4}
          value={form.image_urls}
          onChange={(event) => updateField("image_urls", event.target.value)}
          placeholder="Una URL por línea"
          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
        />
      </label>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="secondary" className="min-w-44" onClick={undefined}>
          {saving ? "Guardando..." : mode === "create" ? "Crear propiedad" : "Guardar cambios"}
        </Button>
        <Button href="/panel" variant="ghost">
          Volver al panel
        </Button>
      </div>
    </form>
  );
}
