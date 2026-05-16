// OWNER: Student B
// PURPOSE: Track failed login attempts and lock accounts (Requirement 6).
//
// Rules:
//   - 3 failed attempts → locked for 1 hour
//   - Lockout must survive server restart → store in DB
//   - Users always see how many attempts they have left
//
// TODO Student B: implement the actual storage using the SQLite layer
// from src/lib/cache/db.ts (which Student A is building).

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour

export interface LoginAttemptStatus {
  attemptsRemaining: number;
  isLocked: boolean;
  lockedUntil: number | null;  // unix epoch ms
}

/**
 * Check the lockout/attempt status for a username.
 * Call this BEFORE checking the password.
 */
export async function getLoginAttemptStatus(username: string): Promise<LoginAttemptStatus> {
  // TODO: query DB for failed attempts and lockedUntil
  return {
    attemptsRemaining: MAX_ATTEMPTS,
    isLocked: false,
    lockedUntil: null,
  };
}

/**
 * Record a failed login attempt.
 * If this is the 3rd one, lock the account for 1 hour.
 */
export async function recordFailedAttempt(username: string): Promise<LoginAttemptStatus> {
  // TODO:
  // 1. Increment failedLoginAttempts in DB
  // 2. If failedLoginAttempts >= MAX_ATTEMPTS, set lockedUntil = Date.now() + LOCKOUT_DURATION_MS
  // 3. Return updated status
  throw new Error('Not implemented');
}

/**
 * Clear failed attempts after a successful login.
 */
export async function clearFailedAttempts(username: string): Promise<void> {
  // TODO: reset failedLoginAttempts and lockedUntil in DB
  throw new Error('Not implemented');
}
