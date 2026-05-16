// OWNER: Student D
// PURPOSE: Tests for the IRV algorithm. Run with `npm test`.
//
// These tests are the safety net for the most complex piece of logic
// in the app. Run them every time the IRV code changes.

import { calculateIRVWinner } from '../src/lib/irv/calculateWinner';
import type { Ballot } from '../src/types';

function ballot(ranking: Record<string, number>, idx: number = 0): Ballot {
  return { voterId: `voter-${idx}`, ranking };
}

describe('calculateIRVWinner', () => {
  test('problem statement example: Pizza wins after Tacos eliminated', () => {
    const ballots: Ballot[] = [
      ...Array(4).fill(null).map((_, i) => ballot({ Chicken: 1, Pizza: 2, Tacos: 3 }, i)),
      ...Array(4).fill(null).map((_, i) => ballot({ Pizza: 1, Tacos: 2, Chicken: 3 }, i + 4)),
      ...Array(2).fill(null).map((_, i) => ballot({ Tacos: 1, Pizza: 2, Chicken: 3 }, i + 8)),
    ];

    const result = calculateIRVWinner(['Pizza', 'Chicken', 'Tacos'], ballots);

    expect(result.winner).toBe('Pizza');
    expect(result.rounds).toHaveLength(2);
    expect(result.rounds[0].eliminated).toBe('Tacos');
    expect(result.totalBallots).toBe(10);
  });

  test('zero ballots: no winner', () => {
    const result = calculateIRVWinner(['A', 'B', 'C'], []);
    expect(result.winner).toBeNull();
    expect(result.totalBallots).toBe(0);
  });

  test('single option: wins by default', () => {
    const result = calculateIRVWinner(['OnlyOption'], [
      ballot({ OnlyOption: 1 }),
    ]);
    expect(result.winner).toBe('OnlyOption');
  });

  test('majority winner in round 1', () => {
    const ballots = [
      ...Array(6).fill(null).map((_, i) => ballot({ A: 1, B: 2, C: 3 }, i)),
      ...Array(2).fill(null).map((_, i) => ballot({ B: 1, A: 2, C: 3 }, i + 6)),
      ...Array(2).fill(null).map((_, i) => ballot({ C: 1, A: 2, B: 3 }, i + 8)),
    ];
    const result = calculateIRVWinner(['A', 'B', 'C'], ballots);
    expect(result.winner).toBe('A');
    expect(result.rounds).toHaveLength(1); // No eliminations needed
  });

  test('exhausted ballots: voter only ranked one option, that option is eliminated', () => {
    const ballots = [
      // 2 voters only rank A (it'll be eliminated, their ballots exhaust)
      ballot({ A: 1 }, 0),
      ballot({ A: 1 }, 1),
      // 3 voters rank B then C
      ...Array(3).fill(null).map((_, i) => ballot({ B: 1, C: 2 }, i + 2)),
      // 4 voters rank C then B
      ...Array(4).fill(null).map((_, i) => ballot({ C: 1, B: 2 }, i + 5)),
    ];
    // Round 1: A=2, B=3, C=4. No majority (need >50% of 9 = >4.5). A eliminated.
    // Round 2: B=3, C=4. 2 ballots exhausted (the A-only ones). Active=7. C>3.5 so C wins.
    const result = calculateIRVWinner(['A', 'B', 'C'], ballots);
    expect(result.winner).toBe('C');
    expect(result.rounds[0].eliminated).toBe('A');
    expect(result.rounds[1].exhaustedBallots).toBe(2);
  });

  test('tied elimination: deterministic tie-break by 2nd-place votes', () => {
    const ballots = [
      ballot({ A: 1, B: 2, C: 3 }, 0),
      ballot({ B: 1, C: 2, A: 3 }, 1),
      ballot({ C: 1, A: 2, B: 3 }, 2),
    ];
    // Round 1: all tied at 1. Tie-break: count 2nd-place votes.
    // A: 1 (from voter 2), B: 1 (from voter 0), C: 1 (from voter 1) — still tied.
    // Then alphabetical → A eliminated first.
    const result = calculateIRVWinner(['A', 'B', 'C'], ballots);
    expect(result.rounds[0].eliminated).toBe('A');
  });
});
