"use client";

import { useState } from "react";

import { PropertyCard } from "@/components/property-card";
import { PropertyMap } from "@/components/property-map";
import { PropertyRecord } from "@/lib/types";

export function ResultsView({ properties }: { properties: PropertyRecord[] }) {
  const [mode, setMode] = useState<"grid" | "map">("grid");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          {properties.length} resultado{properties.length === 1 ? "" : "s"} publicados y ordenados por plan y recencia.
        </p>
        <div className="flex rounded-full border border-slate-200 bg-white p-1">
          {[
            ["grid", "Listado"],
            ["map", "Mapa"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value as "grid" | "map")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === value ? "bg-ink text-white" : "text-slate-600 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "map" ? (
        <PropertyMap properties={properties} height="640px" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
