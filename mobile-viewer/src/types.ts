export type RootStackParamList = {
  LiveMatches: undefined;
  LiveMatch: { matchId: number };
};

export type Player = {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
};

export type LiveSessionListItem = {
  id: number;
  match_id: number;
  status: "scheduled" | "in-progress" | "suspended" | "completed";
  tournament: string;
  round: string;
  surface: string;
  date: string;
  playerA: Player;
  playerB: Player;
};

export type LiveSet = {
  set_number: number;
  games_a: number;
  games_b: number;
  is_tiebreak?: boolean;
  tiebreak_points_a?: number;
  tiebreak_points_b?: number;
  set_winner?: "A" | "B";
};

export type CurrentGame = {
  points_a: number;
  points_b: number;
  server: "A" | "B";
  is_tiebreak?: boolean;
};

export type MatchStatsPlayer = {
  aces: number;
  first_serve_won: number;
  first_serve_count: number;
  second_serve_won: number;
  serves_total: number;
  break_points_faced: number;
  break_points_won: number;
  double_faults: number;
  winners: number;
  errors: number;
  unforced_errors: number;
  total_points_won: number;
};

export type MatchStats = Record<string, { A?: MatchStatsPlayer; B?: MatchStatsPlayer }>;

export type LiveMatchDetail = {
  id: number;
  match_id: number;
  matchId?: string;
  status: "scheduled" | "in-progress" | "suspended" | "completed";
  tournament: string;
  round: string;
  surface: string;
  format: "BO3" | "BO5" | "FR2";
  date: string;
  winner?: "A" | "B";
  playerA: Player;
  playerB: Player;
  sets: LiveSet[];
  currentGame?: CurrentGame;
  matchStats?: MatchStats;
};
