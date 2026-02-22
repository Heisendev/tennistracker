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
export type MatchStatsSet = {
  A: MatchStatsSetPlayer;
  B: MatchStatsSetPlayer;
}
export type MatchStats = {
  set_1?: MatchStatsSet;
  set_2?: MatchStatsSet;
  set_3?: MatchStatsSet;
  set_4?: MatchStatsSet;
  set_5?: MatchStatsSet;
};

export type MatchStatsSetPlayer = {
  aces: number;
  break_points_faced: number;
  break_points_won: number;
  double_faults: number;
  first_serve_count: number;
  first_serve_won: number;
  player: "A" | "B";
  second_serve_won: number;
  serves_total: number;
  set_number: number;
  total_points_won: number;
  unforced_errors: number;
  winners: number
}

export type NewMatch = {
  tournament: string;
  round?: string;
  surface: string;
  date: string;
  playerA: string;
  playerB: string;
  format: number;
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
  status: "created" | "scheduled" | "in-progress" | "completed" | "suspended";
  currentSet: number;
  currentServer: "A" | "B";
  MatchStartTime?: string;
  MatchEndTime?: string;
  tournament: string;
  round?: string;
  surface: string;
  date: string;
  playerA: Player;
  playerB: Player;
  sets: Set[];
  currentGame?: CurrentGame;
  error?: string;
  matchStats?: MatchStats;
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
  is_tiebreak?: boolean;
}