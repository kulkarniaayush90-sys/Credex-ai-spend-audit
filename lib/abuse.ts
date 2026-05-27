type RateState = {
  count: number;
  windowStart: number;
};

const store = new Map<string, RateState>();

export function enforceRateLimit(key: string, maxRequests = 10, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now - current.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: maxRequests - current.count };
}

export function isHoneypotFilled(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

