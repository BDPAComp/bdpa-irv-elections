// OWNER: Student D
// PURPOSE: Show the outcome of a closed election with all elimination rounds.
//
// REQUIREMENT: 3, 5, 9
// MUST SHOW:
//   - Winner clearly emphasized
//   - Eliminated options clearly marked
//   - Margin: winner's votes vs total
//   - If current user voted, their first choice gets prominent marking
//   - Voter identities never revealed

'use client';

import type { Election, IRVResult } from '@/types';

interface Props {
  election: Election;
  results: IRVResult;
  myFirstChoice: string | null;
}

export default function ResultsDisplay({ election, results, myFirstChoice }: Props) {
  const { winner, rounds, totalBallots, isTie, tiedOptions } = results;
  const finalRound = rounds[rounds.length - 1];
  const winnerVotes = winner ? finalRound?.tallies[winner] ?? 0 : 0;
  const allEliminated = rounds.map(r => r.eliminated).filter(Boolean) as string[];

  return (
    <div>
      {/* Final result */}
      <section className="mb-6">
        {isTie ? (
          <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-amber-800">Tie</h2>
            <p>Unable to determine a single winner. Tied options: {tiedOptions.join(', ')}.</p>
          </div>
        ) : winner ? (
          <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800">🏆 Winner: {winner}</h2>
            <p className="text-sm text-gray-700 mt-1">
              {winnerVotes} of {totalBallots} ballots — {((winnerVotes / totalBallots) * 100).toFixed(1)}%
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No votes were cast in this election.</p>
        )}
      </section>

      {/* All options with status */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">All options</h3>
        <ul className="space-y-1">
          {election.options.map(opt => {
            const isWinner = opt === winner;
            const isEliminated = allEliminated.includes(opt);
            const isMyChoice = opt === myFirstChoice;
            return (
              <li
                key={opt}
                className={`px-3 py-2 rounded border ${
                  isWinner ? 'bg-green-100 border-green-400 font-bold' :
                  isEliminated ? 'bg-gray-100 border-gray-300 text-gray-500 line-through' :
                  'bg-white border-gray-200'
                }`}
              >
                {opt}
                {isMyChoice && (
                  <span className="ml-2 inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">
                    Your first choice
                  </span>
                )}
                {isEliminated && <span className="ml-2 text-xs">(eliminated)</span>}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Round-by-round breakdown */}
      <section>
        <h3 className="font-semibold mb-2">Round-by-round breakdown</h3>
        <div className="space-y-3">
          {rounds.map(r => (
            <div key={r.roundNumber} className="bg-white border p-3 rounded">
              <h4 className="font-medium mb-1">Round {r.roundNumber}</h4>
              <ul className="text-sm">
                {Object.entries(r.tallies).map(([opt, count]) => (
                  <li key={opt} className="flex justify-between">
                    <span>{opt}</span>
                    <span className="font-mono">{count} vote{count === 1 ? '' : 's'}</span>
                  </li>
                ))}
              </ul>
              {r.eliminated && (
                <p className="text-xs text-red-600 mt-1">Eliminated: {r.eliminated}</p>
              )}
              {r.exhaustedBallots > 0 && (
                <p className="text-xs text-gray-500 mt-1">Exhausted ballots: {r.exhaustedBallots}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
