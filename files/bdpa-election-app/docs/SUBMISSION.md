# Submission Notes (for Judges)

This file documents how to run, evaluate, and inspect our solution.

## Running the App

```bash
# 1. Install dependencies (only needed once)
npm install

# 2. Configure environment
cp .env.example .env.local
# Then edit .env.local with your BDPA_API_KEY and other values

# 3. Bootstrap the super admin user (only needed once)
npm run setup

# 4. Start in production mode (faster than dev mode)
npm run build
npm start

# 5. Open http://127.0.0.1:3000
```

## Default Super Admin Credentials

See `.env.example` for the default super admin login. **You must change this password on first login.**

## Where Things Are

| What you're looking for | File |
|------|------|
| IRV algorithm | `src/lib/irv/calculateWinner.ts` |
| Password hashing | `src/lib/auth/password.ts` |
| BDPA API client | `src/lib/api/client.ts` |
| Login flow | `src/app/api/auth/login/route.ts` |
| Database schema | `src/lib/cache/db.ts` |
| Edge case decisions | `docs/EDGE_CASES.md` |
| File ownership map | `docs/OWNERSHIP.md` |

## Simulated Recovery Emails (Requirement 7)

We do not send real emails. When a user requests a password recovery:

1. The recovery link is **printed to the server console** with a clear marker:
   ```
   [SIMULATED EMAIL] To: user@example.com
   Reset link: http://127.0.0.1:3000/recover/<token>
   ```
2. To view, check the terminal where `npm start` is running.
3. Copy the link into the browser to complete the recovery flow.

## Security (Requirement 13)

- **Passwords:** Hashed with bcrypt (cost factor 10). Never stored in plaintext or reversible encoding.
- **Sessions:** JWT, HS256, HttpOnly cookie, signed with `JWT_SECRET` from `.env.local`.
- **SQL injection:** Prevented via `better-sqlite3` parameterized queries (`?` placeholders).
- **XSS:** Prevented by React's default escaping. We do NOT use `dangerouslySetInnerHTML` anywhere.
- **CSRF:** SameSite=lax cookies + same-origin checks on mutating routes.

## Performance (Requirement 11)

- Always built and served in **production mode** (`npm run build && npm start`)
- BDPA API responses are cached in SQLite with TTLs (see `docs/EDGE_CASES.md` → Caching section)
- Pagination via cursor on every list endpoint
- SWR caches API responses client-side and dedupes requests

## Real-Time Updates (Requirement 10)

Implemented via SWR polling (3-second interval on the election view). When the election closes, polling stops automatically.

## Test Suite

```bash
npm test
```

Includes unit tests for the IRV algorithm (`__tests__/irv.test.ts`).

## Known Limitations

- Email is simulated to the console (per Requirement 7's allowance).
- We rely on the BDPA API's pagination for the History view — if the API is unavailable, the History view will show cached data with a "may be stale" banner.
- Tie-breaker in IRV uses the "fewest 2nd-place votes, then alphabetical" rule. See `docs/EDGE_CASES.md`.
