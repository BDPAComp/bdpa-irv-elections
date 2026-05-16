// OWNER: Student D
// PURPOSE: Election view — viewing/voting/results for a single election.
//
// REQUIREMENT: 3, 10 (real-time)
// DIFFICULTY: ⭐⭐⭐⭐
//
// Three states:
//   1. Upcoming → show "Election hasn't started yet, opens at X"
//   2. Open    → voter sees ballot, admin sees readonly preview
//   3. Closed  → show results (winner, rounds, voter's own choice highlighted)

import ElectionView from '@/components/election/ElectionView';

export default function ElectionPage({ params }: { params: { id: string } }) {
  return <ElectionView electionId={params.id} />;
}
