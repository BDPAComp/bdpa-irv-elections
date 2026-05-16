// OWNER: Student B
// PURPOSE: Password hashing and verification.
//
// REQUIREMENT: 13 (Security — hashed passwords, never plaintext)
// DIFFICULTY: ⭐⭐⭐ (security-sensitive)
//
// We use bcrypt because it's the industry standard for password storage.
// It includes the salt automatically and is resistant to brute-force.

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // bcrypt work factor; 10 is standard

/**
 * Hash a plaintext password for storage.
 * NEVER store plaintext passwords — always hash first.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a stored hash.
 * Constant-time comparison — safe against timing attacks.
 */
export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

/**
 * Classify password strength per Requirement 6.
 *   weak     ≤ 10 chars (REJECT)
 *   moderate 11–17 chars
 *   strong   > 17 chars
 */
export type PasswordStrength = 'weak' | 'moderate' | 'strong';

export function classifyPasswordStrength(password: string): PasswordStrength {
  if (password.length <= 10) return 'weak';
  if (password.length <= 17) return 'moderate';
  return 'strong';
}
