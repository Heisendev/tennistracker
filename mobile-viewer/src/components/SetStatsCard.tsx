import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing, typography } from "../theme";
import type { MatchStatsPlayer } from "../types";

type Props = {
  setKey: string;
  statsA?: MatchStatsPlayer;
  statsB?: MatchStatsPlayer;
};

const StatRow = ({ label, a, b }: { label: string; a: number; b: number }) => (
  <View style={styles.statRowContainer}>
    <View style={styles.statRowTop}>
      <Text style={[styles.sideValue, a > b ? styles.sideValueAWin : styles.sideValueMuted]}>{a}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.sideValue, b > a ? styles.sideValueBWin : styles.sideValueMuted]}>{b}</Text>
    </View>
    <View style={styles.barRow}>
      <View style={styles.barHalf}>
        <View
          style={[
            styles.barFillLeft,
            a > b ? styles.barFillAWin : styles.barFillMuted,
            { width: `${(a / Math.max(a + b, 1)) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.barHalf}>
        <View
          style={[
            styles.barFillRight,
            b > a ? styles.barFillBWin : styles.barFillMuted,
            { width: `${(b / Math.max(a + b, 1)) * 100}%` },
          ]}
        />
      </View>
    </View>
  </View>
);

export default function SetStatsCard({ setKey, statsA, statsB }: Props) {
  const A = statsA || { aces: 0, double_faults: 0, first_serve_won: 0, first_serve_count: 0, second_serve_won: 0, serves_total: 0, break_points_faced: 0, break_points_won: 0, winners: 0, errors: 0, unforced_errors: 0, total_points_won: 0 };
  const B = statsB || { aces: 0, double_faults: 0, first_serve_won: 0, first_serve_count: 0, second_serve_won: 0, serves_total: 0, break_points_faced: 0, break_points_won: 0, winners: 0, errors: 0, unforced_errors: 0, total_points_won: 0 };

  const stats = [
    { label: "Aces", a: A.aces, b: B.aces },
    { label: "Double Faults", a: A.double_faults, b: B.double_faults },
    { label: "Winners", a: A.winners, b: B.winners },
    { label: "First Serve Won", a: A.first_serve_won, b: B.first_serve_won },
    { label: "Second Serve Won", a: A.second_serve_won, b: B.second_serve_won },
    { label: "Break Points Faced", a: A.break_points_faced, b: B.break_points_faced },
    { label: "Break Points Won", a: A.break_points_won, b: B.break_points_won },
    { label: "Errors", a: A.errors, b: B.errors },
    { label: "Unforced Errors", a: A.unforced_errors, b: B.unforced_errors },
    { label: "Total Points", a: A.total_points_won, b: B.total_points_won },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{setKey.replace("_", " ").toUpperCase()}</Text>
      {stats.map((entry, index) => (
        <View key={entry.label} style={index < stats.length - 1 ? styles.statRowWrap : undefined}>
          <StatRow label={entry.label} a={entry.a} b={entry.b} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow,
  },
  title: {
    ...typography.display,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  statRowContainer: {
    gap: spacing.xs,
  },
  statRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 22,
  },
  statRowWrap: {
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sideValue: {
    ...typography.monoBold,
    fontSize: 18,
    minWidth: 36,
    textAlign: "center",
  },
  sideValueAWin: {
    color: colors.accent,
  },
  sideValueBWin: {
    color: colors.done,
  },
  sideValueMuted: {
    color: colors.textSecondary,
  },
  barRow: {
    flexDirection: "row",
    gap: spacing.xs,
    height: 6,
  },
  barHalf: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: radius.pill,
    overflow: "hidden",
    justifyContent: "center",
  },
  barFillLeft: {
    height: "100%",
    alignSelf: "flex-end",
    borderTopLeftRadius: radius.pill,
    borderBottomLeftRadius: radius.pill,
  },
  barFillRight: {
    height: "100%",
    alignSelf: "flex-start",
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
  },
  barFillAWin: {
    backgroundColor: "#009ba5",
  },
  barFillBWin: {
    backgroundColor: "#297af2",
  },
  barFillMuted: {
    backgroundColor: "#d1d5db",
  },
  statValue: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
