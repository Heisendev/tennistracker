import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

import LiveScoreBoard from "../components/LiveScoreBoard";
import SetStatsCard from "../components/SetStatsCard";
import { useLiveMatch } from "../hooks";
import { colors, spacing, typography } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "LiveMatch">;

export default function LiveMatchScreen({ route }: Props) {
  const { width } = useWindowDimensions();
  const { matchId } = route.params;
  const { data, isLoading, error } = useLiveMatch(matchId);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const setStatsEntries = useMemo(
    () => (data?.matchStats ? Object.entries(data.matchStats).toReversed() : []),
    [data?.matchStats],
  );

  if (isLoading) {
    return <View style={styles.center}><Text style={styles.infoText}>Loading match...</Text></View>;
  }

  if (error || !data) {
    return <View style={styles.center}><Text style={styles.errorText}>{error || "Match not found"}</Text></View>;
  }

  const cardWidth = width - spacing.lg * 2;

  const handleSetStatsScrollEnd = (offsetX: number) => {
    const index = Math.round(offsetX / cardWidth);
    const clamped = Math.max(0, Math.min(index, setStatsEntries.length - 1));
    setActiveSetIndex(clamped);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tournament}>{data.tournament}</Text>
      <Text style={styles.meta}>{data.round} • {data.surface}</Text>
      <Text style={styles.status}>{data.status}</Text>

      <Text style={styles.sectionLabel}>Live Scoreboard</Text>
      <LiveScoreBoard match={data} />

      {setStatsEntries.length > 0 && <Text style={styles.sectionLabel}>Set Statistics</Text>}
      {setStatsEntries.length > 0 && (
        <View style={styles.carouselBlock}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => handleSetStatsScrollEnd(event.nativeEvent.contentOffset.x)}
          >
            {setStatsEntries.map(([setKey, setStats]) => (
              <View key={setKey} style={{ width: cardWidth }}>
                <SetStatsCard setKey={setKey} statsA={setStats.A} statsB={setStats.B} />
              </View>
            ))}
          </ScrollView>
          {setStatsEntries.length > 1 && (
            <View style={styles.dotsRow}>
              {setStatsEntries.map(([setKey], index) => (
                <View
                  key={`dot-${setKey}`}
                  style={[styles.dot, index === activeSetIndex ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  tournament: {
    ...typography.display,
    fontSize: 28,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  status: {
    ...typography.bodyBold,
    alignSelf: "flex-start",
    fontSize: 11,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    backgroundColor: colors.accentSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  sectionLabel: {
    ...typography.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: spacing.xs,
  },
  carouselBlock: {
    gap: spacing.sm,
  },
  carouselContent: {
    alignItems: "stretch",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotInactive: {
    backgroundColor: colors.textMuted,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  errorText: {
    ...typography.bodyMedium,
    color: "#b91c1c",
    fontSize: 15,
    textAlign: "center",
  },
});
