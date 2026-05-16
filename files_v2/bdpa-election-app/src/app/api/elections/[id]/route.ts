// OWNER: Student A (data fetching) + Student D (results calculation integration)
// PURPOSE: GET /api/elections/[id] — returns election + user's ballot + (if closed) results.
// REQUIREMENT: 3, 9

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { bdpaApi } from '@/lib/api/client';
import { getElectionStatus } from '@/types';
import { calculateIRVWinner } from '@/lib/irv';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const election = await bdpaApi.elections.get(params.id);

    // Find current user's ballot, if any
    const myBallot = election.ballots.find(b => b.voterId === session.userId)?.ranking ?? null;

    // Determine if user can vote
    // TODO Student A: check user's election assignments (only assigned voters can vote)
    const canVote = session.type === 'voter';

    const status = getElectionStatus(election);
    const results = status === 'closed'
      ? calculateIRVWinner(election.options, election.ballots)
      : undefined;

    return NextResponse.json({ election, myBallot, canVote, results });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load election' }, { status: 500 });
  }
}
