// OWNER: Student A
// PURPOSE: GET /api/elections/counts — returns total/open/closed counts for the nav bar.
// REQUIREMENT: 8 (nav bar), 11 (must be fast → caching)

import { NextResponse } from 'next/server';
import { getOrFetch } from '@/lib/cache/apiCache';
import { bdpaApi } from '@/lib/api/client';

export async function GET() {
  try {
    // Cache for 15 seconds — nav bar doesn't need millisecond precision
    const counts = await getOrFetch('election-counts', async () => {
      // TODO Student A:
      //   1. Fetch all elections (paginated). Walk pages until exhausted.
      //   2. Count total / open / closed based on opensAt/closesAt timestamps.
      //   3. Excluded deleted elections except when admin (this endpoint is for nav, so exclude).
      return { total: 0, open: 0, closed: 0 };
    }, 15_000);

    return NextResponse.json(counts);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
