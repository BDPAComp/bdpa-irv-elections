# File Ownership Map

Every file in the project has ONE owner. Only that owner should edit it. If you need a change in someone else's file, ask them in Slack.

## The Four Students

### 🧱 Student A — Infrastructure & API Layer
**Skill level needed:** Intermediate–Advanced
**Why this role:** They unblock everyone else. The BDPA API wrapper must work before B/C/D can do anything serious. Best for the student most comfortable with TypeScript and async code.

**Owns:**
```
src/lib/api/              ← BDPA API client (fetch wrapper, types)
src/lib/cache/            ← Local caching layer
src/app/api/elections/    ← Backend routes for elections
src/app/api/users/        ← Backend routes for users (read-only ones)
src/components/shared/    ← Buttons, Spinner, Modal, ErrorBoundary
src/components/navigation/← Top nav bar
src/hooks/useElections.ts ← Data-fetching hooks
src/hooks/useApi.ts
src/types/election.ts     ← Shared types
src/types/user.ts
next.config.js
tailwind.config.js
package.json (lead maintainer)
```

**Requirements they own:** 2, 8, 11, 12 (helper), 14 (helper)

---

### 🔐 Student B — Authentication & Security
**Skill level needed:** Intermediate
**Why this role:** Auth is self-contained — you can build it without depending on the API layer much. Good for someone who likes security puzzles.

**Owns:**
```
src/lib/auth/             ← JWT, bcrypt, session logic
src/lib/validation/       ← Input validation, captcha, password strength
src/app/login/            ← Login page
src/app/recover/          ← Password recovery pages
src/app/api/auth/         ← Backend: /api/auth/login, /api/auth/logout, etc.
src/app/api/users/create  ← User creation (admin-only)
src/components/auth/      ← LoginForm, CaptchaWidget, PasswordStrengthMeter
src/hooks/useAuth.ts      ← Auth context provider
src/middleware.ts         ← Route protection middleware
```

**Requirements they own:** 1 (shared with A), 6, 7, 13

---

### 📊 Student C — Dashboard, History & Navigation Content
**Skill level needed:** Beginner–Intermediate
**Why this role:** Lots of UI work, less algorithmic complexity. Good for a student who's better at HTML/CSS/React than algorithms. They get help from A (API hooks already built).

**Owns:**
```
src/app/dashboard/        ← Dashboard route (all variants)
src/app/history/          ← History route
src/components/dashboard/ ← VoterDashboard, AdminDashboard, ModeratorDashboard, ReporterDashboard
src/components/history/   ← HistoryTable, SortControls, FilterControls
src/hooks/usePagination.ts
```

**Requirements they own:** 4, 5, 12 (UI), 15 (helper)

---

### 🗳️ Student D — Election View & IRV Algorithm
**Skill level needed:** Intermediate–Advanced
**Why this role:** The IRV algorithm is the trickiest piece of logic in the app. Needs someone comfortable thinking through edge cases.

**Owns:**
```
src/lib/irv/              ← IRV algorithm (calculate winner, run rounds)
src/app/election/         ← Election view route (active voting + results)
src/components/election/  ← Ballot, RankingPicker, ResultsDisplay, RealtimeUpdater
src/hooks/useElection.ts  ← Single-election data hook
src/hooks/useRealtimeUpdates.ts
src/app/api/ballots/      ← Backend: cast ballot, change ballot
src/app/api/elections/[id]/results/ ← Backend: get IRV results
```

**Requirements they own:** 3, 9, 10

---

## Shared Files (Coordinate Before Editing)

These files might need changes from multiple students. **Discuss in Slack first.**

| File | Reason it's shared | Coordination rule |
|------|-------------------|------------------|
| `package.json` | New dependencies | Post in Slack: "Adding X for Y reason." A approves. |
| `.env.example` | New config vars | Same as above. |
| `src/types/index.ts` | Shared type exports | Add your types in your own `types/*.ts` file, then update the barrel export. |
| `src/styles/globals.css` | Global styles | Avoid editing. Use Tailwind utilities instead. A owns this if it must change. |
| `README.md` | Project docs | Each student maintains their own section. |

## Boundary Examples

**✅ GOOD: Student C needs an "elections list" API.**
- Student A already provides `useElections()` hook.
- Student C just imports and uses it. No conflict.

**✅ GOOD: Student D needs to know who's logged in.**
- Student B provides `useAuth()` hook.
- Student D imports it. No file overlap.

**❌ BAD: Student C wants to add a button style to `components/shared/Button.tsx`.**
- That file is owned by Student A.
- Solution: Ask Student A to add the variant, OR create `components/dashboard/SpecialButton.tsx` in their own folder.

**❌ BAD: Two students both edit `package.json` and push.**
- Merge conflict guaranteed.
- Solution: One person at a time. Run `npm install <package>` after pulling latest `main`.

## Daily Sync Recommendation

5-minute standup each day:
1. "What I pushed yesterday."
2. "What I'm pushing today."
3. "Anyone else touching X file?"

This catches conflicts before they happen.
