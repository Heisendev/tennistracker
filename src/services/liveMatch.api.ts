import type { LiveMatch } from "src/types";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export interface LiveMatchApi {
    createLiveMatch: (matchid: number) => Promise<LiveMatch>;
    updateLiveMatchStatus: (liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended") => Promise<LiveMatch>;
    getLiveMatchById: (id: string) => Promise<LiveMatch>;
    addPoint: (liveMatchId: number, player: 'A' | 'B') => Promise<LiveMatch>;
}

export const liveMatchApi: LiveMatchApi = {
    createLiveMatch: async (matchid: number) => {
        const response = await fetch(`${API_URL}/live-scoring/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ match_id: matchid }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create live match: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    updateLiveMatchStatus: async (liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended") => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${liveMatchId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update live match status: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    getLiveMatchById: async (id: string) => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to get live match: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
    addPoint: async (liveMatchId: number, player: 'A' | 'B') => {
        const response = await fetch(`${API_URL}/live-scoring/sessions/${liveMatchId}/point`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ winner: player }),
        });
        if (!response.ok) {
            throw new Error(`Failed to add point: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    },
};
/* export const liveMatchApi: LiveMatchApi = [{
  matchId: "1",
  status: "In Progress",
  currentSet: 3,
  currentServer: "A",
  tournament: "Wimbledon",
  round: "Final",
  surface: "Grass",
  date: "2024-07-14",
  playerA: {
    id: 1,
    name: "Novak Djokovic",
    country: "Serbia",
    seed: 1,
  },
  playerB: {
    id: 2,
    name: "Carlos Alcaraz",
    country: "Spain",
    seed: 2,
  },
  sets: [
    {
      setNumber: 1,
      playerAGames: 6,
      playerBGames: 4,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe    : { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 2,
      playerAGames: 3,
      playerBGames: 6,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe    : { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 3,
      playerAGames: 6,
      playerBGames: 4,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe    : { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a   : 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
  ],        
} */