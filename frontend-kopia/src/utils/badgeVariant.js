export function badgeVariant(status) {
  if (["active", "available", "completed"].includes(status)) return "default";
  if (["planned", "in_progress", "in_use", "unavailable"].includes(status)) return "secondary";
  if (["inactive", "in_service", "cancelled"].includes(status)) return "destructive";
  return "outline";
}