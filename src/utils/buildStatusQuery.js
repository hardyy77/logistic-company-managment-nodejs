export function buildStatusQuery(status) {
  return status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
}