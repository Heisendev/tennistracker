import { describe, it, expect, beforeEach } from 'vitest';
import { setupMockFetch, setupMockFetchError, resetMocks } from '../utils/mockFetch';
import type { Match, NewMatch } from '../../types';

describe('Matchs API Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('getMatchs', () => {
    it('should fetch all matches successfully', async () => {
      // Arrange
      const mockMatches: Match[] = [
        {
          id: 1,
          tournament: 'Wimbledon',
          surface: 'Grass',
          format: 0,
          date: '2024-06-01',
          tossWinner: 'A',
          winner: 'A',
          playerA: {
            id: 1,
            firstname: 'Novak',
            lastname: 'Djokovic',
            country: 'Serbia',
          },
          playerB: {
            id: 2,
            firstname: 'Rafael',
            lastname: 'Nadal',
            country: 'Spain',
          }
        },
        {
          id: 2,
          tournament: 'Roland Garros',
          format: 0,
          playerA: {
            id: 1,
            firstname: 'Novak',
            lastname: 'Djokovic',
            country: 'Serbia',
          },
          playerB: {
            id: 2,
            firstname: 'Rafael',
            lastname: 'Nadal',
            country: 'Spain',
          },
          date: '2024-06-02',
          round: 'Final',
          surface: 'Clay',
          tossWinner: 'B',
          winner: 'B',
        },
      ];
      setupMockFetch(mockMatches);

      // Act
      const response = await fetch('http://localhost:3003/matchs');
      const data = await response.json();

      // Assert
      expect(data).toEqual(mockMatches);
      expect(data).toHaveLength(2);
      expect(data[0].tournament).toBe('Wimbledon');
    });

    it('should return empty array when no matches exist', async () => {
      // Arrange
      setupMockFetch([]);

      // Act
      const response = await fetch('http://localhost:3003/matchs');
      const data = await response.json();

      // Assert
      expect(data).toEqual([]);
      expect(Array.isArray(data)).toBe(true);
    });

    it('should handle fetch errors gracefully', async () => {
      // Arrange
      setupMockFetchError('Failed to fetch matches');

      // Act & Assert
      const response = await fetch('http://localhost:3003/matchs');
      expect(response.status).not.toBe(200);
    });

    it('should include all match properties', async () => {
      // Arrange
      const mockMatch: Match = {
        id: 5,
        tournament: 'US Open',
        surface: 'Hard',
        format: 0,
        playerA: {
          id: 1,
          firstname: 'Novak',
          lastname: 'Djokovic',
          country: 'Serbia',
        },
        playerB: {
          id: 2,
          firstname: 'Rafael',
          lastname: 'Nadal',
          country: 'Spain',
        },
        date: '2024-09-01',
        tossWinner: 'A',
        winner: 'B',
      };
      setupMockFetch([mockMatch]);

      // Act
      const response = await fetch('http://localhost:3003/matchs');
      const data = await response.json();

      // Assert
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('tournament');
      expect(data[0]).toHaveProperty('playerA');
      expect(data[0]).toHaveProperty('playerB');
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('winner');
    });
  });

  describe('getmatchById', () => {
    it('should fetch a match by ID', async () => {
      // Arrange
      const matchId = '1';
      const mockMatch: Match = {
        id: 1,
        tournament: 'Wimbledon',
        playerA: {
          id: 1,
          firstname: 'Novak',
          lastname: 'Djokovic',
          country: 'Serbia',
        },
        playerB: {
          id: 2,
          firstname: 'Rafael',
          lastname: 'Nadal',
          country: 'Spain',
        },
        surface: 'Grass',
        format: 0,
        date: '2024-06-01',
        tossWinner: 'A',
        winner: 'A',
      };
      setupMockFetch(mockMatch);

      // Act
      const response = await fetch(`http://localhost:3003/matchs/${matchId}`);
      const data = await response.json();

      // Assert
      expect(data).toEqual(mockMatch);
      expect(data.id).toBe(1);
      expect(data.tournament).toBe('Wimbledon');
    });

    it('should return 404 when match not found', async () => {
      // Arrange
      setupMockFetchError('Not Found', 404);

      // Act
      const response = await fetch('http://localhost:3003/matchs/999');

      // Assert
      expect(response.status).toBe(404);
    });

    it('should handle server errors', async () => {
      // Arrange
      setupMockFetchError('Server error', 500);

      // Act
      const response = await fetch('http://localhost:3003/matchs/1');

      // Assert
      expect(response.status).toBe(500);
    });
  });

  describe('createMatch', () => {
    it('should create a new match', async () => {
      // Arrange
      const newMatch: NewMatch = {
        tournament: 'Australian Open',
        playerA: "5",
        playerB: "6",
        date: '2024-01-20',
        surface: 'Hard',
        format: 0,
      };
      const createdMatch: Match = {
        tournament: 'Australian Open',
        playerA: {
          id: 5,
          firstname: 'Novak',
          lastname: 'Djokovic',
          country: 'Serbia',
        },
        playerB: {
          id: 6,
          firstname: 'Rafael',
          lastname: 'Nadal',
          country: 'Spain',
        },
        date: '2024-01-20',
        surface: 'Hard',
        format: 0,
        id: 100,
      };
      setupMockFetch(createdMatch);

      // Act
      const response = await fetch('http://localhost:3003/matchs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatch),
      });
      const data = await response.json();

      // Assert
      expect(data).toEqual(createdMatch);
      expect(data.id).toBe(100);
    });

    it('should return error when creating match with missing fields', async () => {
      // Arrange
      const invalidMatch = {
        tournament: 'Australian Open',
        // Missing playerA_id and playerB_id
      };
      setupMockFetchError('Missing required fields', 400);

      // Act
      const response = await fetch('http://localhost:3003/matchs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidMatch),
      });

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return error when players do not exist', async () => {
      // Arrange
      const newMatch: NewMatch = {
        tournament: 'Australian Open',
        playerA: "999", // Non-existent player
        playerB: "1000", // Non-existent player
        date: '2024-01-20',
        surface: 'Hard',
        format: 0,
      };
      setupMockFetchError('Player not found', 404);

      // Act
      const response = await fetch('http://localhost:3003/matchs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatch),
      });

      // Assert
      expect(response.status).toBe(404);
    });

    it('should include all required properties in response', async () => {
      // Arrange
      const newMatch: NewMatch = {
        tournament: 'Australian Open',
        playerA: "5",
        playerB: "6",
        date: '2024-01-20',
        surface: 'A',
        format: 0,
      };
      const createdMatch: Match = {
        ...newMatch,
        id: 100,
        playerA: {
          id: 1,
          firstname: 'Novak',
          lastname: 'Djokovic',
          country: 'Serbia',
        },
        playerB: {
          id: 2,
          firstname: 'Rafael',
          lastname: 'Nadal',
          country: 'Spain',
        },
      };
      setupMockFetch(createdMatch);

      // Act
      const response = await fetch('http://localhost:3003/matchs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatch),
      });
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('tournament');
      expect(data).toHaveProperty('playerA');
      expect(data).toHaveProperty('playerB');
    });
  });
});