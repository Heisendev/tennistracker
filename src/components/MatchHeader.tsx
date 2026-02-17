import type { LiveMatch, Match } from "src/types";
import Header from "./Header";

import { useTranslation } from "react-i18next";
import { useCreateLiveMatch } from "../hooks/useLiveMatch";
import { Button } from "./ui/Button";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const MatchHeader = ({ match, liveMatch }: { match: Match, liveMatch: LiveMatch | undefined }) => {
  const { tournament, round, surface, date, duration } = match; 
  const createLiveMatch = useCreateLiveMatch();

  const handleStartLiveMatch = () => {
    // Logic to start live match goes here
    console.log("Starting live match...");
    createLiveMatch.mutate(match.id);
  };

  const { t } = useTranslation();
  return (
    <>
      <Header title={t("matchStats")}/>
      <div className="text-center mb-8">
        {liveMatch && liveMatch.status &&
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t(`liveMatch.${liveMatch?.status.toLowerCase()}`)}  
          </span>
        </div>
        }
        <h1 className="text-4xl md:text-6xl font-display text-foreground mb-3">
          {tournament}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>{round}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="capitalize">{surface}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{formatDate(date)}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{duration}</span>
        </div>
        {!liveMatch &&
          <div className="mt-4">
            <Button onClick={handleStartLiveMatch} variant="secondary">{t("liveMatch.startLiveMatch")}</Button>
          </div>
        }
      </div>
    </>
  );
};

export default MatchHeader;
