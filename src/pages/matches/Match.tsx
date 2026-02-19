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

import { useMatchById } from "../../hooks/useMatchs";
import { useLiveMatch, addPointToLiveMatch } from "../../hooks/useLiveMatch";

const Match = () => {
  const params = useParams();
  const { data: match, isLoading } = useMatchById(params.id!);
  const { data: liveMatch } = useLiveMatch(match?.id);
  const addPoint = addPointToLiveMatch();

  const handleAddPoint = (matchId: number, liveMatchId: number, player: 'A' | 'B') => {
    // Logic to start live match goes here
    addPoint.mutate({ matchId, liveMatchId, player });
  };

  if (isLoading || !match) {
    return <div>Loading...</div>;
  }

  const formatStats = (stats: MatchStatsSet) => {
    if (!stats) return "No stats available";
    const playerA = stats.A || undefined;
    const playerB = stats.B || undefined;
    if (!playerA && !playerB) return "No stats available";
    return Object.entries(playerA || {}).map(([key, value]) => {
      console.log(`Player A - ${key}: ${value}`);
      const statsDisplay = {
        "label": key,
        "playerA": value,
        "playerB": playerB ? (playerB as any)[key] : "N/A",
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
        <div>
          <Button onClick={() => handleAddPoint(match.id, liveMatch.id, 'A')} variant="secondary" disabled={addPoint.isPending}>Point A</Button>
          <Button onClick={() => handleAddPoint(match.id, liveMatch.id, 'B')} variant="secondary" disabled={addPoint.isPending}>Point B</Button>
          {addPoint.error && <p style={{ color: 'red' }}>Error: {addPoint.error.message}</p>}
        </div>
      )}

      {liveMatch && liveMatch.matchStats &&
        <div className=" max-w-4xl mx-auto bg-white rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4">Match Statistics</h2>
          <Tabs defaultIndex={0}>
            <TabList>
              {Object.entries(liveMatch?.matchStats || {}).map(([], i) => {
                return <Tab index={i}>Set {i + 1}</Tab>;
              })}
            </TabList>
            <TabPanels>
              {Object.entries(liveMatch?.matchStats || {}).map(([key]) => {
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
      }
    </>
  );
};

export default Match;
