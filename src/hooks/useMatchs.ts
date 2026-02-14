import { useMutation, useQuery } from "@tanstack/react-query";
import { matchsApi } from "../services/matchs.api";
import type { MatchData } from "../types";
import { queryClient } from "@providers/query-client";

const MATCHES_QUERY_KEY = ['matches'];

export function useMatches() {
    return useQuery<MatchData[], Error>({
        queryKey: MATCHES_QUERY_KEY,
        queryFn: matchsApi.getMatchs,
    })
}

export function useMatchById(id: string) {
    return useQuery<MatchData, Error>({
        queryKey: ['match', id],
        queryFn: () => matchsApi.getmatchById(id),
    })
}

export function useCreateMatch() {
    return useMutation({
        mutationFn: (newMatch: MatchData) => matchsApi.createMatch(newMatch),
        onSuccess: () => {
            // Invalidate and refetch matches after creating a new one
            queryClient.invalidateQueries({queryKey: MATCHES_QUERY_KEY});
        },
    });
}