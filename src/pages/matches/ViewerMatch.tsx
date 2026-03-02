import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import MatchHeader from "@components/MatchHeader";
import { MatchStats } from "@components/MatchStats";
import { MatchSummary } from "@components/MatchSummary";
import PlayerHeader from "@components/PlayerHeader";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@components/ui/Tabs";
import { useLiveMatch } from "@hooks/useLiveMatch";
import type { MatchStatsSet } from "src/types";

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
    errors: 0,
    winners: 0,
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
    errors: 0,
    winners: 0,
  },
};

const formatStats = (stats: MatchStatsSet) => {
  if (!stats) {
    return "No stats available";
  }

  const playerA = stats.A || initialStats.A;
  const playerB = stats.B || initialStats.B;

  return Object.entries(playerA).map(([key, value]) => (
    <MatchStats
      key={key}
      label={key}
      playerA={value}
      playerB={playerB[key as keyof typeof playerB]}
    />
  ));
};

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

      {liveMatch.matchStats && (() => {
        const stats = liveMatch.matchStats;

        return (
          <>
            <h2 className="text-xl font-bold mb-4">{t("liveMatch.matchStatistics")}</h2>
            <div className="mx-2 max-w-4xl md:mx-auto bg-white border border-gray-300 mb-8 pb-4 pt-8">
              <Tabs defaultIndex={0}>
                <TabList>
                  {Object.entries(stats).map(([key], i) => (
                    <Tab key={key} index={i}>Set {i + 1}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {Object.entries(stats).map(([key]) => {
                    const statKey = `${key}` as keyof typeof stats;
                    if (stats[statKey]) {
                      return <TabPanel key={key}>{formatStats(stats[statKey])}</TabPanel>;
                    }
                    return <TabPanel key={key}>No stats available</TabPanel>;
                  })}
                </TabPanels>
              </Tabs>
            </div>
          </>
        );
      })()}
    </>
  );
};

export default ViewerMatch;
