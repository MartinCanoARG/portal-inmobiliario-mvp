import { AuthPayload, Plan, PropertyRecord } from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const fallback = "Ocurrió un error al conectar con la API.";
    let detail = fallback;

    try {
      const errorBody = (await response.json()) as { detail?: string };
      detail = errorBody.detail ?? fallback;
    } catch {
      detail = fallback;
    }

    throw new Error(detail);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function getPlans() {
  return requestJson<Plan[]>("/plans/");
}

export async function getProperties(queryString = "") {
  const suffix = queryString ? `/properties/?${queryString}` : "/properties/";
  return requestJson<PropertyRecord[]>(suffix);
}

export async function getProperty(slug: string) {
  return requestJson<PropertyRecord>(`/properties/${slug}/`);
}

export async function login(username: string, password: string) {
  return requestJson<AuthPayload>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
}

export async function getDashboardProperties(token: string) {
  return requestJson<PropertyRecord[]>("/dashboard/properties/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getDashboardProperty(id: string, token: string) {
  return requestJson<PropertyRecord>(`/dashboard/properties/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function saveDashboardProperty(
  token: string,
  payload: Record<string, unknown>,
  id?: string
) {
  return requestJson<PropertyRecord>(id ? `/dashboard/properties/${id}/` : "/dashboard/properties/", {
    method: id ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
}
