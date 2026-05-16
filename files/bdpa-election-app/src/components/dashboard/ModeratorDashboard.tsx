// OWNER: Student C
// PURPOSE: Moderator's home — add/remove voters from elections they oversee.
//
// REQUIREMENT: 4 (Moderator section)
// MUST DO:
//   - Show elections this moderator has been assigned to
//   - For each, allow adding/removing voters (those become eligible to vote)
//
// TODO Student C: implement the assignment UI.

'use client';

export default function ModeratorDashboard({ userId }: { userId: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Moderator Dashboard</h1>
      <p className="text-gray-600">Manage voter assignments for elections you oversee.</p>
      {/* TODO:
        1. Fetch /api/dashboard/moderator → returns assigned elections
        2. For each election, render <ElectionVoterManager electionId={e.id} />
        3. <ElectionVoterManager /> has an "add voter" input and a list of currently assigned voters
      */}
    </div>
  );
}
