import type { Match, NewMatch } from "../types";

export interface MatchesApi {
  getMatches: () => Promise<Match[]>;
  getMatchById: (id: string) => Promise<Match>;
  createMatch: (match: NewMatch) => Promise<Match>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const matchesApi: MatchesApi = {
  getMatches: async () => {
    // Simulate an API call with a delay
    const response = await fetch(`${API_URL}/matches`);
    if (!response.ok) {
            throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  getMatchById: async (id: string) => {
    const response = await fetch(`${API_URL}/matches/${id}`);
    if (!response.ok) {
            throw new Error(`Failed to fetch match by id: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  createMatch: async (match: NewMatch) => {
    const response = await fetch(`${API_URL}/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(match),
    });
    if (!response.ok) {
            throw new Error(`Failed to create match: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
};
