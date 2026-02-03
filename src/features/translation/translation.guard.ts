const MAX_TEXT_LENGTH = 1000;
const COOLDOWN_MS = 60_000;
const MAX_RETRIES = 3;

const retryMap = new Map<string, number>();
const cooldownMap = new Map<string, number>();

export function canTranslate(
  key: string,
  text: string,
): { allowed: boolean; reason?: string } {
  if (text.length > MAX_TEXT_LENGTH) {
    return { allowed: false, reason: "Text too long to translate" };
  }

  const now = Date.now();

  const cooldownUntil = cooldownMap.get(key);
  if (cooldownUntil && now < cooldownUntil) {
    return { allowed: false, reason: "Translation cooldown active" };
  }

  const retries = retryMap.get(key) ?? 0;
  if (retries >= MAX_RETRIES) {
    return { allowed: false, reason: "Translation retry limit reached" };
  }

  return { allowed: true };
}

export function markTranslationFailure(key: string) {
  retryMap.set(key, (retryMap.get(key) ?? 0) + 1);
  cooldownMap.set(key, Date.now() + COOLDOWN_MS);
}

export function markTranslationSuccess(key: string) {
  retryMap.delete(key);
  cooldownMap.delete(key);
}
