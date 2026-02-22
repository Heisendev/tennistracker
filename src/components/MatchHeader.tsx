import type { LiveMatch, Match } from "src/types";
import Header from "./Header";

import { useTranslation } from "react-i18next";
import { useUpdateLiveMatchStatus, useCreateLiveMatch } from "../hooks/useLiveMatch";
import { Button } from "./ui/Button";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const MatchHeader = ({ match, liveMatch }: { match: Match, liveMatch?: LiveMatch | undefined }) => {
  const { tournament, round, surface, date, duration } = match; 
  const createLiveMatch = useCreateLiveMatch();
  const updateMatchStatus = useUpdateLiveMatchStatus();

  const { t } = useTranslation();
  
  const handleStartLiveMatch = () => {
    // Logic to start live match goes here
    console.log("Starting live match...", match.id);
    createLiveMatch.mutate(match.id);
  };

  return (
    <>
      <Header title={t("matchStats")}/>
      <div className="text-center mb-8">
        {liveMatch && liveMatch.status &&
        <div className="flex flex-col items-center gap-2 my-4 mx-auto justify-center">
          {liveMatch && liveMatch.status !== "created" &&
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
             <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t(`liveMatch.${liveMatch?.status.toLowerCase()}`)}  </span>
          </div>
          }
          {liveMatch.status === "created" && <div className="mt-4">
            <Button onClick={handleStartLiveMatch} variant="secondary">{t("liveMatch.scheduleMatch")}</Button>
          </div>}
          {liveMatch.status === "scheduled" && <Button onClick={() => updateMatchStatus.mutate({ liveMatchId: liveMatch.id, status: "in-progress" })} variant="secondary">
            {t("liveMatch.startLiveMatch")}
          </Button>}
          {liveMatch.status === "in-progress" && <Button onClick={() => updateMatchStatus.mutate({ liveMatchId: liveMatch.id, status: "completed" })} variant="secondary">
            {t("liveMatch.complete")}
          </Button>}
        </div>
        }
        <h1 className="text-4xl md:text-6xl font-display text-foreground my-3">
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
      </div>
    </>
  );
};

export default MatchHeader;
