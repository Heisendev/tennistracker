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
  id: number;
  playerA: Player;
  playerB: Player;
  winner?: "A" | "B";
  tossWinner?: "A" | "B";
  stats?: MatchStats[];
  duration?: string;
};

export type LiveMatch = Omit<Match, "stats" | "duration"> & {
  matchId: string;
  status: "scheduled" | "in-progress" | "completed" | "suspended";
  currentSet: number;
  currentServer: "A" | "B";
  MatchStartTime?: string;
  MatchEndTime?: string;
  tournament: string;
  round: string;
  surface: string;
  date: string;
  playerA: Player;
  playerB: Player;
  sets: Set[];
  currentGame?: CurrentGame;
  error?: string;
};

export type Set = {
  set_number: number;
  games_a: number;
  games_b: number;
  is_tiebreak?: number;
  tiebreak_points_a?: number;
  tiebreak_points_b?: number;
  set_winner?: "A" | "B";
}

export type CurrentGame = {
  points_a: number;
  points_b: number;
  server: "A" | "B";
  gameNumber: number;
}