import type { NewPlayer, Player } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export interface PlayersApi {
  getPlayers: () => Promise<Player[]>;
  getPlayerById: (id: string) => Promise<Player>;
  createPlayer: (player: NewPlayer) => Promise<Player>;
}

export const playersApi: PlayersApi = {
  getPlayers: async (): Promise<Player[]> => {
    // Simulate an API call with a delay
    const response = await fetch(`${API_URL}/players`);
    const data = await response.json();
    return data;
  },
  getPlayerById: async (id: string): Promise<Player> => {
    // Simulate fetching a player by ID
    const response = await fetch(`${API_URL}/players/${id}`);
    if (!response.ok) {
            throw new Error(`Failed to fetch player: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
  createPlayer: async (newPlayer: NewPlayer): Promise<Player> => {
    // Simulate creating a new player
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });
    if (!response.ok) {
            throw new Error(`Failed to create player: ${response.statusText}`);
        }
    const data = await response.json();
    return data;
  },
};
