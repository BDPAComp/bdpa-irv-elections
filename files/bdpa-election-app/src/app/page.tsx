// OWNER: Student A
// PURPOSE: Landing page at http://127.0.0.1:3000/
// REQUIREMENT: Judges only type http://127.0.0.1:3000 to reach the app.
//
// Logic:
//   - If logged in → redirect to /dashboard
//   - If not logged in → redirect to /login

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth/session';

export default async function HomePage() {
  const token = cookies().get('session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
