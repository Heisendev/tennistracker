interface MatchStatsProps {
  label: string;
  playerA: number | "A" | "B";
  playerB: number | "A" | "B";
  isPercentage?: boolean;
}

export const MatchStats = ({
  label,
  playerA,
  playerB,
  isPercentage = false,
}: MatchStatsProps) => {
  if (typeof playerA === "string" || typeof playerB === "string" || label === "set_number") {
    return (
      <>
      </>
    );
  }
  const maxVal = isPercentage ? 100 : Math.max(playerA, playerB, 1);
  const widthA = (playerA / maxVal) * 100;
  const widthB = (playerB / maxVal) * 100;
  const aWins = playerA > playerB;
  const bWins = playerB > playerA;
  const unitDisplay = isPercentage ? "%" : "";

  return (
    <div className="py-3 px-4">
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-lg font-semibold tabular-nums ${aWins ? "text-primary glow-text" : "text-muted-foreground"}`}
        >
          {playerA}
          {unitDisplay}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span
          className={`text-lg font-semibold tabular-nums ${bWins ? "text-stat-secondary" : "text-muted-foreground"}`}
        >
          {playerB}
          {unitDisplay}
        </span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end">
          <div
            className={`h-full rounded-l-full ${aWins ? "stat-gradient" : "bg-muted"}`}
            style={{ width: `${widthA}%` }}
          />
        </div>
        <div className="flex-1">
          <div
            className={`h-full rounded-r-full ${bWins ? "stat-gradient-secondary" : "bg-muted"}`}
            style={{ width: `${widthB}%` }}
          />
        </div>
      </div>
    </div>
  );
};
