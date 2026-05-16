// OWNER: Student C (UI) — works closely with Student B for user-creation API
// PURPOSE: Administrator's home — manage users, elections, and assignments.
//
// REQUIREMENT: 4 (Administrator section)
// MUST DO:
//   - Create voters, moderators, reporters
//   - If super admin: create administrators
//   - View/update/delete non-admin users (super admin can delete other admins, not self)
//   - Manage elections (create/update/delete OWNED ones; view unowned ones)
//   - Assign moderators to elections; assign voters to elections
//
// DIFFICULTY: ⭐⭐⭐ (lots of features, but each is straightforward CRUD)

'use client';

interface Props {
  userId: string;
  isSuperAdmin: boolean;
}

export default function AdminDashboard({ userId, isSuperAdmin }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard {isSuperAdmin && <span className="text-sm text-amber-600">(Super Admin)</span>}
      </h1>

      {/* TODO Student C: split into sections / tabs:
            1. User management (list + create + edit + delete)
            2. Election management (list + create + edit + delete; unowned read-only)
            3. Assignments (moderator → election; voter → election)

         For user creation, render <NewUserForm allowAdminCreation={isSuperAdmin} />.
         Created by Student B in src/components/auth/NewUserForm.tsx.
      */}
      <p className="text-gray-600">Administration tools will appear here.</p>
    </div>
  );
}
