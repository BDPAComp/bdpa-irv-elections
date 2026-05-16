# Requirements Breakdown & Difficulty Ratings

Difficulty scale: ⭐ (easy, beginner-friendly) → ⭐⭐⭐⭐⭐ (very challenging)

The difficulty considers: algorithmic complexity, number of edge cases, knowledge prerequisites, and how many other requirements it interacts with.

---

## ⭐ Easy — Beginner-Friendly

### Requirement 8: Persistent Navigation Bar
**Owner:** Student C
A nav bar shown on every page with the BDPA logo, app title, and 3 numbers (total/open/closed elections). The hard part is just *fetching the counts*, which can use a shared SWR hook. UI is straightforward.

**Why easy:** It's a single component reused everywhere. No business logic. Once the API wrapper exists, it's just `useSWR('/api/elections/counts')`.

---

### Requirement 12: Pagination
**Owner:** Student C (lists), Student A (API helper)
Show 10 items per page with "next/previous" buttons or infinite scroll. The BDPA API already supports pagination via range queries.

**Why easy:** It's a standard UI pattern. The API does the heavy lifting — you just pass `?after=lastId` style params.

---

### Requirement 15: Responsive Design
**Owner:** Everyone (each student makes their own pages responsive)
Pages must look good on phone, tablet, and desktop. Using Tailwind CSS makes this almost free (`md:` and `lg:` prefixes).

**Why easy:** Tailwind handles 90% of it. Test in Chrome DevTools device mode while building, not at the end.

---

## ⭐⭐ Moderate

### Requirement 1: Four User Types
**Owner:** Student B (auth) + Student A (data model)
Voters, moderators, administrators, reporters. Plus one "super admin" who always exists.

**Why moderate:** The logic itself is just role-checking (`if user.type === 'admin'`). The challenge is *consistently* enforcing it across every page and API route. Use a `requireRole(['admin'])` middleware helper to centralize this.

**Edge case to watch:** The super admin can never be deleted, even by themselves.

---

### Requirement 4: Dashboard View
**Owner:** Student C
Each user type sees a different dashboard. Voter sees their elections, admin sees management tools, reporter sees closed elections.

**Why moderate:** Mostly composition — render different components based on `user.type`. The first-login-must-change-password flow adds one extra step.

```tsx
// Pattern:
function Dashboard() {
  const { user } = useAuth();
  if (user.mustChangePassword) return <ChangePasswordForm />;
  if (user.type === 'voter') return <VoterDashboard />;
  if (user.type === 'admin') return <AdminDashboard />;
  // etc.
}
```

---

### Requirement 5: History View
**Owner:** Student C
Paginated list of all closed elections, sortable by title/creation/opening/closing time.

**Why moderate:** Sorting + pagination + filtering combined. The trick is doing it efficiently — don't fetch ALL elections, use API range queries. This is where **caching (Requirement 11)** becomes important.

---

### Requirement 14: Graceful Error Handling
**Owner:** Everyone
Show spinners during loading, friendly error messages, handle the random HTTP 555 errors the API throws.

**Why moderate:** Easy to do *somewhere*, hard to do *everywhere*. Use a global error boundary + a wrapper around all API calls that retries on 555.

```ts
// lib/api/fetchWithRetry.ts pattern:
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url, options);
    if (res.status !== 555) return res;
    await new Promise(r => setTimeout(r, 500 * (i + 1))); // backoff
  }
  throw new Error('API repeatedly returned 555');
}
```

---

## ⭐⭐⭐ Challenging

### Requirement 2: Elections Data Model
**Owner:** Student A
Defines what an election IS — title, description, options, timestamps, ballots, owned vs. unowned, immutability rules.

**Why challenging:** Tons of edge cases. *What happens if an admin changes an election's options after voting started? What if they change the close time to the past?* Document your decisions in `docs/EDGE_CASES.md`.

The key insight: **closed elections are immutable** except for the super user, who can edit limited fields and re-open elections by pushing the close time into the future.

---

### Requirement 3: Election View (Voting Page)
**Owner:** Student D
Lets voters rank options for an open election. Shows results for closed ones. Admins can view but not vote.

**Why challenging:**
- Drag-and-drop ranking UI (or numbered dropdowns — simpler but less slick)
- Voters must rank ALL options (validation)
- Voters can change votes while open, not after
- Must protect voter identity in results UI
- Differentiating logic for open vs. closed states

**Library recommendation:** `@dnd-kit/sortable` for drag-and-drop ranking.

