"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("premium-agency");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await login(username, password);
      window.localStorage.setItem("portal_token", payload.access);
      window.localStorage.setItem("portal_refresh", payload.refresh);
      window.localStorage.setItem("portal_profile", JSON.stringify(payload.profile));
      window.localStorage.setItem("portal_user", JSON.stringify(payload.user));
      router.push("/panel");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-16">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel p-8">
          <span className="eyebrow">Acceso privado</span>
          <h1 className="mt-6 text-5xl font-semibold">Ingresá al panel del anunciante.</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Desde acá podés gestionar avisos, cambiar estados, revisar el plan activo y editar tu portfolio de
            propiedades sin depender del visitante público.
          </p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Credenciales demo</p>
              <p className="mt-2 text-sm text-slate-600">
                `premium-agency / demo1234`, `basic-agency / demo1234`, `particular-demo / demo1234`, `admin / admin1234`
              </p>
            </div>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold text-slate-700">Usuario</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold text-slate-700">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-gold"
              />
            </label>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="secondary">
                {loading ? "Ingresando..." : "Entrar al panel"}
              </Button>
              <Button href="/publicar" variant="ghost">
                Ver planes
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
