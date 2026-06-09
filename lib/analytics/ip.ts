export function sanitizeIp(raw: string | null | undefined) {
  const value = raw?.trim().slice(0, 45) ?? "";

  if (!value) return "Inconnue";
  if (value === "::1" || value === "127.0.0.1") return "Localhost";

  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^[0-9a-f:]+$/i;

  if (ipv4.test(value) || ipv6.test(value)) {
    return value;
  }

  return "Inconnue";
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return sanitizeIp(forwarded.split(",")[0]);
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return sanitizeIp(realIp);
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return sanitizeIp(cfIp);
  }

  return "Inconnue";
}
