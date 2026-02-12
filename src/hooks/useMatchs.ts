import { useQuery } from "@tanstack/react-query";
import { matchsApi } from "../services/matchs.api";
import type { MatchData } from "../types";

const MATCHES_QUERY_KEY = ['matches'];

export function useMatches() {
    return useQuery<MatchData[], Error>({
        queryKey: MATCHES_QUERY_KEY,
        queryFn: matchsApi.getMatchs,
    })
}
