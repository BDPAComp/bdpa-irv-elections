// OWNER: Student B
// PURPOSE: Simple math CAPTCHA — NO external service per Requirement 6.
//
// REQUIREMENT: 6 (CAPTCHA challenge on user creation)
// DIFFICULTY: ⭐

import crypto from 'crypto';

export interface CaptchaChallenge {
  id: string;       // server-side identifier
  question: string; // e.g. "What is 7 + 4?"
  answer: number;   // stored server-side; never sent to client
}

/**
 * Generate a math CAPTCHA challenge.
 * The answer is stored server-side (e.g. in a short-lived cache) and looked up
 * when the form is submitted. Never trust the client to send the answer back
 * with the question — they could lie.
 */
export function generateCaptcha(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const ops = ['+', '-'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];

  const question = `What is ${a} ${op} ${b}?`;
  const answer = op === '+' ? a + b : a - b;
  const id = crypto.randomBytes(12).toString('hex');

  return { id, question, answer };
}

/**
 * Validate a user's CAPTCHA answer.
 * Student B: hook this up to whatever storage you choose (Map, Redis, SQLite).
 */
export function validateCaptcha(challengeId: string, userAnswer: number): boolean {
  // TODO: look up the challenge by id from storage and compare answers
  // Remember to delete the challenge after a single use to prevent replay
  return false;
}
