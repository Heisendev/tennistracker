import { useTranslation } from "react-i18next";

import type { MatchStats as MatchStatsType, MatchStatsSet } from "src/types";

import { MatchStats } from "./MatchStats";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "./ui/Tabs";

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

const MatchStatisticsTabs = ({ matchStats }: { matchStats?: MatchStatsType }) => {
  const { t } = useTranslation();

  if (!matchStats) {
    return null;
  }

  return (
    <>
      <h2 className="text-xl font-bold mb-4">{t("liveMatch.matchStatistics")}</h2>
      <div className="mx-2 max-w-4xl md:mx-auto bg-white border border-gray-300 mb-8 pb-4 pt-8">
        <Tabs defaultIndex={0}>
          <TabList>
            {Object.entries(matchStats).map(([key], index) => (
              <Tab key={key} index={index}>Set {index + 1}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {Object.entries(matchStats).map(([key, setStats]) => (
              <TabPanel key={key}>
                {setStats ? formatStats(setStats) : "No stats available"}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
};

export default MatchStatisticsTabs;
