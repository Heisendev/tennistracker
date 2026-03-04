import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing, typography } from "../theme";
import type { LiveSessionListItem } from "../types";

type Props = {
  item: LiveSessionListItem;
  onPress: () => void;
};

const statusColor: Record<LiveSessionListItem["status"], string> = {
  "in-progress": colors.live,
  scheduled: colors.neutral,
  suspended: colors.warning,
  completed: colors.done,
};

const statusLabel: Record<LiveSessionListItem["status"], string> = {
  "in-progress": "LIVE",
  scheduled: "SCHEDULED",
  suspended: "SUSPENDED",
  completed: "COMPLETED",
};

export default function LiveMatchCard({ item, onPress }: Props) {
  const showLiveAccent = item.status === "in-progress";

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      {showLiveAccent && <View style={styles.liveAccent} />}
      <View style={styles.row}>
        <Text style={styles.title}>{item.tournament}</Text>
        <View style={[styles.badge, { backgroundColor: `${statusColor[item.status]}20` }]}>
          <Text style={[styles.badgeText, { color: statusColor[item.status] }]}>{statusLabel[item.status]}</Text>
        </View>
      </View>
      <Text style={styles.players}>
        {item.playerA.firstname} {item.playerA.lastname} vs {item.playerB.firstname} {item.playerB.lastname}
      </Text>
      <Text style={styles.meta}>{item.round} • {item.surface}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.86,
  },
  liveAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.live,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    ...typography.display,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...typography.bodyBold,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  players: {
    ...typography.bodyMedium,
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.body,
    marginTop: spacing.xs + 2,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});
