// OWNER: Student B
// PURPOSE: Middleware that protects API routes — checks JWT, enforces role.
//
// REQUIREMENT: 1 (user types), 6 (auth)
//
// Usage in a route handler:
//   export async function GET(req: NextRequest) {
//     const session = await requireAuth(req, ['administrator']);
//     if (!session) return new Response('Forbidden', { status: 403 });
//     // ... do admin-only work
//   }

import { NextRequest } from 'next/server';
import { verifySessionToken, SessionPayload } from './session';
import type { UserType } from '@/types';

/**
 * Read the session JWT from the cookie and verify it.
 * Returns the session payload if valid, null otherwise.
 */
export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Require authentication + (optionally) one of the given roles.
 * Returns the session if allowed, null if not (caller should return 401/403).
 */
export async function requireAuth(
  req: NextRequest,
  allowedRoles?: UserType[]
): Promise<SessionPayload | null> {
  const session = await getSession(req);
  if (!session) return null;
  if (allowedRoles && !allowedRoles.includes(session.type)) return null;
  return session;
}

/**
 * Require the SUPER admin specifically.
 * Useful for endpoints that only the super admin can hit
 * (e.g. creating other admins, deleting closed elections).
 */
export async function requireSuperAdmin(req: NextRequest): Promise<SessionPayload | null> {
  const session = await getSession(req);
  if (!session || !session.isSuperAdmin) return null;
  return session;
}
