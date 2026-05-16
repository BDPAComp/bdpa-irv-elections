# Edge Cases & Design Decisions

When the problem statement is ambiguous, we have to PICK an answer and DOCUMENT it. This file is that record.

## IRV Algorithm

### What if there's a tie for last place during elimination?
**Our choice:** Eliminate the option with the fewest 2nd-place votes. If still tied, eliminate alphabetically (`localeCompare`).
**Why:** Deterministic, defensible, easy to explain to judges.
**Where it lives:** `src/lib/irv/calculateWinner.ts`, function `breakEliminationTie`.

### What if all remaining options are tied in the final round?
**Our choice:** Declare it a tie, return `isTie: true` and `tiedOptions: [...]`. The UI displays this clearly. The election does not pick a winner.
**Why:** Picking a "winner" arbitrarily would be misleading. Better to be honest.

### What if a voter ranks only some options (partial ballot)?
**Our choice:** Reject the submission at the API level — must rank ALL options.
**Why:** Keeps the math simple and matches the problem statement: "they must rank each option from most favored to least favored ranked 1 to N."
**Where:** `src/app/api/elections/[id]/ballot/route.ts` validates `submittedOptions.length === election.options.length`.

### What if a voter's ranking has the same rank used twice (e.g. {a:1, b:1})?
**Our choice:** Reject at validation. Each rank must be unique.
**Why:** IRV requires a strict ordering.

### What if zero ballots are cast?
**Our choice:** Return `winner: null` with a UI message "No votes were cast." Election remains "closed" but with no winner.
**Why:** No data → no decision.

## Elections

### What if an admin changes the options of an open election after votes are already cast?
**Our choice:** Reject the change. Once any ballot is cast, options are frozen.
**Why:** Changing options would invalidate existing ballots (they'd reference options that no longer exist). Better to require admins to delete and recreate.

### What if an admin changes opensAt to the past on an upcoming election?
**Our choice:** Allow it. The election immediately becomes "open."
**Why:** Reasonable behavior; admin clearly wanted to start it.

### What if an admin sets closesAt to the past on an open election?
**Our choice:** Allow it. The election immediately closes. Winners are calculated from existing ballots.
**Why:** Same logic — admin intent is clear.

### What if an admin tries to edit a closed election?
**Our choice:** Reject. Only the super admin can edit closed elections, and only for title/description/opensAt/closesAt.
**Why:** This is direct from Requirement 2.

### What if the super admin re-opens a closed election (sets closesAt to future)?
**Our choice:** Allow it. Existing ballots are preserved. Voting resumes. New voters can cast.
**Why:** Direct from Requirement 2: "Updating the closure timestamp to a time in the future will effectively re-open a closed election."

### What if a voter casts a ballot, then is removed from the election by a moderator?
**Our choice:** The cast ballot still counts. The voter just can't change/remove it.
**Why:** Direct from Requirement 2: "if a user voted in an election before their account was deleted or unassigned, their ballot must still count."

### What if a voter is deleted while an election is open?
**Our choice:** Same as above — their existing ballot counts. They can't access the system to change it.

## Authentication

### What if a username has uppercase letters?
**Our choice:** Treat usernames as case-INSENSITIVE for matching, but preserve case for display.
**Why:** Users won't remember if they typed "RayTiles" or "raytiles". Standard practice (Twitter, GitHub do this).
**Implementation:** Store `username_normalized = username.toLowerCase()` for uniqueness checks.

### What if an account is locked and someone tries to log in?
**Our choice:** Return 423 (Locked) with the `lockedUntil` timestamp. UI displays a countdown.
**Why:** Honest feedback. Telling the user "wait an hour" is better than vague errors.

### What if the lockout expires mid-attempt?
**Our choice:** On every login attempt, check if `lockedUntil` is in the past. If yes, clear it and the failed-attempt counter.
**Why:** Self-healing — no admin intervention needed to unlock.

### What if a user enters their CORRECT password but the account is locked?
**Our choice:** Still refuse with the lockout message. Don't let them in.
**Why:** Otherwise the lockout has no teeth. A brute-forcer would just keep trying until they got the right password.

### What about timing attacks on the login endpoint?
**Our choice:** Always run `bcrypt.compare` even when the user doesn't exist, against a dummy hash.
**Why:** Without this, attackers can guess valid usernames by measuring response time.

```ts
const user = await findUser(username);
const hash = user?.passwordHash ?? '$2a$10$dummydummydummydummydummydummydummydummydummydummydumm';
const valid = await bcrypt.compare(password, hash) && user !== null;
```

## Password Recovery

### Should the recovery endpoint reveal whether the email exists?
**Our choice:** No. Always return the same "If the email exists, a link has been sent" response.
**Why:** Prevents user enumeration attacks.

### What if a recovery token is used twice?
**Our choice:** Mark tokens as used on first use. Reject reused tokens.
**Why:** Standard security practice.

### How long are recovery tokens valid?
**Our choice:** 1 hour.
**Why:** Long enough for users to check email, short enough to limit damage if intercepted.

## Real-Time Updates

### How often do we poll for updates?
**Our choice:** Every 3 seconds while the election view is open.
**Why:** Feels real-time without overwhelming the API. Bumps up to 1s if performance allows.

### Do we keep polling after the election closes?
**Our choice:** No. Once status === 'closed', stop polling. Results are immutable.
**Why:** No reason to spam the API.

## Caching

### How long do we cache API responses?
| Data | TTL | Reason |
|------|-----|--------|
| Election counts (nav bar) | 15s | Background data, can be slightly stale |
| Election list (history) | 30s | Static once closed |
| Single election (open) | 3s | Real-time-ish |
| Single election (closed) | 5 minutes | Immutable, cache aggressively |
| User profile | Until edited | Rare changes |

## UI / Responsive

### What's the mobile breakpoint?
**Our choice:** Tailwind defaults — `sm:` (640px), `md:` (768px), `lg:` (1024px).
**Why:** Industry standard, judges use Chrome DevTools device mode (which matches).

### Should drag-and-drop work on touch devices?
**Our choice:** Yes — `@dnd-kit` supports touch out of the box.
**Why:** Req 15 says mobile must work, and Req 9 requires ranking.

## Submission Notes

**For judges:** This file documents intentional design decisions for ambiguous parts of the spec. If a behavior seems unexpected, check here first.
