import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing, typography } from "../theme";
import type { LiveMatchDetail } from "../types";

type Props = {
  match: LiveMatchDetail;
};

const formatPoint = (self: number, other: number, isTiebreak?: boolean) => {
  if (isTiebreak) {
    return String(self);
  }

  const points = ["0", "15", "30", "40", "A"];
  if (self > 3 && self === other) return "40";
  if (self > 3 && self > other) return "A";
  if (self > 3 && self < other) return "";
  return points[self] || "0";
};

const SetRow = ({
  name,
  games,
  current,
}: {
  name: string;
  games: number[];
  current: string;
}) => (
  <View style={styles.playerRow}>
    <View style={styles.formatRow}>
        <Text style={styles.playerName}>{name}</Text>
        <View style={styles.scoreRow}>
        {games.map((score, index) => (
            <View key={`${name}-${index}`} style={styles.setCell}>
                <Text style={styles.setScore}>{score}</Text>
            </View>
        ))}
        <View style={styles.currentCell}>
            <Text style={styles.currentScore}>{current}</Text>
        </View>
        </View>
    </View>
  </View>
);

export default function LiveScoreBoard({ match }: Props) {
  const currentGameA = match.currentGame
    ? formatPoint(match.currentGame.points_a, match.currentGame.points_b, match.currentGame.is_tiebreak)
    : "";
  const currentGameB = match.currentGame
    ? formatPoint(match.currentGame.points_b, match.currentGame.points_a, match.currentGame.is_tiebreak)
    : "";

  return (
    <View style={styles.card}>
      <View style={styles.setHeaderRow}>
        {match.sets.map((set) => (
          <Text key={`set-label-${set.set_number}`} style={styles.setHeaderText}>S{set.set_number}</Text>
        ))}
        <Text style={styles.setHeaderText}>Game</Text>
      </View>
      <SetRow
        name={`${match.playerA.firstname} ${match.playerA.lastname}`}
        games={match.sets.map((set) => set.games_a)}
        current={currentGameA}
      />
      <SetRow
        name={`${match.playerB.firstname} ${match.playerB.lastname}`}
        games={match.sets.map((set) => set.games_b)}
        current={currentGameB}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow,
  },
  header: {
    ...typography.bodyBold,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  playerRow: {
    gap: spacing.xs + 2,
  },
  setHeaderRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  setHeaderText: {
    ...typography.bodyMedium,
    minWidth: 30,
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  playerName: {
    ...typography.bodyMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },
  formatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.sm,
  },
  setCell: {
    minWidth: 30,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: "#f3f4f8",
    alignItems: "center",
  },
  setScore: {
    ...typography.mono,
    fontSize: 15,
    color: colors.textPrimary,
  },
  currentCell: {
    marginLeft: spacing.xs,
    minWidth: 34,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.accentSubtle,
    alignItems: "center",
  },
  currentScore: {
    ...typography.monoBold,
    fontSize: 16,
    color: colors.accent,
  },
});
