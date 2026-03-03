
// import type { MatchData } from '../types';
import { AlertCircle, Target, Zap } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import MatchHeader from "@components/MatchHeader";
import MatchStatisticsTabs from "@components/MatchStatisticsTabs";
import { MatchSummary } from "@components/MatchSummary";
import PlayerHeader from "@components/PlayerHeader";
import { Button } from "@components/ui/Button";
import { useAddPointToLiveMatch, useLiveMatch } from "@hooks/useLiveMatch";
import { useMatchById } from "@hooks/useMatches";
import type { LiveMatch, Match as MatchType } from "src/types";

// Create a default live match from a regular match (used when match hasn't started)
const createDefaultLiveMatch = (match: MatchType): LiveMatch => ({
  id: -1,
  matchId: match.id.toString(),
  tournament: match.tournament,
  round: match.round,
  surface: match.surface,
  format: match.format,
  date: match.date,
  playerA: match.playerA,
  playerB: match.playerB,
  winner: match.winner,
  tossWinner: match.tossWinner,
  status: "created",
  currentSet: 1,
  currentServer: match.tossWinner === "A" ? "A" : undefined,
  sets: [],
  matchStats: {},
});

const Match = () => {
  const params = useParams();
  const { data: match, isLoading } = useMatchById(params.id!);
  const { data: liveMatch } = useLiveMatch(match?.id);
  const addPoint = useAddPointToLiveMatch();
  const { t } = useTranslation();
  const [serveType, setServeType] = useState<"first" | "second">("first");

  // Use default live match when no data or match hasn't started
  const displayLiveMatch = liveMatch || (match && createDefaultLiveMatch(match));

  const handleAddPoint = (matchId: number, liveMatchId: number, player?: 'A' | 'B', serveResult?: string, serveType?: string, winnerShot?: string) => {
    // Logic to start live match goes here
    addPoint.mutate({ matchId, liveMatchId, player, serveResult, serveType, winnerShot });
    if (serveResult === 'error') {
      setServeType("second");
    } else {
      setServeType("first");
    }
  };

  if (isLoading || !match) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MatchHeader
        match={match}
        liveMatch={displayLiveMatch}
      />
      <div className="max-w-4xl mx-auto flex flex-row justify-between">
        <PlayerHeader player={match.playerA} winner={match.winner === "A"} />
        <PlayerHeader player={match.playerB} winner={match.winner === "B"} />
      </div>
      {displayLiveMatch && !displayLiveMatch.error && (
        <MatchSummary
          format={match.format}
          currentGame={displayLiveMatch.currentGame}
          isLive={displayLiveMatch.status === "in-progress"}
          sets={displayLiveMatch.sets}
          playerA={match.playerA}
          playerB={match.playerB}
          winner={match.winner}
        />
      )}

      {displayLiveMatch && !displayLiveMatch.error && displayLiveMatch.status === "in-progress" && (
        <>
          <h2 className="text-xl font-bold mb-4">{t('liveMatch.controls')}</h2>
          <div className="mx-2 max-w-4xl md:mx-auto bg-white border border-gray-300 mb-8 py-4">
            {(displayLiveMatch.currentGame?.server && displayLiveMatch.currentGame?.server === "A") ? (
              <h3>{t('liveMatch.currentServer')}: {displayLiveMatch.playerA.firstname} {displayLiveMatch.playerA.lastname}</h3>
            ) : (<h3>{t('liveMatch.currentServer')}: {displayLiveMatch.playerB.firstname} {displayLiveMatch.playerB.lastname}</h3>)}
            <div className="mb-2 px-8">
              <h4 className="text-left mb-1 mt-2">{t('liveMatch.serve')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" disabled={serveType === "second"} onClick={() => handleAddPoint(match.id, displayLiveMatch.id, undefined, 'error', 'first')}>
                  {t("liveMatch.stats.first_serve_fault")}
                </Button>
                <Button variant="secondary" disabled={serveType === "first"} onClick={() => handleAddPoint(match.id, displayLiveMatch.id, undefined, 'double-fault', 'second')}>
                  <AlertCircle className="w-3.5 h-3.5 mr-2" />
                  {t("liveMatch.stats.double_faults")}
                </Button>
                <div className="col-span-2">
                  <Button variant="secondary" style={{ width: '100%' }} onClick={() => handleAddPoint(match.id, displayLiveMatch.id, undefined, 'ace', serveType)}>
                    <Zap className="w-3.5 h-3.5 mr-2 text-primary" />
                    {t("liveMatch.stats.ace")}
                  </Button>
                </div>
              </div>
              <h4 className="text-left mb-1 mt-2">{t('liveMatch.stats.winner')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="controlPlayerA" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'A', undefined, serveType, 'winner')}>
                  <Target className="w-3.5 h-3.5 mr-2" />
                  {displayLiveMatch.playerA.firstname} {displayLiveMatch.playerA.lastname}
                </Button>
                <Button variant="controlPlayerB" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'B', undefined, serveType, 'winner')}>
                  <Target className="w-3.5 h-3.5 mr-2" />
                  {displayLiveMatch.playerB.firstname} {displayLiveMatch.playerB.lastname}
                </Button>
              </div>
              <h4 className="text-left mb-1 mt-2">{t('liveMatch.stats.unforced_error')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="controlPlayerA" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'B', undefined, serveType, 'unforced-error')}>
                  {displayLiveMatch.playerA.firstname} {displayLiveMatch.playerA.lastname}
                </Button>
                <Button variant="controlPlayerB" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'A', undefined, serveType, 'unforced-error')}>
                  {displayLiveMatch.playerB.firstname} {displayLiveMatch.playerB.lastname}
                </Button>
              </div>
              <h4 className="text-left mb-1 mt-2">{t('liveMatch.stats.error')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="controlPlayerA" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'B', undefined, serveType, 'error')}>
                  {displayLiveMatch.playerA.firstname} {displayLiveMatch.playerA.lastname}
                </Button>
                <Button variant="controlPlayerB" onClick={() => handleAddPoint(match.id, displayLiveMatch.id, 'A', undefined, serveType, 'error')}>
                  {displayLiveMatch.playerB.firstname} {displayLiveMatch.playerB.lastname}
                </Button>
              </div>
            </div>
            {addPoint.error && <p style={{ color: 'red' }}>Error: {addPoint.error.message}</p>}
          </div>
        </>
      )}

      <MatchStatisticsTabs matchStats={displayLiveMatch?.matchStats} />
    </>
  );
};

export default Match;
