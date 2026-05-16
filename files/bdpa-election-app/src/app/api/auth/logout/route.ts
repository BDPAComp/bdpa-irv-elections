// OWNER: Student B
// PURPOSE: POST /api/auth/logout — clear session cookie.
// REQUIREMENT: 6 (logout doesn't need to call BDPA API)

import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', { maxAge: 0, path: '/' });
  return res;
}
