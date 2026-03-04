import type { LiveMatchDetail, LiveSessionListItem } from "./types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3003";
const WS_BASE = process.env.EXPO_PUBLIC_WS_URL || API_URL;

export const getLiveMatches = async (): Promise<LiveSessionListItem[]> => {
  const response = await fetch(`${API_URL}/live-scoring/sessions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch live matches: ${response.statusText}`);
  }
  return response.json();
};

export const getLiveMatchById = async (matchId: number): Promise<LiveMatchDetail> => {
  const response = await fetch(`${API_URL}/live-scoring/sessions/${matchId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch live match: ${response.statusText}`);
  }
  return response.json();
};

export const buildWsUrl = (matchId: number) => {
  const url = new URL(WS_BASE);
  const secure = url.protocol === "https:" || url.protocol === "wss:";
  url.protocol = secure ? "wss:" : "ws:";
  url.pathname = "/live-updates";
  url.search = `?matchId=${matchId}`;
  return url.toString();
};
