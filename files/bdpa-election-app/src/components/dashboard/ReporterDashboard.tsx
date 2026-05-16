// OWNER: Student C
// PURPOSE: Reporter's home — recently closed elections + link to History.
//
// REQUIREMENT: 4 (Reporter section)
// REPORTERS CAN ONLY VIEW — no actions allowed.

'use client';

import useSWR from 'swr';
import Link from 'next/link';
import type { Election } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ReporterDashboard({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR<{ recent: Election[] }>(
    '/api/dashboard/reporter',
    fetcher
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reporter Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Most recent closed elections in the system, including those from other teams.
      </p>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600">Failed to load.</p>}

      {data && (
        <ul className="space-y-2">
          {data.recent.map(e => (
            <li key={e.id} className="bg-white p-3 rounded shadow-sm border">
              <Link href={`/history#${e.id}`} className="font-medium text-blue-600 hover:underline">
                {e.title}
              </Link>
              <p className="text-sm text-gray-600">{e.description}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link href="/history" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
          View all past elections →
        </Link>
      </div>
    </div>
  );
}
