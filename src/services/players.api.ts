import type { Player } from "../types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

export interface PlayersApi {
    getPlayers: () => Promise<Player[]>;
    getPlayerById: (id: string) => Promise<Player>;
    createPlayer: (player: Player) => Promise<Player>;
}

export const playersApi: PlayersApi = {
    getPlayers: async (): Promise<Player[]> => {
        // Simulate an API call with a delay
        const response = await fetch(`${API_URL}/players`);
        const data = await response.json();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 500); // Simulate 1 second delay
        });
    },
    getPlayerById: async (id: string): Promise<Player> => {
        // Simulate fetching a player by ID
        const response = await fetch(`${API_URL}/players/${id}`);
        const data = await response.json();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 500); // Simulate 1 second delay
        });
    },
    createPlayer: async (newPlayer: Player): Promise<Player> => {
        // Simulate creating a new player
        const response = await fetch(`${API_URL}/players`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlayer),
        });
        const data = await response.json();
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 500); // Simulate 1 second delay
        });
    },
};