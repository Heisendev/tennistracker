import type { CurrentGame, Player, Set } from "../types";

interface MatchSummaryProps {
  playerA: Player;
  playerB: Player;
  format: number;
  winner?: "A" | "B";
  sets?: Set[];
  isLive?: boolean;
  currentGame?: CurrentGame
}

const FormatScore = (Sx: number, Sy: number): string => {
  const realScore = ["0", "15", "30", "40", "A"];
  if (Sx > 3 && Sy === Sx) {
    return "40";
  }
  if (Sx > 3 && Sy < Sx) {
    return "A";
  }
  if (Sx > 3 && Sy > Sx) {
    return "";
  }
  return `${realScore[Sx]}`;
}

export const MatchSummary = ({
  currentGame,
  format,
  sets,
  playerA,
  playerB,
  winner,
  isLive = false,
}: MatchSummaryProps) => {

  const numberOfSets = format === 0 ? 5 : 3;
  console.log(format, numberOfSets)
  const gridFormat = isLive ? `1fr_repeat(${numberOfSets + 1},35px) md:grid-cols-[1fr_repeat(${numberOfSets + 1},48px)]`
    : `1fr_repeat(${numberOfSets},35px) md:grid-cols-[1fr_repeat(${numberOfSets},48px)]`;
  const setsPlayed = numberOfSets===5 ? isLive ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5] : numberOfSets===3 ? isLive ? [1, 2, 3, 4] : [1, 2, 3] : [];
  console.log("setsPlayed", isLive, setsPlayed);
  return (
    <div className={"mx-2 mb-8 max-w-4xl md:mx-auto grid bg-white items-center border border-gray-300 rounded-lg" + (numberOfSets===5 ? isLive ? " grid-cols-[1fr_repeat(6,35px)] md:grid-cols-[1fr_repeat(6,48px)]" : " grid-cols-[1fr_repeat(5,35px)] md:grid-cols-[1fr_repeat(5,48px)]" : numberOfSets===3 ? isLive ? " grid-cols-[1fr_repeat(4,35px)] md:grid-cols-[1fr_repeat(4,48px)]" : " grid-cols-[1fr_repeat(3,35px)] md:grid-cols-[1fr_repeat(3,48px)]" : "")} style={{ gridTemplateColumns: gridFormat }}>
      <div className="px-4 py-2 h-6" />
      {setsPlayed.map((set, index) => {
        if (isLive && index === setsPlayed.length - 1) {
          return (
            <div
              key={set}
              className="text-center text-xs text-muted-foreground font-medium py-2"
            >
            </div>
          )
        }
        return (
          <div
            key={set}
            className="text-center text-xs text-muted-foreground font-medium py-2"
          >
            S{set}
          </div>
        )
      })}
      <div
        className={`px-4 py-4 flex items-center gap-2 h-6 border-t border-gray-300 ${winner === "A" ? "text-foreground" : "text-muted-foreground"}`}
      >
        {winner === "A" && <div className="w-1 h-6 rounded-full bg-primary" />}
        {currentGame && currentGame.server === "A" ? 
        <div><div className="bounce"></div><div className="bounceshadow"></div></div> : ""}
        <span>{playerA.firstname} {playerA.lastname}</span>
      </div>
      {setsPlayed.map((index, i) => {
        if (isLive && i === setsPlayed.length - 1) {
          return (
            <div
              key={index}
              className="text-xl font-display flex items-center justify-center border-l text-muted-foreground font-medium h-6 py-4 border-t border-gray-300"
            >
              {currentGame && FormatScore(currentGame.points_a, currentGame.points_b)}
            </div>
          )
        }
        return (
          <div
            key={index}
            className={`text-center py-4 font-medium h-6 border-t border-gray-300 `}
          >
            {sets && sets[i] ? sets[i].games_a : ""}
          </div>
        )
      })}
      <div
        className={`px-4 py-4 flex items-center gap-2 h-6 border-t border-gray-300 ${winner === "B" ? "text-foreground" : "text-muted-foreground"}`}
      >
        {winner === "B" && <div className="w-1 h-6 rounded-full bg-primary" />}
        {currentGame && currentGame.server === "B" ? 
        <div><div className="bounce"></div><div className="bounceshadow"></div></div> : ""}
        <span>{playerB.firstname} {playerB.lastname}</span>
      </div>
      {isLive && setsPlayed.map((index, i) => {
        if (i === setsPlayed.length - 1) {
          return (
            <div
              key={index}
              className="text-xl font-display flex items-center justify-center border-l text-muted-foreground font-medium h-6 py-4 border-t border-gray-300"
            >
              {currentGame && FormatScore(currentGame.points_b, currentGame.points_a)}
            </div>
          )
        }
        return (
          <div
            key={index}
            className={`text-center py-4 font-medium h-6 border-t border-gray-300 `}
          >
            {sets && sets[i] ? sets[i].games_b : ""}
          </div>
        )
      })}
    </div>
  );
};
