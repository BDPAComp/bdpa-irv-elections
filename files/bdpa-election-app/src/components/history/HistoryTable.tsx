// OWNER: Student C
// PURPOSE: Sortable + paginated table of closed elections.
// REQUIREMENT: 5, 12
// DIFFICULTY: ⭐⭐

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import type { Election } from '@/types';

type SortField = 'title' | 'createdAt' | 'opensAt' | 'closesAt';
type SortDir = 'asc' | 'desc';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HistoryTable() {
  const [sortField, setSortField] = useState<SortField>('closesAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const url = `/api/elections/history?sort=${sortField}&dir=${sortDir}&page=${page}&pageSize=${pageSize}`;
  const { data, error, isLoading } = useSWR<{ elections: Election[]; total: number }>(url, fetcher);

  function setSort(field: SortField) {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <div>
      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600">Failed to load history.</p>}

      {data && (
        <>
          <table className="w-full bg-white border">
            <thead>
              <tr className="text-left text-sm">
                <SortHeader label="Title"   active={sortField === 'title'}     dir={sortDir} onClick={() => setSort('title')} />
                <SortHeader label="Created" active={sortField === 'createdAt'} dir={sortDir} onClick={() => setSort('createdAt')} />
                <SortHeader label="Opened"  active={sortField === 'opensAt'}   dir={sortDir} onClick={() => setSort('opensAt')} />
                <SortHeader label="Closed"  active={sortField === 'closesAt'}  dir={sortDir} onClick={() => setSort('closesAt')} />
              </tr>
            </thead>
            <tbody>
              {data.elections.map(e => (
                <tr key={e.id} id={e.id} className="border-t text-sm">
                  <td className="px-3 py-2">
                    <Link href={`/election/${e.id}`} className="text-blue-600 hover:underline">
                      {e.title}
                    </Link>
                    {!e.ownedByUs && <span className="ml-2 text-xs bg-gray-100 px-1 rounded">External</span>}
                  </td>
                  <td className="px-3 py-2">{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(e.opensAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(e.closesAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm">Page {page} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SortHeader({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  return (
    <th onClick={onClick} className="px-3 py-2 cursor-pointer hover:bg-gray-50">
      {label}
      {active && <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}
