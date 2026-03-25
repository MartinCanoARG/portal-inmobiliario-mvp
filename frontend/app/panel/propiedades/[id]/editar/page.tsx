"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Container } from "@/components/container";
import { PropertyForm } from "@/components/dashboard/property-form";
import { getDashboardProperty } from "@/lib/api";
import { PropertyRecord } from "@/lib/types";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyRecord | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("portal_token");
    if (!token) {
      router.push("/ingresar");
      return;
    }

    getDashboardProperty(params.id, token)
      .then((data) => setProperty(data))
      .catch(() => router.push("/panel"));
  }, [params.id, router]);

  return (
    <div className="py-12">
      <Container className="space-y-6">
        <div>
          <span className="eyebrow">Edición</span>
          <h1 className="mt-4 text-5xl font-semibold">Actualizá tu aviso.</h1>
        </div>
        {property ? <PropertyForm mode="edit" property={property} /> : <p>Cargando propiedad...</p>}
      </Container>
    </div>
  );
}
