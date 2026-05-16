// OWNER: Student C
// PURPOSE: Personalized dashboard, rendered differently per user type.
//
// REQUIREMENT: 4
// DIFFICULTY: ⭐⭐
//
// Flow:
//   - Server reads session to identify the user
//   - If user.mustChangePassword → show change-password form
//   - Otherwise show the correct sub-dashboard for their type

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth/session';
import VoterDashboard from '@/components/dashboard/VoterDashboard';
import ModeratorDashboard from '@/components/dashboard/ModeratorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import ReporterDashboard from '@/components/dashboard/ReporterDashboard';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

export default async function DashboardPage() {
  const token = cookies().get('session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect('/login');

  // TODO Student B: provide a server-side way to check `user.mustChangePassword`
  const mustChangePassword = false; // placeholder

  if (mustChangePassword) return <ChangePasswordForm />;

  switch (session.type) {
    case 'voter':         return <VoterDashboard userId={session.userId} />;
    case 'moderator':     return <ModeratorDashboard userId={session.userId} />;
    case 'administrator': return <AdminDashboard userId={session.userId} isSuperAdmin={session.isSuperAdmin} />;
    case 'reporter':      return <ReporterDashboard userId={session.userId} />;
    default: redirect('/login');
  }
}
