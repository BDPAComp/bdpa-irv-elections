// OWNER: Student C (UI side) + Student A (data side)
// PURPOSE: GET /api/elections/history — paginated, sorted list of closed elections.
// REQUIREMENT: 5, 12

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware';

type SortField = 'title' | 'createdAt' | 'opensAt' | 'closesAt';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const sort = (url.searchParams.get('sort') ?? 'closesAt') as SortField;
  const dir = (url.searchParams.get('dir') ?? 'desc') === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
  const pageSize = Math.max(1, Math.min(50, parseInt(url.searchParams.get('pageSize') ?? '10', 10)));

  // TODO Student A/C:
  //   1. Fetch all CLOSED elections from BDPA API (paginated, walk pages if needed)
  //   2. If user.type !== 'administrator', exclude deleted ones
  //   3. Sort by `sort` field in `dir` direction
  //   4. Slice for pagination
  //   5. Return { elections, total }

  return NextResponse.json({ elections: [], total: 0 });
}
