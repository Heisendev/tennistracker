import type { Match, NewMatch } from "../types";

/* const matchData: MatchData[] = [
    {
  id: "alcaraz-zverev-2024-rolandgarros-final",
  tournament: "Roland Garros",
  round: "Final",
  surface: "Clay",
  date: "June 9, 2024",
  duration: "3h 42m",
  playerA: {
    name: "C. Alcaraz",
    country: "🇪🇸",
    seed: 3,
    sets: [6, 2, 6, 4, 6],
  },
  playerB: {
    name: "A. Zverev",
    country: "🇩🇪",
    seed: 4,
    sets: [3, 6, 1, 6, 2],
  },
  tossWinner: "A" as "A" | "B",
  winner: "A" as "A" | "B",
  stats: [
    {
      setNumber: 0,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  {
      setNumber: 1,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  {
      setNumber: 2,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  {
      setNumber: 3,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  {
      setNumber: 4,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  {
      setNumber: 5,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
  },
  ]
}, {
  id: "djokovic-sinner-2024-rolandgarros-semifinal",
  tournament: "Roland Garros",
  round: "SemiFinal",
  surface: "Clay",
  date: "June 7, 2024",
  duration: "3h 42m",
  playerA: {
    name: "N. Djokovic",
    country: "🇷🇸",
    seed: 3,
    sets: [6, 2, 6, 4, 6],
  },
  playerB: {
    name: "J. Sinner",
    country: "🇮🇹",
    seed: 4,
    sets: [3, 6, 1, 6, 2],
  },
  tossWinner: "A",
  winner: "B",
  stats: [
    {
      setNumber: 0,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 1,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 2,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 3,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 4,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
    {
      setNumber: 5,
      aces: { a: 6, b: 9, isPercentage: false },
      doubleFaults: { a: 3, b: 5, isPercentage: false },
      firstServe: { a: 68, b: 61, isPercentage: true },
      firstServeWon: { a: 74, b: 69, isPercentage: true },
      secondServeWon: { a: 58, b: 42, isPercentage: true },
      winners: { a: 52, b: 34, isPercentage: false },
      unforcedErrors: { a: 36, b: 49, isPercentage: false },
      breakPointsWon: { a: 5, b: 2, isPercentage: false },
      totalPointsWon: { a: 142, b: 118, isPercentage: false },
    },
  ]
}]; */

export interface MatchsApi {
  getMatchs: () => Promise<Match[]>;
  getmatchById: (id: string) => Promise<Match>;
  createMatch: (match: NewMatch) => Promise<Match>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const matchsApi: MatchsApi = {
  getMatchs: async () => {
    // Simulate an API call with a delay
    const response = await fetch(`${API_URL}/matchs`);
    const data = await response.json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000); // Simulate 1 second delay
    });
  },
  getmatchById: async (id: string) => {
    const response = await fetch(`${API_URL}/matchs/${id}`);
    const data = await response.json();
    return data;
  },
  createMatch: async (match: NewMatch) => {
    const response = await fetch(`${API_URL}/matchs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(match),
    });
    const data = await response.json();
    return data;
  },
};
