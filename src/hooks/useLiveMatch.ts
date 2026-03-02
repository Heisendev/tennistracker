import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryClient } from "@providers/query-client";
import type { LiveMatch } from "src/types";

import { liveMatchApi } from "../services/liveMatch.api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";
const WS_URL = API_URL.replace(/^http/, "ws");

function useLiveMatchSocket(matchId?: number) {
    useEffect(() => {
        if (!matchId) {
            return;
        }

        let socket: WebSocket | undefined;
        let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
        let isActive = true;

        const connect = () => {
            socket = new WebSocket(`${WS_URL}/live-updates?matchId=${matchId}`);

            socket.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    if (payload?.type === "live-match-update" && Number(payload.matchId) === matchId) {
                        queryClient.setQueryData(["liveMatch", matchId], payload.data as LiveMatch);
                    }
                } catch (error) {
                    console.error("Invalid live match websocket payload", error);
                }
            };

            socket.onclose = () => {
                if (!isActive) {
                    return;
                }

                reconnectTimer = setTimeout(connect, 2000);
            };
        };

        connect();

        return () => {
            isActive = false;
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [matchId]);
}


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
        mutationFn: ({liveMatchId, status, tossWinner}: {liveMatchId: number, status: "scheduled" | "in-progress" | "completed" | "suspended", tossWinner?: "A" | "B" }) => liveMatchApi.updateLiveMatchStatus(liveMatchId, status, tossWinner),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["liveMatch"] });
        },
        onError: (error) => {
            console.error('Error updating live match status:', error);
        },
    });
}

export function useLiveMatch(id?: number) {
    useLiveMatchSocket(id);

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
        onSuccess: (_data, variables) => {
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
