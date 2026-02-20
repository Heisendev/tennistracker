import { useParams } from "react-router";

// import type { MatchData } from '../types';
import MatchHeader from "@components/MatchHeader";
import PlayerHeader from "@components/PlayerHeader";
import { MatchSummary } from "@components/MatchSummary";
import { MatchStats } from "@components/MatchStats";
import { Button } from "@components/ui/Button";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@components/ui/Tabs";

import type { MatchStatsSet } from "src/types";

import { useTranslation } from "react-i18next";

import { useMatchById } from "../../hooks/useMatchs";
import { useLiveMatch, useAddPointToLiveMatch } from "../../hooks/useLiveMatch";
import { AlertCircle, Target, Zap } from "lucide-react";
import { useState } from "react";

const Match = () => {
  const params = useParams();
  const { data: match, isLoading } = useMatchById(params.id!);
  const { data: liveMatch } = useLiveMatch(match?.id);
  const addPoint = useAddPointToLiveMatch();
  const { t } = useTranslation();
  const [serveType, setServeType] = useState<"first" | "second">("first");

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

  const initialStats: MatchStatsSet = {
    A: {
      aces: 0,
      break_points_faced: 0,
      break_points_won: 0,
      double_faults: 0,
      first_serve_count: 0,
      first_serve_won: 0,
      player: "A",
      second_serve_won: 0,
      serves_total: 0,
      set_number: 0,
      total_points_won: 0,
      unforced_errors: 0,
      winners: 0
    },
    B: {
      aces: 0,
      break_points_faced: 0,
      break_points_won: 0,
      double_faults: 0,
      first_serve_count: 0,
      first_serve_won: 0,
      player: "B",
      second_serve_won: 0,
      serves_total: 0,
      set_number: 0,
      total_points_won: 0,
      unforced_errors: 0,
      winners: 0
    }
  };

  const formatStats = (stats: MatchStatsSet) => {
    if (!stats) return "No stats available";
    const playerA = stats.A || initialStats.A;
    const playerB = stats.B || initialStats.B;

    return Object.entries(playerA || {}).map(([key, value]) => {
      console.log(`Player A - ${key}: ${value}`);
      const statsDisplay = {
        "label": key,
        "playerA": value,
        "playerB": playerB[key as keyof typeof playerB],
      };
      return <MatchStats key={key} {...statsDisplay} />;
    });
  }

  return (
    <>
      <MatchHeader
        match={match}
        liveMatch={liveMatch}
      />
      <div className="max-w-4xl mx-auto flex flex-row justify-between">
        <PlayerHeader player={match.playerA} winner={match.winner === "A"} />
        <PlayerHeader player={match.playerB} winner={match.winner === "B"} />
      </div>
      {liveMatch && !liveMatch.error && (
        <MatchSummary
          currentGame={liveMatch.currentGame}
          isLive={liveMatch.status === "in-progress"}
          sets={liveMatch.sets}
          playerA={liveMatch.playerA}
          playerB={liveMatch.playerB}
          winner={liveMatch.winner}
        />
      )}
      {liveMatch && !liveMatch.error && liveMatch.status === "in-progress" && (
        <>
          <h2 className="text-xl font-bold mb-4">{t('liveMatch.controls')}</h2>
          <div className=" max-w-4xl mx-auto bg-white rounded-lg border border-gray-300 mb-8 py-4">
            {(liveMatch.currentGame?.server && liveMatch.currentGame?.server === "A") ? (
              <h3>{t('liveMatch.currentServer')}: {liveMatch.playerA.firstname} {liveMatch.playerA.lastname}</h3>
            ) : (<h3>{t('liveMatch.currentServer')}: {liveMatch.playerB.firstname} {liveMatch.playerB.lastname}</h3>)}
            <div className="mb-2 px-8">
              <h4 className="text-left mb-1">{t('liveMatch.serve')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" disabled={serveType === "second"} onClick={() => handleAddPoint(match.id, liveMatch.id, undefined, 'error', 'first')}>
                  {t("liveMatch.stats.first_serve_fault")}
                </Button>
                <Button variant="secondary" disabled={serveType === "first"} onClick={() => handleAddPoint(match.id, liveMatch.id, undefined, 'double-fault', 'second')}>
                  <AlertCircle className="w-3.5 h-3.5 mr-2" />
                  {t("liveMatch.stats.double_faults")}
                </Button>
                <div className="col-span-2">
                  <Button variant="secondary" style={{ width: '100%' }} onClick={() => handleAddPoint(match.id, liveMatch.id, undefined, 'ace', serveType)}>
                    <Zap className="w-3.5 h-3.5 mr-2 text-primary" />
                    {t("liveMatch.stats.ace")}
                  </Button>
                </div>
              </div>
              <h4 className="text-left mb-1">{t('liveMatch.stats.winner')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="controlPlayerA" onClick={() => handleAddPoint(match.id, liveMatch.id, 'A', undefined, undefined, 'winner')}>
                  <Target className="w-3.5 h-3.5 mr-2" />
                  {liveMatch.playerA.firstname} {liveMatch.playerA.lastname}
                </Button>
                <Button variant="controlPlayerB" onClick={() => handleAddPoint(match.id, liveMatch.id, 'B', undefined, undefined, 'winner')}>
                  <Target className="w-3.5 h-3.5 mr-2" />
                  {liveMatch.playerB.firstname} {liveMatch.playerB.lastname}
                </Button>
              </div>
              <h4 className="text-left mb-1">{t('liveMatch.stats.unforced_error')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="controlPlayerA" onClick={() => handleAddPoint(match.id, liveMatch.id, 'B', undefined, undefined, 'error')}>
                  {liveMatch.playerA.firstname} {liveMatch.playerA.lastname}
                </Button>
                <Button variant="controlPlayerB" onClick={() => handleAddPoint(match.id, liveMatch.id, 'A', undefined, undefined, 'error')}>
                  {liveMatch.playerB.firstname} {liveMatch.playerB.lastname}
                </Button>
              </div>
            </div>
            {addPoint.error && <p style={{ color: 'red' }}>Error: {addPoint.error.message}</p>}
          </div>
        </>
      )}

      {liveMatch && liveMatch.matchStats &&
        <>
          <h2 className="text-xl font-bold mb-4">{t('liveMatch.matchStatistics')}</h2>
          <div className=" max-w-4xl mx-auto bg-white rounded-lg border border-gray-300 mb-8 pb-4 pt-8">
            <Tabs defaultIndex={0}>
              <TabList>
                {Object.entries(liveMatch.matchStats).map(([key], i) => {
                  return <Tab key={key} index={i}>Set {i + 1}</Tab>;
                })}
              </TabList>
              <TabPanels>
                {Object.entries(liveMatch.matchStats).map(([key]) => {
                  const statKey = `${key}` as keyof typeof liveMatch.matchStats;
                  if (liveMatch && liveMatch.matchStats && liveMatch.matchStats[statKey]) {
                    return <TabPanel>
                      {formatStats(liveMatch.matchStats[statKey])}
                    </TabPanel>;
                  }
                  return "No stats available"
                })}
              </TabPanels>
            </Tabs>
          </div>
        </>
      }
    </>
  );
};

export default Match;
