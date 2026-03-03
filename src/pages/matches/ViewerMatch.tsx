import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import MatchHeader from "@components/MatchHeader";
import MatchStatisticsTabs from "@components/MatchStatisticsTabs";
import { MatchSummary } from "@components/MatchSummary";
import PlayerHeader from "@components/PlayerHeader";
import { useLiveMatch } from "@hooks/useLiveMatch";

const ViewerMatch = () => {
  const params = useParams();
  const matchId = Number(params.id);
  const { data: liveMatch, isLoading, error } = useLiveMatch(Number.isNaN(matchId) ? undefined : matchId);
  const { t } = useTranslation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!liveMatch) {
    return <div>{t("liveMatch.notStarted")}</div>;
  }

  return (
    <>
      <MatchHeader match={liveMatch} liveMatch={liveMatch} readOnly />
      <div className="max-w-4xl mx-auto flex flex-row justify-between">
        <PlayerHeader player={liveMatch.playerA} winner={liveMatch.winner === "A"} />
        <PlayerHeader player={liveMatch.playerB} winner={liveMatch.winner === "B"} />
      </div>

      {!liveMatch.error && (
        <MatchSummary
          format={liveMatch.format}
          currentGame={liveMatch.currentGame}
          isLive={liveMatch.status === "in-progress"}
          sets={liveMatch.sets}
          playerA={liveMatch.playerA}
          playerB={liveMatch.playerB}
          winner={liveMatch.winner}
        />
      )}

      <MatchStatisticsTabs matchStats={liveMatch.matchStats} />
    </>
  );
};

export default ViewerMatch;
