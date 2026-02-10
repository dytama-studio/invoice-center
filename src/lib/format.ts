export function formatCurrency(value: number | string, currency = "IDR") {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}
