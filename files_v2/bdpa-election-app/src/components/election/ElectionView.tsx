// OWNER: Student D
// PURPOSE: The core voting/results UI for a single election.
//
// REQUIREMENT: 3, 10
// DIFFICULTY: ⭐⭐⭐⭐
//
// Renders different sub-components depending on whether the election is
// upcoming, open, or closed.
//
// REAL-TIME (Req 10): useSWR with refreshInterval keeps data fresh
// without page refresh. Once the election closes, we stop polling.

'use client';

import useSWR from 'swr';
import { getElectionStatus, type Election, type IRVResult } from '@/types';
import Ballot from './Ballot';
import ResultsDisplay from './ResultsDisplay';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface ElectionData {
  election: Election;
  myBallot: Record<string, number> | null;  // null if not voted yet
  canVote: boolean;                          // false for admins, unassigned voters, etc.
  results?: IRVResult;                       // only present if election closed
}

export default function ElectionView({ electionId }: { electionId: string }) {
  const { data, error, isLoading } = useSWR<ElectionData>(
    `/api/elections/${electionId}`,
    fetcher,
    {
      // Real-time: poll every 3 seconds while page is visible (Req 10)
      refreshInterval: 3000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading) return <p>Loading election…</p>;
  if (error || !data) return <p className="text-red-600">Failed to load election.</p>;

  const status = getElectionStatus(data.election);

  return (
    <article>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{data.election.title}</h1>
        <p className="text-gray-700 mt-1">{data.election.description}</p>
        <StatusBadge status={status} election={data.election} />
      </header>

      {status === 'upcoming' && (
        <p className="bg-blue-50 border border-blue-200 p-4 rounded">
          This election opens on {new Date(data.election.opensAt).toLocaleString()}.
        </p>
      )}

      {status === 'open' && data.canVote && (
        <Ballot
          election={data.election}
          currentRanking={data.myBallot ?? undefined}
          onVoteCast={() => { /* SWR refetch happens automatically */ }}
        />
      )}

      {status === 'open' && !data.canVote && (
        <p className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          You cannot vote in this election.
        </p>
      )}

      {status === 'closed' && data.results && (
        <ResultsDisplay
          election={data.election}
          results={data.results}
          myFirstChoice={firstChoiceFromBallot(data.myBallot)}
        />
      )}
    </article>
  );
}

function firstChoiceFromBallot(ranking: Record<string, number> | null): string | null {
  if (!ranking) return null;
  for (const [opt, rank] of Object.entries(ranking)) {
    if (rank === 1) return opt;
  }
  return null;
}

function StatusBadge({ status, election }: { status: string; election: Election }) {
  const colors = {
    upcoming: 'bg-blue-100 text-blue-800',
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-200 text-gray-700',
  } as const;
  return (
    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${colors[status as keyof typeof colors]}`}>
      {status.toUpperCase()}
      {status === 'open' && ` · closes ${new Date(election.closesAt).toLocaleString()}`}
    </span>
  );
}
