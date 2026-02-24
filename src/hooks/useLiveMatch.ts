import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@providers/query-client";
import type { LiveMatch } from "src/types";

import { liveMatchApi } from "../services/liveMatch.api";


export function useCreateLiveMatch() {
    return useMutation({
        mutationFn: (matchId: number) => liveMatchApi.createLiveMatch(matchId),
        onSuccess: (_data, matchId) => {
            queryClient.invalidateQueries({ queryKey: ["liveMatch", matchId] });
        },
        onError: (error) => {
            console.error('Error creating live match:', error);
        },
    });
}

export function useUpdateLiveMatchStatus() {
    return useMutation({
        mutationFn: ({liveMatchId, status}: {liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended"}) => liveMatchApi.updateLiveMatchStatus(liveMatchId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveMatch"] });
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

export function useAddPointToLiveMatch() {
    return useMutation({
        mutationFn: ({ matchId, liveMatchId, player, serveResult, serveType, winnerShot }: { matchId: number; liveMatchId: number; player?: 'A' | 'B'; serveResult?: string; serveType?: string; winnerShot?: string }) => liveMatchApi.addPoint(matchId, liveMatchId, player, serveResult, serveType, winnerShot ),
        onSuccess: (variables) => {
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
