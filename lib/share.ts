export function buildPublicAuditUrl(auditId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/audit/${auditId}`;
}

export function createPublicAuditId() {
  return crypto.randomUUID().split("-")[0];
}

