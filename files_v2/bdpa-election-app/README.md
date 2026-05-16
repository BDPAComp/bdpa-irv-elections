# BDPA NHSCC 2026 - Election System

An Instant-Runoff Voting (IRV) election management app built for the BDPA National High School Computer Competition.

## Tech Stack (Recommended)

- **Framework:** Next.js 14+ (App Router) — handles routing, API routes, SSR, and runs on port 3000 out of the box
- **Styling:** Tailwind CSS — utility-first, no CSS file conflicts between students
- **Database:** SQLite (local cache) + BDPA HSCC API (required by problem statement)
- **Auth:** Custom JWT + bcrypt password hashing
- **State/Data Fetching:** SWR (built-in caching, revalidation, real-time updates)
- **Language:** TypeScript (catches bugs early, helps less experienced devs)

> **Why Next.js?** The judges only type `http://127.0.0.1:3000` — Next.js serves frontend + API on the same port. No separate servers, no CORS issues, no port confusion.

## Quick Start

**This team uses GitHub Codespaces — no local installation needed.**

👉 **New to the project? Read `docs/CODESPACES_SETUP.md` first.**

Once your codespace is running:

```bash
npm run dev    # development (port 3000)
npm run build && npm start    # production mode (REQUIRED for judging — see Requirement 11)
```

(If you do need a local setup instead, see the "Local Development" section at the bottom of this README.)

## Project Structure (Conflict-Free Design)

Each student "owns" a vertical slice. **Files inside a slice rarely get touched by other students**, which eliminates 90% of merge conflicts.

```
src/
├── app/                    # Next.js pages (one folder = one route = one owner)
│   ├── login/              # → Student B (Auth)
│   ├── dashboard/          # → Student C (Dashboard)
│   ├── election/           # → Student D (Election + IRV)
│   ├── history/            # → Student C (History view)
│   ├── recover/            # → Student B (Password recovery)
│   └── api/                # Backend routes (split by feature, see /docs/OWNERSHIP.md)
│
├── components/             # React components grouped by feature
│   ├── shared/             # Buttons, Spinners, Modals → Student A owns
│   ├── navigation/         # Nav bar → Student A
│   ├── auth/               # Login form, captcha → Student B
│   ├── dashboard/          # Dashboard widgets → Student C
│   ├── election/           # Ballot, ranking UI → Student D
│   └── history/            # Past election list → Student C
│
├── lib/                    # Backend / utility logic
│   ├── api/                # BDPA API wrapper → Student A
│   ├── auth/               # Login, JWT, password hashing → Student B
│   ├── irv/                # IRV algorithm → Student D
│   ├── cache/              # Local DB caching → Student A
│   └── validation/         # Form validators, captcha → Student B
│
├── hooks/                  # Custom React hooks (one file per hook = no conflicts)
├── types/                  # TypeScript types (split by domain)
└── styles/                 # Global styles only (don't touch unless owner)
```

**The "one file per concern" rule:** When two students need to add something, they add a NEW file rather than editing a shared one. This is the #1 way to avoid merge conflicts.

## Team Roles & Ownership

See `docs/OWNERSHIP.md` for a complete breakdown of who owns which files.

| Student | Role | Skill Level Needed |
|---------|------|-------------------|
| **Student A** | Infrastructure & API Layer | Intermediate–Advanced |
| **Student B** | Authentication & Security | Intermediate |
| **Student C** | Dashboard, History, Navigation | Beginner–Intermediate |
| **Student D** | Election View & IRV Algorithm | Intermediate–Advanced |

## Requirements Difficulty Ranking

See `docs/REQUIREMENTS.md` for a difficulty rating (⭐ to ⭐⭐⭐⭐⭐) of each of the 15 requirements, plus which student owns each.

## Avoiding Merge Conflicts — The Rules

1. **Each student works on their own branch:** `student-a/feature-name`, `student-b/feature-name`, etc.
2. **Pull from `main` before pushing** — `git pull origin main --rebase`
3. **One PR at a time per student** — merge yours before opening another
4. **Don't edit files owned by another student** — open an issue/ask them instead
5. **Shared files (package.json, .env.example):** coordinate in Slack before editing
6. **Branch protection:** Require 1 review before merging to `main`

See `docs/GIT_WORKFLOW.md` for detailed git instructions.

## Documentation Index

- `docs/CODESPACES_SETUP.md` — **Start here.** How to open the project in GitHub Codespaces
- `docs/REQUIREMENTS.md` — All 15 requirements with difficulty ratings
- `docs/OWNERSHIP.md` — File ownership map (who edits what)
- `docs/GIT_WORKFLOW.md` — Branching strategy and conflict avoidance
- `docs/ARCHITECTURE.md` — How data flows through the app
- `docs/IRV_LOGIC.md` — Deep dive on the Instant-Runoff Voting algorithm
- `docs/API_NOTES.md` — How to use the BDPA HSCC API
- `docs/EDGE_CASES.md` — Pre-made decisions for ambiguous parts of the spec
- `docs/SUBMISSION.md` — Notes for judges

## Local Development (Fallback)

If a student can't use Codespaces (e.g. Chromebook without Linux mode), they can run locally:

**Required:** Node.js 20 LTS (https://nodejs.org), Git, VS Code.

```bash
git clone <repo-url>
cd bdpa-election-app
npm install
cp .env.example .env.local
# Edit .env.local with your secrets
npm run setup     # creates super admin
npm run dev
```

Windows users: when installing Node, check the "Automatically install necessary tools" box — it installs the C++ build tools needed for `better-sqlite3`.
