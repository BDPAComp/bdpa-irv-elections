// OWNER: Student B
// PURPOSE: Authentication entry point.
//
// REQUIREMENT: 6
// DIFFICULTY: ⭐⭐⭐ (security-sensitive)

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        Forgot your password?{' '}
        <a href="/recover" className="text-blue-600 hover:underline">
          Recover account
        </a>
      </p>
    </div>
  );
}
