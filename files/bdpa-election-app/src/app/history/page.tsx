// OWNER: Student C
// PURPOSE: Paginated history of all closed elections.
//
// REQUIREMENT: 5, 12
// MUST SUPPORT:
//   - Sort by: title, creation time, opening time, closing time
//   - Initial sort: closing time descending
//   - Includes unowned (other teams') elections too
//   - Admins also see deleted elections
//   - Pagination

import HistoryTable from '@/components/history/HistoryTable';

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Election History</h1>
      <HistoryTable />
    </div>
  );
}
