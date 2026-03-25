"use client";

import dynamic from "next/dynamic";

import type { PropertyRecord } from "@/lib/types";

const PropertyMapClient = dynamic(() => import("@/components/property-map-client"), {
  ssr: false,
  loading: () => (
    <div className="map-shell overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
      <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-slate-500">
        Cargando mapa...
      </div>
    </div>
  )
});

export function PropertyMap({
  properties,
  height = "420px"
}: {
  properties: PropertyRecord[];
  height?: string;
}) {
  return <PropertyMapClient properties={properties} height={height} />;
}
