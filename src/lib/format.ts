/** Format a number of Kenya Shillings, e.g. 350 -> "KES 350"; 12500 -> "KES 12,500". */
export function formatKES(amount: number, opts?: { decimals?: boolean; compact?: boolean }) {
  const { decimals = false, compact = false } = opts ?? {};
  if (compact) {
    return Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(amount);
}

/** Format a raw number, e.g. 47 -> "47" */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-KE").format(n);
}

/** Format a phone number for display. */
export function formatPhone(phone: string) {
  return phone.replace(/^(\+254)(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3 $4");
}

/** Compact relative time from an ISO timestamp, e.g. "3 min ago", "2h ago". */
export function formatRelativeTime(iso: string, now = Date.now()) {
  const min = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}