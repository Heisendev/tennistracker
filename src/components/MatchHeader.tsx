import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useCreateLiveMatch,
  useUpdateLiveMatchStatus,
} from "@hooks/useLiveMatch";
import type { LiveMatch, Match } from "src/types";

import Header from "./Header";
import { Button } from "./ui/Button";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const MatchHeader = ({
  match,
  liveMatch,
  readOnly = false,
}: {
  match: Match;
  liveMatch?: LiveMatch | undefined;
  readOnly?: boolean;
}) => {
  const { tournament, round, surface, date, duration } = match;
  const [tossWinner, setTossWinner] = useState<"A" | "B" | undefined>(undefined);
  const createLiveMatch = useCreateLiveMatch();
  const updateMatchStatus = useUpdateLiveMatchStatus();

  const { t } = useTranslation();

  const handleStartLiveMatch = () => {
    createLiveMatch.mutate(match.id);
  };

  return (
    <>
      <Header title={t("matchStats")} />
      <div className="text-center mb-8">
        {!readOnly && liveMatch && liveMatch.status && (
          <div className="flex flex-col items-center gap-2 my-4 mx-auto justify-center">
            {liveMatch && liveMatch.status !== "created" && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t(`liveMatch.${liveMatch?.status.toLowerCase()}`)}{" "}
                </span>
              </div>
            )}
            {liveMatch.status === "created" && (
              <div className="mt-4">
                <Button onClick={handleStartLiveMatch} variant="secondary">
                  {t("liveMatch.scheduleMatch")}
                </Button>
              </div>
            )}
            {liveMatch.status === "scheduled" && (
              <div className="flex flex-col">
                  <h4>{t("liveMatch.selectTossWinner")}</h4>
                <div role="radiogroup" className="toggle mb-2">
                  <input type="radio" name="tossWinner" id="tossWinnerA" value="A" onChange={() => setTossWinner("A")} />
                  <label htmlFor="tossWinnerA">{match.playerA.firstname} {match.playerA.lastname}</label>
                  <input type="radio" name="tossWinner" id="tossWinnerB" value="B" onChange={() => setTossWinner("B")} />
                  <label htmlFor="tossWinnerB">{match.playerB.firstname} {match.playerB.lastname}</label>
                </div>

                <Button
                onClick={() =>
                  updateMatchStatus.mutate({
                    liveMatchId: liveMatch.id,
                    status: "in-progress",
                    tossWinner: tossWinner,
                  })
                }
                disabled={!tossWinner}
                variant="secondary"
              >
                {t("liveMatch.startLiveMatch")}
              </Button>
              </div>
            )}
            {liveMatch.status === "in-progress" && (
              <Button
                onClick={() =>
                  updateMatchStatus.mutate({
                    liveMatchId: liveMatch.id,
                    status: "completed",
                  })
                }
                variant="secondary"
              >
                {t("liveMatch.complete")}
              </Button>
            )}
          </div>
        )}
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
