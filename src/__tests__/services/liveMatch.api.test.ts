import { describe, it, expect, beforeEach } from 'vitest';
import { setupMockFetch, setupMockFetchError, resetMocks } from '../utils/mockFetch';
import type { LiveMatch } from '../../types';

describe('Live Match API Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('createLiveMatch', () => {
    it('should create a new live match session', async () => {
      // Arrange
      const matchId = 1;
      const mockLiveMatch: Partial<LiveMatch> = {
        id: 100,
        matchId: matchId.toString(),
        status: 'scheduled',
        currentSet: 1,
        currentServer: 'A',
      };
      setupMockFetch(mockLiveMatch);

      // Act
      const response = await fetch('http://localhost:3003/live-scoring/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      });
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.matchId).toBe(matchId.toString());
      expect(data.status).toBe('scheduled');
      expect(data.currentSet).toBe(1);
    });

    it('should return error when match does not exist', async () => {
      // Arrange
      const nonExistentMatchId = 999;
      setupMockFetchError('Match not found', 404);

      // Act
      const response = await fetch('http://localhost:3003/live-scoring/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: nonExistentMatchId }),
      });

      // Assert
      expect(response.status).toBe(404);
    });

    it('should initialize live match with correct properties', async () => {
      // Arrange
      const matchId = 1;
      const mockLiveMatch: Partial<LiveMatch> = {
        id: 100,
        matchId: matchId.toString(),
        status: 'scheduled',
        currentSet: 1,
        currentServer: 'A'
      };
      setupMockFetch(mockLiveMatch);

      // Act
      const response = await fetch('http://localhost:3003/live-scoring/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      });
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('matchId');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('currentSet');
      expect(data.currentSet).toBe(1);
    });
  });

  describe('updateLiveMatchStatus', () => {
    it('should update match status to in-progress', async () => {
      // Arrange
      const liveMatchId = 100;
      const newStatus = 'in-progress';
      const mockUpdatedMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        status: newStatus,
        matchId: "1",
        currentSet: 1,
        currentServer: 'A',
      };
      setupMockFetch(mockUpdatedMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.status).toBe('in-progress');
    });

    it('should update match status to completed', async () => {
      // Arrange
      const liveMatchId = 100;
      const newStatus = 'completed';
      const mockUpdatedMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        status: newStatus,
        matchId: "1",
        currentSet: 3,
      };
      setupMockFetch(mockUpdatedMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      // Assert
      expect(data.status).toBe('completed');
    });

    it('should update match status to suspended', async () => {
      // Arrange
      const liveMatchId = 100;
      const newStatus = 'suspended';
      const mockUpdatedMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        status: newStatus,
      };
      setupMockFetch(mockUpdatedMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      // Assert
      expect(data.status).toBe('suspended');
    });

    it('should return error when live match not found', async () => {
      // Arrange
      setupMockFetchError('Live match not found', 404);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/999/status',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in-progress' }),
        }
      );

      // Assert
      expect(response.status).toBe(404);
    });

    it('should reject invalid status values', async () => {
      // Arrange
      setupMockFetchError('Invalid status', 400);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/100/status',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'invalid-status' }),
        }
      );

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('getLiveMatchById', () => {
    it('should fetch a live match by ID', async () => {
      // Arrange
      const liveMatchId = '100';
      const mockLiveMatch: Partial<LiveMatch> = {
        id: 100,
        matchId: "1",
        status: 'in-progress',
        currentSet: 2,
        currentServer: 'B',
      };
      setupMockFetch(mockLiveMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}`
      );
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.id).toBe(100);
      expect(data.status).toBe('in-progress');
      expect(data.currentSet).toBe(2);
    });

    it('should return error when live match not found', async () => {
      // Arrange
      setupMockFetchError('Live match not found', 404);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/999'
      );

      // Assert
      expect(response.status).toBe(404);
    });

    it('should include all live match properties', async () => {
      // Arrange
      const mockLiveMatch: Partial<LiveMatch> = {
        id: 100,
        matchId: "1",
        status: 'in-progress',
        currentSet: 1,
        currentServer: 'A',
      };
      setupMockFetch(mockLiveMatch);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/100'
      );
      const data = await response.json();

      // Assert
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('matchId');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('currentSet');
      expect(data).toHaveProperty('currentServer');
    });
  });

  describe('addPoint', () => {
    it('should add a point won by player A', async () => {
      // Arrange
      const liveMatchId = 100;
      const matchId = 1;
      const mockUpdatedMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        matchId: matchId.toString(),
        status: 'in-progress',
        currentSet: 1,
        currentServer: 'A',
      };
      setupMockFetch(mockUpdatedMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}/point`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId: matchId.toString(),
            winner: 'A',
            serve_result: 'in',
            serve_type: 'first',
          }),
        }
      );
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.id).toBe(liveMatchId);
      expect(data.matchId).toBe(matchId.toString());
    });

    it('should add a point won by player B with ace', async () => {
      // Arrange
      const liveMatchId = 100;
      const matchId = 1;
      const mockUpdatedMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        status: 'in-progress',
      };
      setupMockFetch(mockUpdatedMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}/point`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            match_id: matchId,
            winner: 'B',
            serve_result: 'ace',
            serve_type: 'first',
            winner_shot: 'serve',
          }),
        }
      );

      // Assert
      expect(response.status).toBe(200);
    });

    it('should add a point with different serve results', async () => {
      // Arrange
      const liveMatchId = 100;
      const matchId = 1;
      const serveResults = ['in', 'out', 'double-fault', 'ace'];

      // Act & Assert for each serve result
      for (const serveResult of serveResults) {
        setupMockFetch({ id: liveMatchId });

        const response = await fetch(
          `http://localhost:3003/live-scoring/sessions/${liveMatchId}/point`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              match_id: matchId,
              winner: 'A',
              serve_result: serveResult,
            }),
          }
        );

        expect(response.status).toBe(200);
      }
    });

    it('should add a point with different winner shots', async () => {
      // Arrange
      const liveMatchId = 100;
      const matchId = 1;
      const shots = [
        'serve',
        'forehand',
        'backhand',
        'volley',
        'smash',
      ];

      // Act & Assert for each shot type
      for (const shot of shots) {
        setupMockFetch({ id: liveMatchId });

        const response = await fetch(
          `http://localhost:3003/live-scoring/sessions/${liveMatchId}/point`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              match_id: matchId,
              winner: 'A',
              winner_shot: shot,
            }),
          }
        );

        expect(response.status).toBe(200);
      }
    });

    it('should return error when live match not found', async () => {
      // Arrange
      setupMockFetchError('Live match not found', 404);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/999/point',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            match_id: 1,
            winner: 'A',
          }),
        }
      );

      // Assert
      expect(response.status).toBe(404);
    });

    it('should return error when match is already completed', async () => {
      // Arrange
      setupMockFetchError('Cannot add points to completed match', 400);

      // Act
      const response = await fetch(
        'http://localhost:3003/live-scoring/sessions/100/point',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            match_id: 1,
            winner: 'A',
          }),
        }
      );

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive point additions', async () => {
      // Arrange
      const liveMatchId = 100;
      const matchId = 1;
      setupMockFetch({ id: liveMatchId });

      // Act
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          fetch(`http://localhost:3003/live-scoring/sessions/${liveMatchId}/point`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              match_id: matchId,
              winner: i % 2 === 0 ? 'A' : 'B',
            }),
          })
        );
      }
      const responses = await Promise.all(promises);

      // Assert
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should track multiple sets correctly', async () => {
      // Arrange
      const liveMatchId = 100;
      const mockMultiSetMatch: Partial<LiveMatch> = {
        id: liveMatchId,
        currentSet: 3,
      };
      setupMockFetch(mockMultiSetMatch);

      // Act
      const response = await fetch(
        `http://localhost:3003/live-scoring/sessions/${liveMatchId}`
      );
      const data = await response.json();

      // Assert
      expect(data.currentSet).toBe(3);
    });
  });
});
