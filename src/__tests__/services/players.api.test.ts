import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupMockFetch, setupMockFetchError, resetMocks } from '../utils/mockFetch';
import type { NewPlayer, Player } from '../../types';

// Mock the API_URL
const TEST_API_URL = 'http://localhost:3003';

/**
 * Example test suite for Players API Service
 * This demonstrates how to test API services with Vitest
 */
describe('Players API Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('fetchPlayers', () => {
    it('should fetch all players successfully', async () => {
      // Arrange
      const mockPlayers: Player[] = [
        {
          id: 1,
          firstname: 'Carlos',
          lastname: 'Alcaraz',
          country: 'ES',
          hand: 'Right',
          backhand: 'Two-handed',
          rank: 1,
        },
        {
          id: 2,
          firstname: 'Jannik',
          lastname: 'Sinner',
          country: 'IT',
          hand: 'Right',
          backhand: 'Two-handed',
          rank: 2,
        },
      ];

      setupMockFetch(mockPlayers);

      // Act
      const response = await fetch(`${TEST_API_URL}/players`);
      const data = await response.json();

      // Assert
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(data).toEqual(mockPlayers);
      expect(data).toHaveLength(2);
      expect(data[0].firstname).toBe('Carlos');
    });

    it('should handle empty players list', async () => {
      // Arrange
      setupMockFetch([]);

      // Act
      const response = await fetch(`${TEST_API_URL}/players`);
      const data = await response.json();

      // Assert
      expect(data).toEqual([]);
      expect(data).toHaveLength(0);
    });

    it('should handle fetch errors', async () => {
      // Arrange
      setupMockFetchError('Server error');

      // Act
      const response = await fetch(`${TEST_API_URL}/players`);
      const data = await response.json();

      // Assert
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(data.error).toBe('Server error');
    });
  });

  describe('createPlayer', () => {
    it('should create a new player', async () => {
      // Arrange
      const newPlayer: NewPlayer = {
        firstname: 'Rafael',
        lastname: 'Nadal',
        country: 'ES',
        hand: "Right",
        backhand: "Two-handed",
      };

      const createdPlayer: Player = {
        id: 3,
        ...newPlayer,
      };

      setupMockFetch(createdPlayer);

      // Act
      const response = await fetch(`${TEST_API_URL}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      });
      const data = await response.json();

      // Assert
      expect(response.ok).toBe(true);
      expect(data.id).toBe(3);
      expect(data.firstname).toBe('Rafael');
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        `${TEST_API_URL}/players`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  describe('getPlayerById', () => {
    it('should fetch player by ID', async () => {
      // Arrange
      const mockPlayer: Player = {
        id: 1,
        firstname: 'Carlos',
        lastname: 'Alcaraz',
        country: 'ES',
        hand: 'Right',
        backhand: 'Two-handed',
      };

      setupMockFetch(mockPlayer);

      // Act
      const response = await fetch(`${TEST_API_URL}/players/1`);
      const data = await response.json();

      // Assert
      expect(response.ok).toBe(true);
      expect(data.id).toBe(1);
      expect(data.firstname).toBe('Carlos');
    });

    it('should handle player not found', async () => {
      // Arrange
      setupMockFetchError('Player not found');

      // Act
      const response = await fetch(`${TEST_API_URL}/players/999`);
      const data = await response.json();

      // Assert
      expect(response.ok).toBe(false);
      expect(data.error).toBe('Player not found');
    });
  });
});
