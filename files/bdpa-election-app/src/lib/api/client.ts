// OWNER: Student A
// PURPOSE: The ONLY file that talks to the BDPA API.
// All other code goes through this wrapper to keep the API key safe
// and centralize the 555-error retry logic.
//
// REQUIREMENT: 2, 14 (retry on 555)
//
// TODO (Student A):
//   1. Read the API docs: https://hscc18f802d3.docs.apiary.io
//   2. Confirm the exact endpoint paths and request/response shapes.
//   3. Fill in the placeholder methods below.

import type { Election, NewElectionInput, Ballot } from '@/types';

const BASE_URL = process.env.BDPA_API_BASE_URL ?? '';
const API_KEY = process.env.BDPA_API_KEY ?? '';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

/**
 * Low-level fetch with automatic 555 retry (Requirement 14).
 * Don't call this directly from components — use the typed methods below.
 */
async function bdpaFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Authorization': `bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 555) {
        // The API's random failure mode — retry with backoff
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  throw new Error(`BDPA API failed after ${MAX_RETRIES} attempts: ${path}. ${String(lastError ?? '')}`);
}

/**
 * Typed methods. These are what the rest of the app should call.
 */
export const bdpaApi = {
  elections: {
    /** GET /elections — paginated list. Use `after` cursor for pagination. */
    async list(after?: string): Promise<{ elections: Election[] }> {
      // TODO Student A: confirm endpoint shape from API docs
      const path = `/v1/elections${after ? `?after=${after}` : ''}`;
      const res = await bdpaFetch(path);
      if (!res.ok) throw new Error(`Failed to list elections: ${res.status}`);
      return res.json();
    },

    /** GET /elections/:id */
    async get(id: string): Promise<Election> {
      const res = await bdpaFetch(`/v1/elections/${id}`);
      if (!res.ok) throw new Error(`Failed to get election ${id}: ${res.status}`);
      const json = await res.json();
      return json.election;
    },

    /** POST /elections — create new election (becomes "owned by us") */
    async create(data: NewElectionInput): Promise<Election> {
      const res = await bdpaFetch('/v1/elections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create election: ${res.status}`);
      const json = await res.json();
      return json.election;
    },

    /** PATCH /elections/:id — update only allowed fields */
    async update(id: string, data: Partial<Election>): Promise<Election> {
      const res = await bdpaFetch(`/v1/elections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update election ${id}: ${res.status}`);
      const json = await res.json();
      return json.election;
    },

    /** DELETE /elections/:id — sets isDeleted flag */
    async delete(id: string): Promise<void> {
      const res = await bdpaFetch(`/v1/elections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete election ${id}: ${res.status}`);
    },
  },

  ballots: {
    /** PUT /elections/:id/ballots/:voterId — cast or update a ballot */
    async cast(electionId: string, voterId: string, ranking: Record<string, number>): Promise<void> {
      const res = await bdpaFetch(`/v1/elections/${electionId}/ballots/${voterId}`, {
        method: 'PUT',
        body: JSON.stringify({ ranking }),
      });
      if (!res.ok) throw new Error(`Failed to cast ballot: ${res.status}`);
    },

    /** DELETE /elections/:id/ballots/:voterId — abstain / remove vote */
    async remove(electionId: string, voterId: string): Promise<void> {
      const res = await bdpaFetch(`/v1/elections/${electionId}/ballots/${voterId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to remove ballot: ${res.status}`);
    },
  },
};
