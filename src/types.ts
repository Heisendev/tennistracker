export type NewPlayer = {
  firstname: string;
  lastname: string;
  rank?: number;
  hand?: "Left" | "Right";
  backhand?: "One-handed" | "Two-handed";
  country: string;
};

export type Player = NewPlayer & {
  id: number;
  seed?: number;
};

export type MatchStats = {
  setNumber: number;
  aces: { a: number; b: number; isPercentage: boolean };
  doubleFaults: { a: number; b: number; isPercentage: boolean };
  firstServe: { a: number; b: number; isPercentage: boolean };
  firstServeWon: { a: number; b: number; isPercentage: boolean };
  secondServeWon: { a: number; b: number; isPercentage: boolean };
  winners: { a: number; b: number; isPercentage: boolean };
  unforcedErrors: { a: number; b: number; isPercentage: boolean };
  breakPointsWon: { a: number; b: number; isPercentage: boolean };
  totalPointsWon: { a: number; b: number; isPercentage: boolean };
};

export type NewMatch = {
  tournament: string;
  round: string;
  surface: string;
  date: string;
  playerA: string;
  playerB: string;
};

export type Match = Omit<NewMatch, "playerA" | "playerB"> & {
  id: string;
  playerA: Player;
  playerB: Player;
  winner?: "A" | "B";
  tossWinner?: "A" | "B";
  stats?: MatchStats[];
  duration?: string;
};
