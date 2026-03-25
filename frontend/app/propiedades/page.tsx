export const dynamic = "force-dynamic";

import { Container } from "@/components/container";
import { ResultsView } from "@/components/results-view";
import { SearchBar } from "@/components/search-bar";
import { getProperties } from "@/lib/api";

function buildQuery(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  const keys = ["operation", "property_type", "city", "zone", "min_price", "max_price", "min_bedrooms", "garage", "ordering"];
  keys.forEach((key) => {
    const value = searchParams[key];
    if (typeof value === "string" && value) {
      params.set(key, value);
    }
  });

  return params.toString();
}

export default async function PropertiesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const properties = await getProperties(buildQuery(resolvedParams));

  return (
    <div className="py-12">
      <Container className="space-y-8">
        <div className="space-y-4">
          <span className="eyebrow">Resultados publicos</span>
          <h1 className="text-5xl font-semibold">Busca por zona, operacion y atributos clave.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            El ranking prioriza planes Premium y Basico antes que Free; dentro de cada grupo, los avisos mas recientes
            aparecen primero.
          </p>
        </div>

        <SearchBar defaults={resolvedParams} />

        <form action="/propiedades" className="glass-panel grid gap-4 p-5 md:grid-cols-5">
          {Object.entries(resolvedParams)
            .filter(([key]) => ["operation", "property_type", "city", "zone"].includes(key))
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={typeof value === "string" ? value : ""} />
            ))}

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Precio minimo</span>
            <input
              name="min_price"
              defaultValue={typeof resolvedParams.min_price === "string" ? resolvedParams.min_price : ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Precio maximo</span>
            <input
              name="max_price"
              defaultValue={typeof resolvedParams.max_price === "string" ? resolvedParams.max_price : ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Dormitorios minimos</span>
            <input
              name="min_bedrooms"
              defaultValue={typeof resolvedParams.min_bedrooms === "string" ? resolvedParams.min_bedrooms : ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Ordenar</span>
            <select
              name="ordering"
              defaultValue={typeof resolvedParams.ordering === "string" ? resolvedParams.ordering : ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
            >
              <option value="">Prioridad del portal</option>
              <option value="-price">Precio mayor a menor</option>
              <option value="price">Precio menor a mayor</option>
              <option value="-square_meters">Mas metros cuadrados</option>
              <option value="-published_at">Mas recientes</option>
            </select>
          </label>
          <label className="flex items-end gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              name="garage"
              value="true"
              defaultChecked={resolvedParams.garage === "true"}
              className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
            />
            <span className="text-sm font-semibold text-slate-700">Solo con cochera</span>
          </label>
        </form>

        {properties.length ? (
          <ResultsView properties={properties} />
        ) : (
          <div className="glass-panel p-10 text-center">
            <h2 className="text-3xl font-semibold">No encontramos propiedades con esos filtros.</h2>
            <p className="mt-3 text-slate-600">Proba ampliar ciudad, zona o rango de precio para ver mas avisos.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
