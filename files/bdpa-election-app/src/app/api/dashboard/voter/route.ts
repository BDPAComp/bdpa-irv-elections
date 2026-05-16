// OWNER: Student C (calls Student A's API + cache layers)
// PURPOSE: GET /api/dashboard/voter — data for the voter's home page.
// REQUIREMENT: 4

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req, ['voter']);
  if (!session) return NextResponse.json({ error: 'Voters only' }, { status: 403 });

  // TODO Student C:
  //   1. Get user record from DB (fullName, lastLoginAt, lastLoginIp)
  //   2. Get the elections this voter is assigned to
  //   3. Partition them into open / closed (where they voted) / upcoming
  //   4. Sort each per Requirement 4
  //   5. Return as JSON

  return NextResponse.json({
    user: { username: session.username, fullName: null, lastLoginAt: null, lastLoginIp: null },
    open: [],
    closed: [],
    upcoming: [],
  });
}
