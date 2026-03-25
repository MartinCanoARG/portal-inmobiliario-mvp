import { Search } from "lucide-react";

import { Button } from "@/components/button";

const cities = ["Rosario", "Funes", "Roldán", "San Lorenzo", "Villa Gobernador Gálvez", "Álvarez", "Ibarlucea"];

export function SearchBar({
  action = "/propiedades",
  defaults = {}
}: {
  action?: string;
  defaults?: Record<string, string | string[] | undefined>;
}) {
  return (
    <form action={action} className="glass-panel grid gap-4 p-5 md:grid-cols-5">
      <label className="space-y-2 text-sm">
        <span className="font-semibold text-slate-700">Operación</span>
        <select
          name="operation"
          defaultValue={typeof defaults.operation === "string" ? defaults.operation : ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-gold"
        >
          <option value="">Todas</option>
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
        </select>
      </label>

      <label className="space-y-2 text-sm">
        <span className="font-semibold text-slate-700">Tipo</span>
        <select
          name="property_type"
          defaultValue={typeof defaults.property_type === "string" ? defaults.property_type : ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-gold"
        >
          <option value="">Todos</option>
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
        <span className="font-semibold text-slate-700">Ciudad</span>
        <select
          name="city"
          defaultValue={typeof defaults.city === "string" ? defaults.city : ""}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-gold"
        >
          <option value="">Cualquiera</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm">
        <span className="font-semibold text-slate-700">Zona o barrio</span>
        <input
          name="zone"
          defaultValue={typeof defaults.zone === "string" ? defaults.zone : ""}
          placeholder="Ej. Pichincha"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-gold"
        />
      </label>

      <div className="flex items-end">
        <Button type="submit" variant="secondary" className="w-full gap-2">
          <Search className="h-4 w-4" />
          Buscar propiedades
        </Button>
      </div>
    </form>
  );
}
