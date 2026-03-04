import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ListRenderItemInfo } from "react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";

import LiveMatchCard from "../components/LiveMatchCard";
import { useLiveMatches } from "../hooks";
import { colors, spacing, typography } from "../theme";
import type { LiveSessionListItem, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "LiveMatches">;

export default function LiveMatchesScreen({ navigation }: Props) {
  const { data, isLoading, error } = useLiveMatches();

  const renderItem = ({ item }: ListRenderItemInfo<LiveSessionListItem>) => (
    <LiveMatchCard item={item} onPress={() => navigation.navigate("LiveMatch", { matchId: item.match_id })} />
  );

  if (isLoading) {
    return <View style={styles.center}><Text style={styles.infoText}>Loading live matches...</Text></View>;
  }

  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <FlatList<LiveSessionListItem>
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Live Matches</Text>
          <Text style={styles.subheading}>Follow ongoing sessions in real time</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.emptyText}>No live matches available</Text>}
    />
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
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  headerBlock: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  overline: {
    ...typography.bodyBold,
    fontSize: 11,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heading: {
    ...typography.display,
    fontSize: 30,
    color: colors.textPrimary,
  },
  subheading: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
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
  emptyText: {
    ...typography.body,
    marginTop: spacing.xl,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15,
  },
});
