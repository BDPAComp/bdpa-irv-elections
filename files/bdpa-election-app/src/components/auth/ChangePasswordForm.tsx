// OWNER: Student B
// PURPOSE: Shown on first login (forced) or via account settings.
// REQUIREMENT: 4 (forced first-login change), 6 (password strength)

'use client';

import { useState } from 'react';
import { classifyPasswordStrength } from '@/lib/auth/password';

export default function ChangePasswordForm() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const strength = classifyPasswordStrength(newPass);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (strength === 'weak') return;
    // TODO Student B: POST /api/auth/change-password
  }

  const strengthColor = {
    weak: 'text-red-600',
    moderate: 'text-yellow-600',
    strong: 'text-green-600',
  }[strength];

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-xl font-bold">Change your password</h1>
      <p className="text-sm text-gray-600">You must change your password before continuing.</p>

      <input type="password" placeholder="Current password" value={oldPass}
             onChange={e => setOldPass(e.target.value)} required
             className="w-full px-3 py-2 border rounded" />
      <input type="password" placeholder="New password" value={newPass}
             onChange={e => setNewPass(e.target.value)} required
             className="w-full px-3 py-2 border rounded" />

      {newPass.length > 0 && (
        <p className={`text-sm ${strengthColor}`}>
          Strength: {strength}
          {strength === 'weak' && ' (must be more than 10 characters)'}
        </p>
      )}

      <button type="submit" disabled={strength === 'weak'}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
        Change password
      </button>
    </form>
  );
}
