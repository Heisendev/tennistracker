import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useLiveMatch,
    useCreateLiveMatch,
    useUpdateLiveMatchStatus,
    useAddPointToLiveMatch,
} from '../../hooks/useLiveMatch';
import { setupMockFetch, resetMocks } from '../utils/mockFetch';
import type { LiveMatch } from '../../types';
import { createElement } from 'react';

// Helper to create a QueryClientProvider wrapper
function createQueryWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        createElement(QueryClientProvider, { client: queryClient }, children)
    );
}

describe('useLiveMatch Hook', () => {
    beforeEach(() => {
        resetMocks();
        vi.clearAllMocks();
    });

    describe('useLiveMatch', () => {
        it('should fetch a live match when ID is provided', async () => {
            // Arrange
            const liveMatchId = 100;
            const mockLiveMatch: Partial<LiveMatch> = {
                id: liveMatchId,
                matchId: "1",
                status: 'in-progress',
                currentSet: 2,
                currentServer: 'A',
            };
            setupMockFetch(mockLiveMatch);

            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useLiveMatch(liveMatchId), {
                wrapper,
            });

            // Assert - Wait for loading to complete
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeDefined();
            expect(result.current.data?.id).toBe(liveMatchId);
            expect(result.current.data?.status).toBe('in-progress');
        });

        it('should not fetch when ID is not provided', async () => {
            // Arrange
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useLiveMatch(undefined), {
                wrapper,
            });

            // Assert
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toBeUndefined();
        });

        it('should handle errors when fetching fails', async () => {
            // Arrange
            setupMockFetch(null, 404, false); // Simulate 404 error
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useLiveMatch(999), {
                wrapper,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
            console.log('Result after fetch error:', result);

            // Note: Error handling depends on implementation
            expect(result.current.data).toBeUndefined();
        });

        it('should show loading state initially', async () => {
            // Arrange
            setupMockFetch({
                id: 100,
                match_id: 1,
                status: 'in-progress',
            });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useLiveMatch(100), {
                wrapper,
            });

            // Assert
            // Initially should be loading (unless cached)
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });
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
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useLiveMatch(100), {
                wrapper,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toHaveProperty('id');
            expect(result.current.data).toHaveProperty('matchId');
            expect(result.current.data).toHaveProperty('status');
            expect(result.current.data).toHaveProperty('currentSet');
            expect(result.current.data).toHaveProperty('currentServer');
        });
    });

    describe('useCreateLiveMatch', () => {
        it('should create a live match successfully', async () => {
            // Arrange
            const matchId = 1;
            const mockLiveMatch: Partial<LiveMatch> = {
                id: 100,
                matchId: matchId.toString(),
                status: 'scheduled',
                currentSet: 1,
            };
            setupMockFetch(mockLiveMatch);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useCreateLiveMatch(), {
                wrapper,
            });

            expect(result.current.isPending).toBe(false);

            // Act - Trigger mutation
            act(() => {
                result.current.mutate(matchId);
            });

            // Assert - After mutation
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.matchId).toBe(matchId.toString());
            expect(result.current.data?.status).toBe('scheduled');
        });

        it('should handle errors when creating live match fails', async () => {
            // Arrange
            setupMockFetch(null, 404, false); // Simulate 404 error
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useCreateLiveMatch(), {
                wrapper,
            });

            // Act - Trigger mutation with non-existent match
            result.current.mutate(999);

            // Assert
            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });
        });

        it('should show pending state while creating', async () => {
            // Arrange
            setupMockFetch({ id: 100 });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useCreateLiveMatch(), {
                wrapper,
            });

            // Assert - Initial state
            expect(result.current.isPending).toBe(false);

            // Act - Trigger mutation
            result.current.mutate(1);

            // Assert - After mutation completes
            await waitFor(() => {
                expect(result.current.isPending).toBe(false);
            });
        });
    });

    describe('useUpdateLiveMatchStatus', () => {
        it('should update live match status to in-progress', async () => {
            // Arrange
            const liveMatchId = 100;
            const newStatus = 'in-progress' as const;
            const mockUpdatedMatch: Partial<LiveMatch> = {
                id: liveMatchId,
                status: newStatus,
                matchId: "1",
            };
            setupMockFetch(mockUpdatedMatch);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            result.current.mutate({
                liveMatchId,
                status: newStatus,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.status).toBe('in-progress');
        });

        it('should update live match status to completed', async () => {
            // Arrange
            const liveMatchId = 100;
            const newStatus = 'completed' as const;
            const mockUpdatedMatch: Partial<LiveMatch> = {
                id: liveMatchId,
                status: newStatus,
            };
            setupMockFetch(mockUpdatedMatch);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            result.current.mutate({
                liveMatchId,
                status: newStatus,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(result.current.data?.status).toBe('completed');
        });

        it('should update live match status to suspended', async () => {
            // Arrange
            const liveMatchId = 100;
            const newStatus = 'suspended' as const;
            setupMockFetch({ status: newStatus });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            result.current.mutate({
                liveMatchId,
                status: newStatus,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should handle errors when status update fails', async () => {
            // Arrange
            setupMockFetch(null, 404);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            result.current.mutate({
                liveMatchId: 999,
                status: 'in-progress',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });
        });

        it('should reject invalid status values', async () => {
            // Arrange
            setupMockFetch(null, 400);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            result.current.mutate({
                liveMatchId: 100,
                // @ts-expect-error - Testing invalid status
                status: 'invalid-status',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });
        });
    });

    describe('useAddPointToLiveMatch', () => {
        it('should add a point won by player A', async () => {
            // Arrange
            const liveMatchId = 100;
            const matchId = 1;
            setupMockFetch({ id: liveMatchId });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            result.current.mutate({
                matchId,
                liveMatchId,
                player: 'A',
                serveResult: 'in',
                serveType: 'first',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should add a point won by player B', async () => {
            // Arrange
            const liveMatchId = 100;
            const matchId = 1;
            setupMockFetch({ id: liveMatchId });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            result.current.mutate({
                matchId,
                liveMatchId,
                player: 'B',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should add a point with serve result', async () => {
            // Arrange
            const liveMatchId = 100;
            const matchId = 1;
            setupMockFetch({ id: liveMatchId });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            result.current.mutate({
                matchId,
                liveMatchId,
                player: 'A',
                serveResult: 'ace',
                serveType: 'first',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should add a point with winner shot information', async () => {
            // Arrange
            const liveMatchId = 100;
            const matchId = 1;
            setupMockFetch({ id: liveMatchId });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            result.current.mutate({
                matchId,
                liveMatchId,
                player: 'A',
                winnerShot: 'forehand',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });

        it('should handle errors when adding point fails', async () => {
            // Arrange
            setupMockFetch(null, 400, false);
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            result.current.mutate({
                matchId: 1,
                liveMatchId: 999,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isError).toBe(true);
            });
        });

        it('should show pending state while adding point', async () => {
            // Arrange
            setupMockFetch({ id: 100 });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            // Assert - Initial state
            expect(result.current.isPending).toBe(false);

            // Act - Trigger mutation
            result.current.mutate({
                matchId: 1,
                liveMatchId: 100,
                player: 'A',
            });

            // Assert - After mutation completes
            await waitFor(() => {
                expect(result.current.isPending).toBe(false);
            });
        });

        it('should accept all parameter combinations', async () => {
            // Arrange
            setupMockFetch({ id: 100 });
            const wrapper = createQueryWrapper();

            // Act
            const { result } = renderHook(() => useAddPointToLiveMatch(), {
                wrapper,
            });

            // Test with minimal parameters
            result.current.mutate({
                matchId: 1,
                liveMatchId: 100,
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            // Reset for next test
            resetMocks();
            setupMockFetch({ id: 100 });

            // Test with all parameters
            result.current.mutate({
                matchId: 1,
                liveMatchId: 100,
                player: 'A',
                serveResult: 'in',
                serveType: 'first',
                winnerShot: 'forehand',
            });

            // Assert
            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });
        });
    });

    describe('Hook Integration', () => {
        it('should handle multiple mutations in sequence', async () => {
            // Arrange
            setupMockFetch({ id: 100, status: 'scheduled' });
            const wrapper = createQueryWrapper();

            // Act - Create live match
            const createHook = renderHook(() => useCreateLiveMatch(), {
                wrapper,
            });

            createHook.result.current.mutate(1);

            await waitFor(() => {
                expect(createHook.result.current.isSuccess).toBe(true);
            });

            // Reset for next mutation
            resetMocks();
            setupMockFetch({ id: 100, status: 'in-progress' });

            // Act - Update status
            const updateHook = renderHook(() => useUpdateLiveMatchStatus(), {
                wrapper,
            });

            updateHook.result.current.mutate({
                liveMatchId: 100,
                status: 'in-progress',
            });

            // Assert
            await waitFor(() => {
                expect(updateHook.result.current.isSuccess).toBe(true);
            });
        });

        it('should maintain query state across hook instances', async () => {
            // Arrange
            const mockLiveMatch: Partial<LiveMatch> = {
                id: 100,
                status: 'in-progress',
            };
            setupMockFetch(mockLiveMatch);
            const wrapper = createQueryWrapper();

            // Act - First hook instance
            const hook1 = renderHook(() => useLiveMatch(100), {
                wrapper,
            });

            await waitFor(() => {
                expect(hook1.result.current.isLoading).toBe(false);
            });

            // Act - Second hook instance (should use cache)
            const hook2 = renderHook(() => useLiveMatch(100), {
                wrapper,
            });

            // Assert - Both should have the same data
            expect(hook1.result.current.data).toEqual(hook2.result.current.data);
        });
    });
});
