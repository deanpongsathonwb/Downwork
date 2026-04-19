-- Store emails lowercase + trimmed (matches application normalizeEmail).
UPDATE "User"
SET email = lower(trim(email))
WHERE email IS DISTINCT FROM lower(trim(email));
