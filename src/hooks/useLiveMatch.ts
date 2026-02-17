import { useMutation, useQuery } from "@tanstack/react-query";
import { liveMatchApi } from "../services/liveMatch.api";
import { queryClient } from "@providers/query-client";
import type { LiveMatch } from "src/types";

const MATCHES_QUERY_KEY = ["Match"];
const LIVE_MATCH_QUERY_KEY = ["LiveMatch"];

export function useCreateLiveMatch() {
  return useMutation({
    mutationFn: (matchId: number) => liveMatchApi.createLiveMatch(matchId),
    onSuccess: () => {
      // Invalidate and refetch matches after creating a new one
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LIVE_MATCH_QUERY_KEY });
    },
  });
}

export function useLiveMatch(id?: number) {
  return useQuery<LiveMatch, Error>({
    retry: false,
    enabled: !!id,
    queryKey: ["liveMatch", id],
    queryFn: () => liveMatchApi.getLiveMatchById(String(id)),
  });
}
/* export function useGetMatches() {
  return useQuery<Match[], Error>({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: matchsApi.getMatchs,
  });
}

export function useMatchById(id: string) {
  return useQuery<Match, Error>({
    queryKey: ["match", id],
    queryFn: () => matchsApi.getmatchById(id),
  });
}} */

