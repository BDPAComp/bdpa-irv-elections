// OWNER: Student A
// PURPOSE: Cache BDPA API responses to reduce load and improve performance.
//
// REQUIREMENT: 11 (Performance — caching reduces load times)
// DIFFICULTY: ⭐⭐⭐
//
// Strategy:
//   - Store the JSON response under a cache key with an expiration time
//   - On read, return cached value if not expired
//   - On miss, the caller fetches from the API and writes via `set`
//
// Cache durations are deliberately short — we want fresh-ish data, but not
// to hammer the API on every request.

import db from './db';

const DEFAULT_TTL_MS = 30_000; // 30 seconds

export function get<T = unknown>(key: string): T | null {
  const row = db
    .prepare('SELECT payload, expires_at FROM api_cache WHERE cache_key = ?')
    .get(key) as { payload: string; expires_at: number } | undefined;

  if (!row) return null;
  if (row.expires_at < Date.now()) {
    // Expired — clean up and return miss
    db.prepare('DELETE FROM api_cache WHERE cache_key = ?').run(key);
    return null;
  }
  return JSON.parse(row.payload) as T;
}

export function set(key: string, value: unknown, ttlMs: number = DEFAULT_TTL_MS): void {
  const now = Date.now();
  db.prepare(`
    INSERT INTO api_cache (cache_key, payload, cached_at, expires_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(cache_key) DO UPDATE SET
      payload = excluded.payload,
      cached_at = excluded.cached_at,
      expires_at = excluded.expires_at
  `).run(key, JSON.stringify(value), now, now + ttlMs);
}

export function invalidate(keyOrPrefix: string): void {
  // Match exact key or anything beginning with prefix
  db.prepare('DELETE FROM api_cache WHERE cache_key = ? OR cache_key LIKE ?')
    .run(keyOrPrefix, `${keyOrPrefix}:%`);
}

/**
 * Helper: get-or-fetch. If cached, return it. Otherwise call `fetcher`,
 * cache its result, and return it.
 */
export async function getOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  const cached = get<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  set(key, fresh, ttlMs);
  return fresh;
}
