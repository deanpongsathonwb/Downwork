/** Login / profile: case-insensitive usernames; allowed chars after normalize. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 32;

const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function looksLikeEmail(raw: string): boolean {
  return EMAIL_LIKE.test(raw.trim());
}

/** Lowercase, strip disallowed characters (keep a-z 0-9 . _ -). */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '');
}

export function isValidUsernameNormalized(s: string): boolean {
  return s.length >= USERNAME_MIN && s.length <= USERNAME_MAX && /^[a-z0-9._-]+$/.test(s);
}
