import { useParams } from "react-router";

// import type { MatchData } from '../types';
import MatchHeader from "@components/MatchHeader";
import PlayerHeader from "@components/PlayerHeader";
import { MatchSummary } from "@components/MatchSummary";
import { MatchStats } from "@components/MatchStats";
import { useMatchById } from "../hooks/useMatchs";

import "./App.css";

/* const matchData: MatchData[] = [{
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

const Match = () => {
  const params = useParams();
  const { data: match, isLoading } = useMatchById(params.id!);
  if (isLoading || !match) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="">
        <MatchHeader
          tournament={match.tournament}
          round={match.round}
          surface={match.surface}
          date={match.date}
          duration={match.duration}
        />
      </div>
      <div className="max-w-4xl mx-auto flex flex-row justify-between">
        <PlayerHeader player={match.playerA} winner={match.winner === "A"} />
        <PlayerHeader player={match.playerB} winner={match.winner === "B"} />
      </div>
      <MatchSummary
        playerA={match.playerA}
        playerB={match.playerB}
        winner={match.winner}
      />
      <div className=" max-w-4xl mx-auto bg-white rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Match Statistics</h2>
        {match.stats &&
          Object.entries(match.stats[0]).map(
            ([key, value]) =>
              typeof value === "object" &&
              value !== null && (
                <MatchStats
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  playerA={value.a}
                  playerB={value.b}
                  isPercentage={value.isPercentage}
                />
              ),
          )}
      </div>
    </>
  );
};

export default Match;
