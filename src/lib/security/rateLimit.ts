/**
 * Simple in-memory rate limiter for public forms.
 * Production: replace with edge / Redis / Vercel Firewall when traffic grows.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(input.key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(input.key, { count: 1, resetAt: now + input.windowMs });
    return { ok: true, remaining: input.limit - 1, retryAfterSec: 0 };
  }

  if (existing.count >= input.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: input.limit - existing.count,
    retryAfterSec: 0,
  };
}

export function clientKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
