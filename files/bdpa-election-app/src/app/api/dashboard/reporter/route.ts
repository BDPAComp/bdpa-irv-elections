// OWNER: Student C
// PURPOSE: GET /api/dashboard/reporter — most recent closed elections.
// REQUIREMENT: 4 (Reporter section)

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req, ['reporter']);
  if (!session) return NextResponse.json({ error: 'Reporters only' }, { status: 403 });

  // TODO Student C:
  //   1. Fetch all closed elections (owned + unowned)
  //   2. Sort by closesAt desc
  //   3. Return the most recent (e.g. top 10) as { recent: [...] }
  return NextResponse.json({ recent: [] });
}
