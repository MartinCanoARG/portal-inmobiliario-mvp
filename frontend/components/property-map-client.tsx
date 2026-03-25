"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import type { PropertyRecord } from "@/lib/types";

export default function PropertyMapClient({
  properties,
  height = "420px"
}: {
  properties: PropertyRecord[];
  height?: string;
}) {
  const fallback = [-32.9442, -60.6505] as [number, number];
  const first = properties[0];
  const center = first ? ([Number(first.latitude), Number(first.longitude)] as [number, number]) : fallback;

  return (
    <div className="map-shell overflow-hidden rounded-[24px] border border-slate-200" style={{ height }}>
      <MapContainer center={center} zoom={11} scrollWheelZoom className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <CircleMarker
            key={property.id}
            center={[Number(property.latitude), Number(property.longitude)]}
            radius={10}
            pathOptions={{
              color: property.plan.slug === "premium" ? "#b5894d" : property.plan.slug === "basic" ? "#0ea5e9" : "#475569",
              fillOpacity: 0.8
            }}
          >
            <Popup>
              <div className="space-y-1">
                <strong>{property.title}</strong>
                <p>
                  {property.zone}, {property.city}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
