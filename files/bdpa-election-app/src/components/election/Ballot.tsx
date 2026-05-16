// OWNER: Student D
// PURPOSE: The ranked-choice ballot. Voter drags options into preferred order.
//
// REQUIREMENT: 9 (IRV — voters rank all options)
// DIFFICULTY: ⭐⭐⭐⭐
//
// IMPORTANT:
//   - Voter must rank ALL options (no partial ballots)
//   - Voter can change their ballot while election is open
//   - Voter can abstain (remove their ballot entirely)
//   - Submitting "ranking" object must use 1-based ranks ({opt: 1, opt: 2, ...})

'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Election } from '@/types';

interface Props {
  election: Election;
  currentRanking?: Record<string, number>;
  onVoteCast: () => void;
}

export default function Ballot({ election, currentRanking, onVoteCast }: Props) {
  // Build initial order — either from existing ranking or election.options order
  const [order, setOrder] = useState<string[]>(() => {
    if (currentRanking) {
      return [...election.options].sort(
        (a, b) => (currentRanking[a] ?? 99) - (currentRanking[b] ?? 99)
      );
    }
    return [...election.options];
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Refresh local order when server data changes (e.g. another tab voted)
  useEffect(() => {
    if (currentRanking) {
      setOrder([...election.options].sort(
        (a, b) => (currentRanking[a] ?? 99) - (currentRanking[b] ?? 99)
      ));
    }
  }, [currentRanking, election.options]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = order.indexOf(String(active.id));
      const newIdx = order.indexOf(String(over.id));
      setOrder(arrayMove(order, oldIdx, newIdx));
    }
  }

  async function submitBallot() {
    setSubmitting(true);
    setMessage(null);
    const ranking = Object.fromEntries(order.map((opt, i) => [opt, i + 1]));
    try {
      const res = await fetch(`/api/elections/${election.id}/ballot`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ranking }),
      });
      if (!res.ok) throw new Error('Submit failed');
      setMessage('Your vote has been recorded.');
      onVoteCast();
    } catch {
      setMessage('Failed to submit your vote. Try again?');
    } finally {
      setSubmitting(false);
    }
  }

  async function abstain() {
    setSubmitting(true);
    try {
      await fetch(`/api/elections/${election.id}/ballot`, { method: 'DELETE' });
      setMessage('Your vote has been removed (abstained).');
      onVoteCast();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-700">
        Drag options to rank from most preferred (top) to least preferred (bottom).
      </p>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ol className="space-y-2">
            {order.map((opt, i) => (
              <SortableItem key={opt} id={opt} rank={i + 1} label={opt} />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex gap-2">
        <button
          onClick={submitBallot}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {currentRanking ? 'Update vote' : 'Submit vote'}
        </button>
        {currentRanking && (
          <button
            onClick={abstain}
            disabled={submitting}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Remove my vote (abstain)
          </button>
        )}
      </div>

      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
    </div>
  );
}

function SortableItem({ id, rank, label }: { id: string; rank: number; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-300 px-4 py-3 rounded shadow-sm flex items-center gap-3 cursor-grab active:cursor-grabbing"
    >
      <span className="font-bold text-blue-600 w-6">#{rank}</span>
      <span>{label}</span>
    </li>
  );
}
