// OWNER: Student B
// PURPOSE: POST /api/auth/login — verify credentials, issue JWT cookie.
//
// REQUIREMENT: 6
//
// Flow:
//   1. Parse + validate body
//   2. Check lockout status — if locked, refuse with 423
//   3. Look up user, verify password
//   4. On success: clear failed attempts, set JWT cookie, return user info
//   5. On failure: increment failed attempts, return 401 with attemptsRemaining

import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/schemas';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken } from '@/lib/auth/session';
import {
  getLoginAttemptStatus,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/auth/lockout';
// import { findUserByUsername, updateLastLogin } from '@/lib/users/queries';  // TODO Student B: create this

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { username, password, rememberMe } = parsed.data;

    // 1. Check lockout
    const status = await getLoginAttemptStatus(username);
    if (status.isLocked) {
      return NextResponse.json(
        { error: 'Account locked due to too many failed attempts. Try again in 1 hour.', lockedUntil: status.lockedUntil },
        { status: 423 }
      );
    }

    // 2. Look up user — TODO Student B implement findUserByUsername
    // const user = await findUserByUsername(username);
    // const creds = await findCredentialsByUserId(user?.id);
    // if (!user || !creds) { ... record failed attempt ... }

    // 3. Verify password
    // const passOk = await verifyPassword(password, creds.passwordHash);
    // if (!passOk) {
    //   const updated = await recordFailedAttempt(username);
    //   return NextResponse.json({ error: 'Invalid credentials', attemptsRemaining: updated.attemptsRemaining }, { status: 401 });
    // }

    // 4. Success
    // await clearFailedAttempts(username);
    // const clientIp = req.headers.get('x-forwarded-for') ?? 'unknown';
    // await updateLastLogin(user.id, Date.now(), clientIp);
    //
    // const token = await createSessionToken({
    //   userId: user.id,
    //   username: user.username,
    //   type: user.type,
    //   isSuperAdmin: user.isSuperAdmin,
    //   rememberMe,
    // });
    //
    // const res = NextResponse.json({ user });
    // res.cookies.set('session', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: rememberMe ? 30 * 24 * 60 * 60 : 4 * 60 * 60,
    //   path: '/',
    // });
    // return res;

    return NextResponse.json({ error: 'Not yet implemented' }, { status: 501 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
