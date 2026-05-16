// OWNER: Student D
// PURPOSE: Pure function implementation of Instant-Runoff Voting (Requirement 9).
//
// THIS IS A PURE FUNCTION — no I/O, no API calls, no database.
// Same inputs always produce the same output.
//
// REQUIREMENT: 9
// DIFFICULTY: ⭐⭐⭐⭐⭐
//
// IMPORTANT: See docs/IRV_LOGIC.md for the full algorithm explanation
// and edge case handling rules.

import type { Ballot, IRVResult, IRVRound } from '@/types';

/**
 * Calculate the winner of an IRV election.
 *
 * @param options - All voting options (e.g. ["pizza", "tacos", "chicken"])
 * @param ballots - Cast ballots, each with a voter ID and a ranking map
 * @returns Winner, the elimination rounds, and metadata about ties/exhausted ballots
 */
export function calculateIRVWinner(options: string[], ballots: Ballot[]): IRVResult {
  // ─── Trivial cases ────────────────────────────────────────────────
  if (ballots.length === 0) {
    return { winner: null, rounds: [], totalBallots: 0, isTie: false, tiedOptions: [] };
  }
  if (options.length === 0) {
    return { winner: null, rounds: [], totalBallots: ballots.length, isTie: false, tiedOptions: [] };
  }
  if (options.length === 1) {
    const tallies = { [options[0]]: ballots.length };
    return {
      winner: options[0],
      rounds: [{ roundNumber: 1, tallies, eliminated: null, exhaustedBallots: 0 }],
      totalBallots: ballots.length,
      isTie: false,
      tiedOptions: [],
    };
  }

  // ─── Main loop ────────────────────────────────────────────────────
  const remaining = new Set(options);
  const rounds: IRVRound[] = [];
  let roundNumber = 0;

  // Safety cap to prevent infinite loops if data is malformed
  const maxRounds = options.length;

  while (remaining.size > 1 && roundNumber < maxRounds) {
    roundNumber++;

    // Tally first-place votes among remaining options
    const tallies: Record<string, number> = {};
    for (const opt of remaining) tallies[opt] = 0;
    let exhausted = 0;

    for (const ballot of ballots) {
      const top = findTopRemainingChoice(ballot, remaining);
      if (top === null) {
        exhausted++;
      } else {
        tallies[top]++;
      }
    }

    const activeBallots = ballots.length - exhausted;
    const majorityThreshold = activeBallots / 2;

    // Check for a majority winner
    for (const opt of remaining) {
      if (tallies[opt] > majorityThreshold) {
        rounds.push({ roundNumber, tallies, eliminated: null, exhaustedBallots: exhausted });
        return {
          winner: opt,
          rounds,
          totalBallots: ballots.length,
          isTie: false,
          tiedOptions: [],
        };
      }
    }

    // No majority — eliminate lowest
    const counts = Array.from(remaining).map(o => ({ option: o, count: tallies[o] }));
    const minCount = Math.min(...counts.map(c => c.count));
    const tiedForLast = counts.filter(c => c.count === minCount).map(c => c.option);

    // Check final-round tie: if all remaining options are tied at zero
    // or there's an unbreakable tie with all remaining options
    if (tiedForLast.length === remaining.size) {
      rounds.push({ roundNumber, tallies, eliminated: null, exhaustedBallots: exhausted });
      return {
        winner: null,
        rounds,
        totalBallots: ballots.length,
        isTie: true,
        tiedOptions: tiedForLast,
      };
    }

    const toEliminate = breakEliminationTie(tiedForLast, ballots);
    remaining.delete(toEliminate);
    rounds.push({ roundNumber, tallies, eliminated: toEliminate, exhaustedBallots: exhausted });
  }

  // Loop ended — last option standing wins
  const survivors = Array.from(remaining);
  return {
    winner: survivors[0] ?? null,
    rounds,
    totalBallots: ballots.length,
    isTie: false,
    tiedOptions: [],
  };
}

/**
 * For a given ballot, find the highest-ranked option that hasn't been eliminated yet.
 * Returns null if all of this voter's choices have been eliminated (exhausted ballot).
 */
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

/**
 * Tie-breaker for elimination: among tied options, eliminate the one with
 * the fewest 2nd-place votes. If still tied, eliminate alphabetically.
 *
 * NOTE: This is one of several valid IRV tie-breaking rules.
 * Document this choice in docs/IRV_LOGIC.md.
 */
function breakEliminationTie(candidates: string[], ballots: Ballot[]): string {
  if (candidates.length === 1) return candidates[0];

  const scored = candidates.map(c => {
    let secondPlaceCount = 0;
    for (const b of ballots) {
      if (b.ranking[c] === 2) secondPlaceCount++;
    }
    return { option: c, secondPlaceCount };
  });

  scored.sort((a, b) =>
    a.secondPlaceCount - b.secondPlaceCount || a.option.localeCompare(b.option)
  );
  return scored[0].option;
}
