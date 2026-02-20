import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (typeof playerA === "string" || typeof playerB === "string" || label === "set_number") {
    return (
      <>
      </>
    );
  }
  const maxVal = isPercentage ? 100 : playerA + playerB || 1; // Avoid division by zero
  const widthA = (playerA / maxVal) * 100;
  const widthB = (playerB / maxVal) * 100;
  const aWins = playerA > playerB;
  const bWins = playerB > playerA;
  const unitDisplay = isPercentage ? "%" : "";

  return (
    <div className="py-3 px-4">
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-lg font-semibold tabular-nums ${aWins ? "text-primary" : "text-muted-foreground"}`}
        >
          {playerA}
          {unitDisplay}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t(`liveMatch.stats.${label}`)}
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
          <motion.div
            className={`h-full rounded-l-full ${aWins ? "stat-gradient" : "bg-muted"}`}
            initial={{ width: 0 }}
            animate={{ width: `${widthA}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <div className="flex-1">
          <motion.div
            className={`h-full rounded-r-full ${bWins ? "stat-gradient-secondary" : "bg-muted"}`}
            initial={{ width: 0 }}
            animate={{ width: `${widthB}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
};
