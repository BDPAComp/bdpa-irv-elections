// OWNER: Student A + Student B
// PURPOSE: Bootstrap script — runs once to seed the super admin and reset state.
//
// REQUIREMENT: 1 (super admin must always exist, even after reset)
//
// Run with: `npx ts-node scripts/setup.ts`
// Or: `npm run setup` (after adding script to package.json)
//
// What this does:
//   1. Ensures the SQLite database exists with all tables
//   2. Creates the super admin user from .env if one doesn't exist
//   3. Marks them as needing to change password on first login

import db from '../src/lib/cache/db';
import { hashPassword } from '../src/lib/auth/password';
import crypto from 'crypto';

async function setup() {
  const username = process.env.SUPER_ADMIN_USERNAME ?? 'superadmin';
  const email = process.env.SUPER_ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.SUPER_ADMIN_PASSWORD ?? 'change-me-on-first-login';

  // Check if super admin already exists
  const existing = db.prepare('SELECT id FROM users WHERE is_super_admin = 1').get();
  if (existing) {
    console.log('Super admin already exists. Skipping creation.');
    return;
  }

  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  const insertUser = db.prepare(`
    INSERT INTO users (
      id, username, email, type, is_super_admin,
      is_deleted, must_change_password, created_at
    ) VALUES (?, ?, ?, 'administrator', 1, 0, 1, ?)
  `);

  const insertCreds = db.prepare(`
    INSERT INTO user_credentials (user_id, password_hash, failed_login_attempts)
    VALUES (?, ?, 0)
  `);

  const txn = db.transaction(() => {
    insertUser.run(userId, username, email, Date.now());
    insertCreds.run(userId, passwordHash);
  });
  txn();

  console.log(`✓ Created super admin user: ${username}`);
  console.log(`  Login with the password from your .env (SUPER_ADMIN_PASSWORD)`);
  console.log(`  You'll be required to change it on first login.`);
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
