import { useEffect, useState } from "react";

import { buildWsUrl, getLiveMatchById, getLiveMatches } from "./api";
import type { LiveMatchDetail, LiveSessionListItem } from "./types";

export function useLiveMatches() {
  const [data, setData] = useState<LiveSessionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getLiveMatches()
      .then((matches) => {
        if (isMounted) {
          setData(matches);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (isMounted) {
          setError(e.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function useLiveMatch(matchId: number) {
  const [data, setData] = useState<LiveMatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let socket: WebSocket | undefined;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    const loadInitial = async () => {
      try {
        const match = await getLiveMatchById(matchId);
        if (isMounted) {
          setData(match);
          setError(null);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Failed to load match");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const connect = () => {
      socket = new WebSocket(buildWsUrl(matchId));
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type === "live-match-update" && Number(payload.matchId) === matchId) {
            setData(payload.data as LiveMatchDetail);
          }
        } catch (error) {
          console.warn("Failed to parse websocket payload", error);
        }
      };

      socket.onclose = () => {
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    loadInitial();
    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [matchId]);

  return { data, isLoading, error };
}
