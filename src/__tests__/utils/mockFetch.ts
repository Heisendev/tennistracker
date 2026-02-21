import { vi } from 'vitest';

/**
 * Mock fetch response helper
 * @param data - Data to return from mocked fetch
 * @param options - Response options (status, ok)
 */
export const mockFetchResponse = (
  data: unknown,
  options: { status?: number; ok?: boolean } = {}
) => {
  console.log('Mocking fetch response with data:', data, 'and options:', options);
  const { status = 200, ok = true } = options;
  console.log('Mock fetch response status:', status, 'ok:', ok);
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
};

/**
 * Setup mock fetch for successful response
 */
export const setupMockFetch = (data: unknown, status: number = 200, ok: boolean = true) => {
  console.log('Setting up mock fetch with data:', data, 'and status:', status, 'ok:', ok);
  globalThis.fetch = vi.fn(() => mockFetchResponse(data, { status, ok }));
};

/**
 * Setup mock fetch for error response
 */
export const setupMockFetchError = (errorMessage: string, status: number = 500, ok: boolean = false) => {
  globalThis.fetch = vi.fn(() => mockFetchResponse({ error: errorMessage }, { status, ok }));
};

/**
 * Setup mock fetch that rejects
 */
export const setupMockFetchReject = (error: Error) => {
  globalThis.fetch = vi.fn(() => Promise.reject(error));
};

/**
 * Reset all mocks
 */
export const resetMocks = () => {
  vi.clearAllMocks();
};
