# Architecture & Data Flow

## High-Level Picture

```
┌─────────────────────────────────────────────────┐
│   Browser (React UI on localhost:3000)          │
│   ┌──────────────────────────────────────────┐  │
│   │ Pages: /login /dashboard /election /etc. │  │
│   └────────────────────┬─────────────────────┘  │
│                        │ (SWR hooks)            │
│   ┌────────────────────▼─────────────────────┐  │
│   │ /api/* routes (Next.js API routes)       │  │
│   └────────────────────┬─────────────────────┘  │
└────────────────────────┼────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
       ┌──────▼──────┐      ┌───────▼────────┐
       │ Local Cache │      │ BDPA HSCC API  │
       │ (SQLite)    │      │ (remote)       │
       └─────────────┘      └────────────────┘
```

## The Rule: Frontend Never Calls BDPA API Directly

The frontend (`src/app/dashboard/`, etc.) only talks to `/api/*` routes.
The `/api/*` routes talk to the BDPA API and the local cache.

**Why?** Three reasons:
1. The BDPA API key never reaches the browser (security).
2. We can cache responses without the browser knowing.
3. If the BDPA API changes, we update one place (our `/api/*` routes), not every component.

## Data Flow Examples

### Example 1: Voter views their dashboard

```
1. Browser loads /dashboard
2. <VoterDashboard /> calls useSWR('/api/elections/mine')
3. /api/elections/mine route handler:
   a. Checks user is authenticated (middleware)
   b. Checks local cache for "elections-for-user-{id}"
   c. If cache miss: calls BDPA API, stores result, returns it
   d. If cache hit and fresh: returns cached data
4. UI renders the list
```

### Example 2: Voter casts a ranked ballot

```
1. User drags options into order, clicks "Submit"
2. <Ballot /> POSTs to /api/ballots
3. /api/ballots route handler:
   a. Verifies user, verifies election is open, verifies they're eligible
   b. Calls BDPA API to record the ballot
   c. Invalidates cache for that election
4. SWR auto-refetches election data
5. UI shows the ballot was cast
```

### Example 3: Election closes, winner is calculated

```
1. /api/elections/[id]/results requested
2. Route handler:
   a. Fetches ballots from BDPA API (cached)
   b. Calls calculateIRVWinner(options, ballots) from lib/irv/
   c. Returns { winner, rounds: [...], totalVotes }
3. <ResultsDisplay /> renders the winner, the elimination rounds, etc.
```

## Why SQLite for Local Cache?

The problem statement says: "you may consider a hybrid approach where you have your own database storing non-API data."

Use SQLite for:
- **Cache of BDPA API responses** (with timestamps so we know when to refresh)
- **Local user data** (login attempts, lockouts, recovery tokens) — these don't go to BDPA's API
- **Session/JWT secrets** if needed

Don't use it for:
- Anything the API requires you to store (elections, ballots, etc.) — those go via the BDPA API per requirement.

The SQLite file lives at `data/app.db` (gitignored).

## State Management

We use **SWR** for server state and **React Context** for auth state. We deliberately avoid Redux — it's overkill here.

```tsx
// SWR handles caching, revalidation, real-time updates
const { data, error, isLoading } = useSWR('/api/elections', fetcher);

// AuthContext handles "who is logged in"
const { user, login, logout } = useAuth();
```

## Real-Time Update Strategy (Requirement 10)

Three layers, in order of complexity:

**Layer 1 — SWR polling (start here):**
```tsx
useSWR(`/api/elections/${id}`, fetcher, {
  refreshInterval: 3000,    // re-fetch every 3 seconds
  revalidateOnFocus: true,  // re-fetch when user switches back to tab
});
```

**Layer 2 — Focus-only revalidation (low traffic):**
```tsx
useSWR(`/api/elections/${id}`, fetcher, {
  revalidateOnFocus: true,
  refreshInterval: 0,
});
```

**Layer 3 — Server-Sent Events (most efficient):**
Set up an SSE endpoint at `/api/elections/[id]/stream` that pushes updates. Skip this unless polling is causing performance problems.

## Error Handling Architecture

Three layers:

1. **API route layer** — try/catch around BDPA calls. On 555, retry with backoff.
2. **Hook layer** — SWR returns `error` field. UI checks it and shows error state.
3. **React Error Boundary** — catches rendering crashes, shows fallback UI.

```
                    ┌──────────────────────┐
User sees:          │ Error boundary       │ ← catches React crashes
                    │ ┌──────────────────┐ │
                    │ │ <Page>           │ │
                    │ │ ┌──────────────┐ │ │
                    │ │ │ useSWR err?  │ │ │ ← handle API errors gracefully
                    │ │ │ → show toast │ │ │
                    │ │ └──────────────┘ │ │
                    │ └──────────────────┘ │
                    └──────────────────────┘
                                ▲
                                │
                        /api/* (with retry)
                                ▲
                                │
                        BDPA API (might 555)
```

## Performance Notes (Requirement 11)

Where time is spent (and how we minimize it):

| Operation | Slow because | Mitigation |
|-----------|-------------|------------|
| Initial page load | Bundle size, server cold start | Production build, code splitting |
| Listing elections | Many API calls | Cache layer, pagination |
| Election results | IRV calculation on many ballots | Memoize result, cache it |
| Real-time updates | Frequent polling | Use SWR's dedup + interval, not setInterval |
| Sorting/filtering | Doing it client-side on huge lists | Sort on server, use API range queries |
