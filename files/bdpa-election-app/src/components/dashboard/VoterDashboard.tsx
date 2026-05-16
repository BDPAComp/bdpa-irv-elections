// OWNER: Student C
// PURPOSE: Voter's home page.
//
// REQUIREMENT: 4 (Voter section)
// MUST SHOW:
//   - User's name
//   - Last login IP
//   - Last login timestamp
//   - Open elections they can vote in (sorted by opensAt ascending)
//   - Closed elections they participated in (sorted by closesAt descending)
//   - Upcoming elections they'll be eligible for (sorted by opensAt ascending)

'use client';

import useSWR from 'swr';
import Link from 'next/link';
import type { Election } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface DashboardData {
  user: { fullName?: string; username: string; lastLoginAt?: number; lastLoginIp?: string };
  open: Election[];
  closed: Election[];
  upcoming: Election[];
}

export default function VoterDashboard({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR<DashboardData>(`/api/dashboard/voter`, fetcher);

  if (isLoading) return <p>Loading…</p>;
  if (error || !data) return <p className="text-red-600">Failed to load your dashboard.</p>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Welcome, {data.user.fullName ?? data.user.username}</h1>
        <p className="text-sm text-gray-500">
          Last login: {data.user.lastLoginAt ? new Date(data.user.lastLoginAt).toLocaleString() : 'never'}
          {' '}from {data.user.lastLoginIp ?? 'unknown'}
        </p>
      </header>

      <Section title="Open elections you can vote in" elections={data.open} emptyMsg="No open elections right now." />
      <Section title="Upcoming elections" elections={data.upcoming} emptyMsg="No upcoming elections." />
      <Section title="Past elections you voted in" elections={data.closed} emptyMsg="You haven't participated in any closed elections yet." />
    </div>
  );
}

function Section({ title, elections, emptyMsg }: { title: string; elections: Election[]; emptyMsg: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {elections.length === 0 ? (
        <p className="text-gray-500 text-sm">{emptyMsg}</p>
      ) : (
        <ul className="space-y-2">
          {elections.map(e => (
            <li key={e.id} className="bg-white p-3 rounded shadow-sm border">
              <Link href={`/election/${e.id}`} className="font-medium text-blue-600 hover:underline">
                {e.title}
              </Link>
              <p className="text-sm text-gray-600">{e.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
