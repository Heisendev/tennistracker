export type Player = {
  name: string;
  country: string;
  seed?: number;
  sets: number[];
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

export type MatchData = {
  id: string;
  tournament: string;
  round: string;
  surface: string;
  date: string;
  duration: string;
  playerA: Player;
  playerB: Player;
  winner: "A" | "B";
  tossWinner: "A" | "B";
  stats: MatchStats[] ;
};
