# Instant-Runoff Voting (IRV) — Deep Dive

This is the hardest piece of logic in the app. Read this twice.

## The Rules (Plain English)

1. Every voter ranks every option from favorite (1) to least favorite (N).
2. Count everyone's #1 picks.
3. If any option has more than 50% of #1 picks → that option wins. Done.
4. Otherwise, eliminate the option with the fewest #1 picks.
5. Voters whose #1 was eliminated now have their #2 promoted to #1.
6. Go back to step 2 and repeat.

## Worked Example (from the problem statement)

10 voters, 3 options: Pizza, Chicken, Tacos.

**Round 1:**
| Group | Voters | Their #1 |
|-------|--------|----------|
| A | 4 | Chicken |
| B | 4 | Pizza |
| C | 2 | Tacos |

First-place tally: Chicken 4, Pizza 4, Tacos 2. No one has >50% (need 6). Eliminate Tacos.

**Round 2:**
The 2 Tacos voters move their #2 up. Their #2 was Pizza. So they now count for Pizza.

| Group | Voters | Their (new) #1 |
|-------|--------|---------------|
| A | 4 | Chicken |
| B | 4 | Pizza |
| C | 2 | Pizza (promoted from #2) |

Tally: Chicken 4, Pizza 6. Pizza has >50%. **Pizza wins.**

## Edge Cases You MUST Handle

### 1. Tie for last place
Two options have the same lowest count. Who do you eliminate?

**Pick a rule and stick with it.** Recommended: eliminate the option with fewer total ranking points (sum of inverse ranks), and if STILL tied, eliminate alphabetically. Document your choice.

### 2. Exhausted ballots
A voter's #1 gets eliminated, then their #2, then their #3 ... until they have no more choices. Their ballot is "exhausted" — it stops counting in subsequent rounds.

This means the "50% threshold" should be calculated against **active ballots**, not the original voter count.

### 3. Final round tie
After eliminations, two options have exactly equal votes.

**Pick a rule and document it.** Recommended: declare a tie and let an admin manually break it (UI shows "Tie between X and Y"). Or: pick the option with the most first-place votes in Round 1.

### 4. Zero voters
No one voted. Result: no winner. UI should say "No votes were cast."

### 5. Single option
Only one option exists. It wins by default in Round 1.

### 6. Voter abstains
A voter is eligible but doesn't submit a ballot. They simply don't count toward anything.

## The Algorithm (TypeScript Pseudocode)

```ts
// src/lib/irv/calculateWinner.ts
interface Ballot {
  voterId: string;
  ranking: Record<string, number>;  // {"pizza": 1, "tacos": 2, ...}
}

interface IRVRound {
  roundNumber: number;
  tallies: Record<string, number>;   // option → count
  eliminated: string | null;
  exhaustedBallots: number;
}

interface IRVResult {
  winner: string | null;
  rounds: IRVRound[];
  totalBallots: number;
  isTie: boolean;
  tiedOptions: string[];
}

export function calculateIRVWinner(
  options: string[],
  ballots: Ballot[]
): IRVResult {
  // Handle trivial cases
  if (ballots.length === 0) {
    return { winner: null, rounds: [], totalBallots: 0, isTie: false, tiedOptions: [] };
  }
  if (options.length === 1) {
    return { winner: options[0], rounds: [/* one round */], totalBallots: ballots.length, isTie: false, tiedOptions: [] };
  }

  let remaining = new Set(options);
  const rounds: IRVRound[] = [];
  let roundNumber = 0;

  while (remaining.size > 1) {
    roundNumber++;

    // Tally first-place votes among remaining options
    const tallies: Record<string, number> = {};
    for (const opt of remaining) tallies[opt] = 0;
    let exhausted = 0;

    for (const ballot of ballots) {
      const firstChoice = findTopRemainingChoice(ballot, remaining);
      if (firstChoice === null) {
        exhausted++;
      } else {
        tallies[firstChoice]++;
      }
    }

    const activeBallots = ballots.length - exhausted;
    const threshold = activeBallots / 2;  // need > 50%

    // Check for a winner
    for (const opt of remaining) {
      if (tallies[opt] > threshold) {
        rounds.push({ roundNumber, tallies, eliminated: null, exhaustedBallots: exhausted });
        return { winner: opt, rounds, totalBallots: ballots.length, isTie: false, tiedOptions: [] };
      }
    }

    // No winner — find option with fewest votes
    const counts = Object.entries(tallies);
    const minCount = Math.min(...counts.map(([_, c]) => c));
    const candidatesForElimination = counts.filter(([_, c]) => c === minCount).map(([o]) => o);

    // Tie-breaker for elimination (see EDGE_CASES doc — pick a rule)
    const toEliminate = breakTie(candidatesForElimination, ballots);

    remaining.delete(toEliminate);
    rounds.push({ roundNumber, tallies, eliminated: toEliminate, exhaustedBallots: exhausted });

    // Safety: prevent infinite loops
    if (roundNumber > options.length) break;
  }

  // Only one option left — that's the winner
  const lastOption = Array.from(remaining)[0];
  return { winner: lastOption ?? null, rounds, totalBallots: ballots.length, isTie: false, tiedOptions: [] };
}

function findTopRemainingChoice(ballot: Ballot, remaining: Set<string>): string | null {
  let bestRank = Infinity;
  let bestOption: string | null = null;
  for (const [opt, rank] of Object.entries(ballot.ranking)) {
    if (remaining.has(opt) && rank < bestRank) {
      bestRank = rank;
      bestOption = opt;
    }
  }
  return bestOption;
}

function breakTie(candidates: string[], ballots: Ballot[]): string {
  // Strategy: among the tied options, eliminate the one with the
  // fewest 2nd-place votes. If still tied, go alphabetically.
  if (candidates.length === 1) return candidates[0];

  const secondPlaceCounts = candidates.map(c => {
    let count = 0;
    for (const b of ballots) if (b.ranking[c] === 2) count++;
    return { option: c, count };
  });
  secondPlaceCounts.sort((a, b) => a.count - b.count || a.option.localeCompare(b.option));
  return secondPlaceCounts[0].option;
}
```

## Testing Strategy

Because IRV has so many edge cases, **write tests first**. Each test is a `(options, ballots) → expected winner` pair.

```ts
// __tests__/irv.test.ts
import { calculateIRVWinner } from '../src/lib/irv/calculateWinner';

test('problem statement example: Pizza wins', () => {
  const ballots = [
    ...Array(4).fill({ ranking: { Chicken: 1, Pizza: 2, Tacos: 3 } }),
    ...Array(4).fill({ ranking: { Pizza: 1, Tacos: 2, Chicken: 3 } }),
    ...Array(2).fill({ ranking: { Tacos: 1, Pizza: 2, Chicken: 3 } }),
  ].map((b, i) => ({ voterId: `v${i}`, ...b }));

  const result = calculateIRVWinner(['Pizza', 'Chicken', 'Tacos'], ballots);
  expect(result.winner).toBe('Pizza');
  expect(result.rounds).toHaveLength(2);
});

test('zero voters yields no winner', () => {
  const result = calculateIRVWinner(['A', 'B'], []);
  expect(result.winner).toBeNull();
});

test('single option wins by default', () => {
  const result = calculateIRVWinner(['Only'], [{ voterId: '1', ranking: { Only: 1 } }]);
  expect(result.winner).toBe('Only');
});

// ... more tests for ties, exhausted ballots, etc.
```

**Run tests every time you push.** A passing IRV test suite means the most complex part of your app actually works.

## Why This Function Is Pure

`calculateIRVWinner` doesn't touch the database, doesn't make HTTP calls, doesn't depend on the time of day. It's a pure function: same inputs → same output.

This means:
- Easy to test (no mocking)
- Easy to debug (no hidden state)
- Easy to cache (memoize on `(electionId, ballotCount)`)
- Won't break the rest of the app

**Student D: keep it that way.** Resist the urge to fetch ballots inside this function. Pass them in.
