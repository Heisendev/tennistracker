import { useMutation, useQuery } from "@tanstack/react-query";
import { playersApi } from "../services/players.api";
import type { Player, NewPlayer } from "../types";
import { queryClient } from "@providers/query-client";
const PLAYERS_QUERY_KEY = ["players"];

export function usePlayers() {
  return useQuery<Player[], Error>({
    queryKey: PLAYERS_QUERY_KEY,
    queryFn: playersApi.getPlayers,
  });
}

export function usePlayerById(id: string) {
  return useQuery<Player, Error>({
    queryKey: ["players", id],
    queryFn: () => playersApi.getPlayerById(id),
  });
}

export function useCreatePlayer() {
  return useMutation({
    mutationFn: (newPlayer: NewPlayer) => playersApi.createPlayer(newPlayer),
    onSuccess: () => {
      // Invalidate and refetch players after creating a new one
      queryClient.invalidateQueries({ queryKey: PLAYERS_QUERY_KEY });
    },
  });
}
