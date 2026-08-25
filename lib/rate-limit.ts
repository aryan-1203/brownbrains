/**
 * Deliberately simple in-process limiter.
 *
 * Serverless instances come and go, so this is a speed bump for casual abuse
 * rather than a guarantee. The honeypot and the minimum submit time in the
 * route handler do the heavier lifting. Swap in Upstash if volume ever demands.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 500) {
    for (const [id, entry] of buckets) {
      if (entry.resetAt < now) buckets.delete(id);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
