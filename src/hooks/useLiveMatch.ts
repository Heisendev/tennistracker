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

export function updateLiveMatchStatus() {
    return useMutation({
        mutationFn: ({liveMatchId, status}: {liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended"}) => liveMatchApi.updateLiveMatchStatus(liveMatchId, status),
        onSuccess: (data) => {
            console.log('Live match status updated successfully, refetching match data');
            // Invalidate the specific liveMatch query with the correct ID to trigger refetch
            queryClient.invalidateQueries({
                queryKey: ["liveMatch", data.matchId]
            });
        },
        onError: (error) => {
            console.error('Error updating live match status:', error);
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
        mutationFn: ({ matchId, liveMatchId, player, serveResult, serveType, winnerShot }: { matchId: number; liveMatchId: number; player?: 'A' | 'B'; serveResult?: string; serveType?: string; winnerShot?: string }) => liveMatchApi.addPoint(liveMatchId, player, serveResult, serveType, winnerShot ),
        onSuccess: (data, variables) => {
            console.log('Point added successfully, refetching match data:', variables);
            // Invalidate the specific liveMatch query with the correct ID to trigger refetch
            queryClient.invalidateQueries({
                queryKey: ["liveMatch", variables.matchId]
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

