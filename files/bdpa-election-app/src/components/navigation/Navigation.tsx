// OWNER: Student A (structure) + Student C (content)
// PURPOSE: Persistent navigation visible on every page.
//
// REQUIREMENT: 8
// MUST SHOW:
//   - BDPA logo
//   - App title
//   - Total elections count
//   - Open elections count
//   - Closed elections count
//
// DIFFICULTY: ⭐

'use client';

import Link from 'next/link';
import useSWR from 'swr';

interface ElectionCounts {
  total: number;
  open: number;
  closed: number;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Navigation() {
  // Counts refresh every 15s so the nav stays up to date
  const { data, error, isLoading } = useSWR<ElectionCounts>(
    '/api/elections/counts',
    fetcher,
    { refreshInterval: 15_000 }
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* BDPA logo — see Requirement 8 for the official URL */}
          <img
            src="https://bdpa.org/wp-content/uploads/2020/12/f0e60ae421144f918f032f455a2ac57a.png"
            alt="BDPA Logo"
            className="h-10 w-auto"
          />
          <Link href="/dashboard" className="text-xl font-bold text-gray-800">
            BDPA Elections
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {isLoading || error ? (
            <span className="text-gray-400">Loading election counts…</span>
          ) : (
            <>
              <Stat label="Total" value={data?.total ?? 0} />
              <Stat label="Open" value={data?.open ?? 0} color="text-green-600" />
              <Stat label="Closed" value={data?.closed ?? 0} color="text-gray-600" />
            </>
          )}
          <Link href="/history" className="text-blue-600 hover:underline">History</Link>
        </div>
      </div>
    </nav>
  );
}

function Stat({ label, value, color = 'text-gray-700' }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-gray-500">{label}:</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
