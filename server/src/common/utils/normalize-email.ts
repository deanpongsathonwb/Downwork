/** Normalize for lookup/storage; mailbox matching is conventionally case-insensitive. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
