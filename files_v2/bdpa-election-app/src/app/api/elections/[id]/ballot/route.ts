// OWNER: Student D
// PURPOSE: PUT /api/elections/[id]/ballot — cast or update a vote.
//          DELETE /api/elections/[id]/ballot — abstain (remove vote).
// REQUIREMENT: 3 (voting), 9 (ranking)

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';
import { bdpaApi } from '@/lib/api/client';
import { ballotSchema } from '@/lib/validation/schemas';
import { invalidate } from '@/lib/cache/apiCache';
import { getElectionStatus } from '@/types';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req, ['voter']);
  if (!session) return NextResponse.json({ error: 'Voters only' }, { status: 403 });

  const body = await req.json();
  const parsed = ballotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid ballot' }, { status: 400 });

  try {
    const election = await bdpaApi.elections.get(params.id);
    if (getElectionStatus(election) !== 'open') {
      return NextResponse.json({ error: 'Election is not open' }, { status: 409 });
    }

    // Verify all options are ranked exactly once
    const submittedOptions = Object.keys(parsed.data.ranking);
    if (submittedOptions.length !== election.options.length ||
        !submittedOptions.every(o => election.options.includes(o))) {
      return NextResponse.json({ error: 'Must rank every option exactly once' }, { status: 400 });
    }

    // TODO Student A/D: verify this user is assigned to this election

    await bdpaApi.ballots.cast(params.id, session.userId, parsed.data.ranking);
    invalidate(`election:${params.id}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to cast ballot' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAuth(req, ['voter']);
  if (!session) return NextResponse.json({ error: 'Voters only' }, { status: 403 });

  try {
    const election = await bdpaApi.elections.get(params.id);
    if (getElectionStatus(election) !== 'open') {
      return NextResponse.json({ error: 'Election is not open' }, { status: 409 });
    }
    await bdpaApi.ballots.remove(params.id, session.userId);
    invalidate(`election:${params.id}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove ballot' }, { status: 500 });
  }
}
