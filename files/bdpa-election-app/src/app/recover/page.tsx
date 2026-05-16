// OWNER: Student B
// PURPOSE: Password recovery — request a reset link.
// REQUIREMENT: 7
// DIFFICULTY: ⭐⭐⭐

'use client';

import { useState } from 'react';

export default function RecoverPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO Student B:
    //   1. POST /api/auth/recover with the email
    //   2. Server generates a token, stores its hash with 1-hour expiry,
    //      and "sends" the email by console.log (simulation)
    //   3. ALWAYS respond success — don't reveal whether the email exists
    //      (prevents user enumeration)
    await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <h1 className="text-xl font-bold">Check your email</h1>
        <p className="mt-2 text-gray-600">
          If an account with that email exists, a reset link has been sent.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          (For judging: the recovery email is printed to the server console — see README)
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-xl font-bold">Recover your account</h1>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        className="w-full px-3 py-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Send recovery link
      </button>
    </form>
  );
}
