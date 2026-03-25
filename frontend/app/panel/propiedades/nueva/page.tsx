"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/container";
import { PropertyForm } from "@/components/dashboard/property-form";

export default function NewPropertyPage() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("portal_token");
    if (!token) {
      router.push("/ingresar");
    }
  }, [router]);

  return (
    <div className="py-12">
      <Container className="space-y-6">
        <div>
          <span className="eyebrow">Nueva publicación</span>
          <h1 className="mt-4 text-5xl font-semibold">Cargá una propiedad nueva.</h1>
        </div>
        <PropertyForm mode="create" />
      </Container>
    </div>
  );
}
