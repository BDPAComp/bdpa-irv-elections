// OWNER: Student A
// PURPOSE: Local SQLite database for caching + non-API data (auth, sessions).
//
// REQUIREMENT: 6 (user data must be stored locally), 11 (caching for performance)
// DIFFICULTY: ⭐⭐⭐
//
// The BDPA API stores elections/ballots. We store:
//   - User credentials (passwords, lockout state, recovery tokens)
//   - Cache of API responses
//   - First-login flags, last-login info
//
// Uses better-sqlite3 — synchronous, fast, no async/await needed.

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH ?? './data/app.db';

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');     // better write concurrency
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────
// Run on every startup; CREATE TABLE IF NOT EXISTS is idempotent.

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('voter','moderator','administrator','reporter')),
    full_name TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    address TEXT,
    is_super_admin INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    must_change_password INTEGER NOT NULL DEFAULT 1,
    last_login_at INTEGER,
    last_login_ip TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_credentials (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash TEXT NOT NULL,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until INTEGER
  );

  CREATE TABLE IF NOT EXISTS recovery_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS captcha_challenges (
    id TEXT PRIMARY KEY,
    answer INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS api_cache (
    cache_key TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    cached_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

export default db;
