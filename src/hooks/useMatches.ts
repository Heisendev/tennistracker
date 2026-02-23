import { useMutation, useQuery } from "@tanstack/react-query";
import { matchesApi } from "../services/matches.api";
import type { Match, NewMatch } from "../types";
import { queryClient } from "@providers/query-client";

const MATCHES_QUERY_KEY = ["matches"];

export function useGetMatches() {
  return useQuery<Match[], Error>({
    queryKey: MATCHES_QUERY_KEY,
    queryFn: matchesApi.getMatches,
  });
}

export function useMatchById(id: string) {
  return useQuery<Match, Error>({
    queryKey: ["match", id],
    queryFn: () => matchesApi.getMatchById(id),
  });
}

export function useCreateMatch() {
  return useMutation({
    mutationFn: (newMatch: NewMatch) => matchesApi.createMatch(newMatch),
    onSuccess: () => {
      // Invalidate and refetch matches after creating a new one
      queryClient.invalidateQueries({ queryKey: MATCHES_QUERY_KEY });
    },
  });
}