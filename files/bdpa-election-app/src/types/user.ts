// OWNER: Student A
// PURPOSE: Shared User types used across the entire app.
// If you need a NEW type related to users, add it here.

export type UserType = 'voter' | 'moderator' | 'administrator' | 'reporter';

export interface User {
  id: string;
  username: string;
  email: string;
  type: UserType;
  fullName?: string;
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
  isSuperAdmin: boolean;        // Only true for THE super admin user (Req 1)
  isDeleted: boolean;
  mustChangePassword: boolean;  // True on first login (Req 4)
  lastLoginAt?: number;         // Unix epoch ms (Req 4)
  lastLoginIp?: string;         // Last IP (Req 4)
  createdAt: number;
}

export interface UserCredentials {
  // Stored separately from public User data — only auth code should touch this
  userId: string;
  passwordHash: string;        // bcrypt hash, NEVER plaintext
  passwordSalt?: string;       // If using salted SHA-256 instead of bcrypt
  failedLoginAttempts: number;
  lockedUntil?: number;        // Unix epoch ms, null if not locked
}

export interface NewUserInput {
  username: string;
  email: string;
  password: string;
  type: UserType;
  fullName?: string;
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
}
