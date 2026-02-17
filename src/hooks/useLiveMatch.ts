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

export function addPointToLiveMatch() {
  return useMutation({
    mutationFn: ({ liveMatchId, player }: { liveMatchId: number; player: 'A' | 'B' }) => liveMatchApi.addPoint(liveMatchId, player),
    onSuccess: (data, variables) => {
      console.log('Point added successfully, refetching match data:', variables.liveMatchId);
      // Invalidate the specific liveMatch query with the correct ID to trigger refetch
      queryClient.invalidateQueries({ 
        queryKey: ["liveMatch", variables.liveMatchId] 
      });
    },
    onError: (error) => {
      console.error('Error adding point:', error);
    },
  });
}

/* export function useGetMatches() {
  return useQuery<Match[], Error>({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: matchsApi.getMatchs,
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