---

### Requirement 6: Authentication
**Owner:** Student B
Login, logout, "remember me", 3-failed-attempts → 1-hour lockout, captcha, password strength meter, username/email uniqueness.

**Why challenging:** Security-sensitive. Must hash passwords correctly (use `bcrypt`, never SHA-256 alone for passwords despite what the problem says — bcrypt is the modern standard, but if you follow their suggestion use **salted** SHA-256 with `crypto.randomBytes(16)` salts).

**Gotchas:**
- Track failed attempts per username, not per session (a hacker would just reset)
- The lockout must persist across server restarts (store in DB, not memory)
- "Remember me" needs a longer-lived token, not just a longer session

---

### Requirement 7: Password Recovery
**Owner:** Student B
"Forgot password" flow with simulated email.

**Why challenging:** Conceptually simple but security-prone. Generate a single-use token, store its hash in DB with an expiration, "send" by logging to console with a clear marker.

```ts
console.log(`[SIMULATED EMAIL] To: ${user.email}
Reset link: http://127.0.0.1:3000/recover/${token}`);
```

Document this in your submission so judges find the console log.

---

### Requirement 13: Security
**Owner:** Student B (auth-related) + everyone else (XSS-prevention in their views)
Prevent XSS, SQL injection, hash passwords correctly.

**Why challenging:** Pervasive. React escapes output by default (good!), but `dangerouslySetInnerHTML` and `innerHTML` will bite you. Parameterized queries everywhere (if using a SQL library, use `?` placeholders, never string concatenation).

---

## ⭐⭐⭐⭐ Hard

### Requirement 10: Real-Time Updates
**Owner:** Student D
Election view updates without page refresh as votes come in, election closes, etc.

**Why hard:** Three reasonable approaches, each with tradeoffs:

1. **Polling with SWR** (easiest): `useSWR(url, fetcher, { refreshInterval: 3000 })`. Easy, but wasteful.
2. **WebSockets**: Real-time but Next.js needs custom server setup. Worth it for cool factor.
3. **Server-Sent Events (SSE)**: Middle ground, one-way push, works with Next.js API routes.

**Recommendation for your team:** Start with SWR polling (1 hour of work). Upgrade to SSE if time permits (another 4 hours).

---

### Requirement 11: Performance
**Owner:** Student A (caching infrastructure) + everyone (don't write slow code)
Fastest teams win points; slowest teams get zero.

**Why hard:** It's a competitive ranking. Strategies:
- **Cache aggressively** — SWR + a local SQLite cache for the BDPA API
- **Pagination over fetching everything**
- **Avoid waterfall requests** — use `Promise.all`
- **Production build** — `npm run build && npm start`, never `npm run dev` for judging
- **Lazy load** heavy components

Set up a `lib/cache/` module with a `getElectionsCached()` function. When in doubt, cache the API response for 10–30 seconds.

---

## ⭐⭐⭐⭐⭐ Very Hard

### Requirement 9: IRV Algorithm
**Owner:** Student D
Calculate the winner of an Instant-Runoff Voting election.

**Why very hard:** The algorithm itself isn't that complex, but the edge cases are brutal:

- **Tie for last place during elimination** — who gets eliminated? (Pick a deterministic rule: e.g. the option that comes first alphabetically, or has the fewest 2nd-place votes.)
- **All remaining options tie** — declare a tie? Pick one? (Problem statement doesn't say. Document your choice.)
- **A voter's later choices are all eliminated** — their ballot is "exhausted" and no longer counts.
- **No one votes** — there's no winner; handle this UI-side.
- **Only one option** — that option wins immediately.

See `docs/IRV_LOGIC.md` for a worked example and pseudocode.

**Pure functions only:** This module should be a pure function `calculateIRVWinner(options, ballots) → { winner, rounds }`. Easy to test, hard to break.

---

## Recommended Order of Implementation

Don't tackle these in the order listed in the problem statement. Build in this order:

1. **Week 1 (Foundation):** Reqs 1, 2, 6, 8 — auth + data model + nav. Without these, nothing else works.
2. **Week 2 (Core Features):** Reqs 3, 4, 5, 9 — the actual app functionality.
3. **Week 3 (Polish):** Reqs 7, 10, 12, 13, 14, 15 — recovery, real-time, pagination, security, errors, responsive.
4. **Week 4 (Performance):** Req 11 — profile, cache, optimize. Don't do this first; you can't optimize what doesn't exist yet.
