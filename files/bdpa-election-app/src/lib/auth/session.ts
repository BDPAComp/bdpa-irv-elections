// OWNER: Student B
// PURPOSE: Issue and verify JWTs for authenticated sessions.
//
// REQUIREMENT: 6 (auth), including "remember me" functionality
//
// "Remember me" → longer expiration (30 days)
// Normal login → shorter expiration (4 hours)

import { SignJWT, jwtVerify } from 'jose';
import type { UserType } from '@/types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me-please');

export interface SessionPayload {
  userId: string;
  username: string;
  type: UserType;
  isSuperAdmin: boolean;
  rememberMe: boolean;
}

const SESSION_DURATION = '4h';
const REMEMBER_ME_DURATION = '30d';

/**
 * Create a signed JWT for a user session.
 * If rememberMe is true, the token lasts much longer.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const expiration = payload.rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(JWT_SECRET);
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
