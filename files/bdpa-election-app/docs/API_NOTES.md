# BDPA HSCC API Notes

> Full documentation: https://hscc18f802d3.docs.apiary.io

## Key Things to Know

### Timestamps
All times are **Unix epoch milliseconds** (e.g. `1715846400000`). Not seconds. Not ISO strings. Milliseconds.

```ts
Date.now()                          // milliseconds since epoch ✅
new Date(timestamp).toISOString()   // convert for display
new Date('2026-05-16').getTime()    // convert string to milliseconds
```

### The HTTP 555 "Random Error"
Per the problem statement: the API will sometimes return HTTP 555 to test your error handling. **You must retry these with backoff.** See `lib/api/fetchWithRetry.ts` in the skeleton.

### Owned vs. Unowned Elections
- Elections your app creates are "yours" → you can update/delete them.
- Elections created by other teams' apps appear in the API too → you can only READ them.
- The History view (Req 5) must show BOTH kinds. Tag them visually (e.g. a small badge that says "External").

### Authentication to the API
The API uses an API key. Store it in `.env` as `BDPA_API_KEY` (never commit it). Send it in the `Authorization` header.

## Recommended API Wrapper Structure

```ts
// src/lib/api/client.ts
const BASE_URL = process.env.BDPA_API_BASE_URL;
const API_KEY = process.env.BDPA_API_KEY;

export async function bdpaFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Authorization': `bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Retry on 555
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { ...options, headers });
    if (res.status !== 555) return res;
    await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
  }
  throw new Error(`BDPA API failed after 3 attempts: ${path}`);
}

// Then expose typed methods:
export const bdpaApi = {
  elections: {
    list: (after?: string) => bdpaFetch(`/elections${after ? `?after=${after}` : ''}`),
    get: (id: string) => bdpaFetch(`/elections/${id}`),
    create: (data: NewElection) => bdpaFetch('/elections', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Election>) => bdpaFetch(`/elections/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => bdpaFetch(`/elections/${id}`, { method: 'DELETE' }),
  },
  ballots: {
    cast: (electionId: string, voterId: string, ranking: Record<string, number>) =>
      bdpaFetch(`/elections/${electionId}/ballots`, {
        method: 'PUT',
        body: JSON.stringify({ voter_id: voterId, ranking }),
      }),
  },
};
```

## Pagination Strategy

The API uses cursor-based pagination (range queries). Don't fetch everything at once.

```ts
// Bad — fetches all elections, slow
async function getAllElections() {
  const all = [];
  let cursor: string | undefined;
  do {
    const res = await bdpaApi.elections.list(cursor);
    const { elections } = await res.json();
    all.push(...elections);
    cursor = elections[elections.length - 1]?.id;
  } while (cursor);
  return all;
}

// Good — fetch one page at a time, let UI paginate
async function getElectionsPage(after?: string) {
  const res = await bdpaApi.elections.list(after);
  return res.json();
}
```

## What to Cache

| Data | Cache duration | Where |
|------|---------------|-------|
| List of elections (counts for nav) | 30s | SWR + SQLite |
| Individual election details | 10s while open, forever once closed | SWR + SQLite |
| Ballots for closed election | Forever | SQLite |
| User's own data | Until they edit it | SQLite |
| Login attempts/lockouts | Never expires | SQLite only (not in API) |

## When the API Goes Down

Sometimes the API is just slow or unreachable. Your fallback:

1. Show data from local cache (even if stale).
2. Display a small banner: "Some data may be out of date — reconnecting…"
3. Don't crash the page.

This is what graceful failure (Req 14) means in practice.
