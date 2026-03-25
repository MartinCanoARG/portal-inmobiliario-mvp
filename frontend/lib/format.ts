export function formatPrice(value: string | number, currency: "USD" | "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function compactDate(value: string | null) {
  if (!value) {
    return "Sin publicar";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
