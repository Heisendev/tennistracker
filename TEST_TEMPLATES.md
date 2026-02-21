# Test Writing Guide - TennisTracker

A practical guide with copy-paste templates for writing tests in TennisTracker.

---

## Template 1: API Service Test

Use this template when testing a fetch-based API service.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { yourApi } from '../../services/your.api';
import { setupMockFetch, setupMockFetchError, resetMocks } from '../utils/mockFetch';

describe('Your API Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('functionName', () => {
    it('should do the thing successfully', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' };
      setupMockFetch(mockData);

      // Act
      const response = await fetch('http://localhost:3003/endpoint');
      const data = await response.json();

      // Assert
      expect(data).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      setupMockFetchError('Server error', 500);

      // Act
      const response = await fetch('http://localhost:3003/endpoint');

      // Assert
      expect(response.status).toBe(500);
    });
  });
});
```

---

## Template 2: Query Hook Test

Use this for testing hooks that use `useQuery` (read-only operations).

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useYourHook } from '../../hooks/useYourHook';
import { setupMockFetch, resetMocks } from '../utils/mockFetch';

// Helper to create wrapper
function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useYourHook', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should fetch data successfully', async () => {
    // Arrange
    const mockData = { id: 1, name: 'Test' };
    setupMockFetch(mockData);
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourHook(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle loading state', async () => {
    // Arrange
    setupMockFetch({ id: 1 });
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourHook(), { wrapper });

    // Assert - Initially show something about loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle errors', async () => {
    // Arrange
    setupMockFetchError('Error message', 500);
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourHook(), { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.isError).toBe(true);
  });
});
```

---

## Template 3: Mutation Hook Test

Use this for hooks that use `useMutation` (write operations like POST/PUT).

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useYourMutation } from '../../hooks/useYourHook';
import { setupMockFetch, setupMockFetchError, resetMocks } from '../utils/mockFetch';

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useYourMutation', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should create/update successfully', async () => {
    // Arrange
    const input = { name: 'Test' };
    const mockResponse = { id: 1, ...input };
    setupMockFetch(mockResponse);
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourMutation(), { wrapper });
    result.current.mutate(input);

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should show pending state', async () => {
    // Arrange
    setupMockFetch({ id: 1 });
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourMutation(), { wrapper });
    
    // Assert initial state
    expect(result.current.isPending).toBe(false);

    // Act - trigger mutation
    result.current.mutate({ name: 'Test' });

    // Assert final state
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle errors', async () => {
    // Arrange
    setupMockFetchError('Validation error', 400);
    const wrapper = createQueryWrapper();

    // Act
    const { result } = renderHook(() => useYourMutation(), { wrapper });
    result.current.mutate({ name: '' }); // Invalid input

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

---

## Template 4: Component Test

Use this when testing React components that interface with hooks.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { YourComponent } from '../../components/YourComponent';
import { setupMockFetch, resetMocks } from '../utils/mockFetch';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('YourComponent', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should render component', async () => {
    // Arrange
    setupMockFetch({ id: 1, name: 'Test' });
    const Wrapper = createWrapper();

    // Act
    render(<YourComponent />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user click', async () => {
    // Arrange
    setupMockFetch({ id: 1 });
    const Wrapper = createWrapper();

    // Act
    render(<YourComponent />, { wrapper: Wrapper });
    const button = screen.getByRole('button', { name: /click/i });
    fireEvent.click(button);

    // Assert
    expect(screen.getByText(/response/i)).toBeInTheDocument();
  });
});
```

---

## Template 5: Multiple Test Scenarios

Use this structure for comprehensive test coverage.

```typescript
describe('Feature Name', () => {
  describe('Success Cases', () => {
    it('should handle basic success', async () => {
      // ...
    });

    it('should handle success with edge case', async () => {
      // ...
    });
  });

  describe('Error Cases', () => {
    it('should handle 404 not found', async () => {
      // ...
    });

    it('should handle 500 server error', async () => {
      // ...
    });

    it('should handle validation errors', async () => {
      // ...
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', async () => {
      // ...
    });

    it('should handle large datasets', async () => {
      // ...
    });

    it('should handle rapid requests', async () => {
      // ...
    });
  });
});
```

---

## Common Test Patterns

### Testing with IDs/Parameters

```typescript
it('should fetch item with specific ID', async () => {
  // Arrange
  const itemId = '123';
  setupMockFetch({ id: 123, name: 'Item' });

  // Act
  const response = await fetch(`http://localhost:3003/items/${itemId}`);
  const data = await response.json();

  // Assert
  expect(data.id).toBe(123);
});
```

### Testing Array Responses

```typescript
it('should return array of items', async () => {
  // Arrange
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];
  setupMockFetch(items);

  // Act
  const response = await fetch('http://localhost:3003/items');
  const data = await response.json();

  // Assert
  expect(Array.isArray(data)).toBe(true);
  expect(data).toHaveLength(2);
  expect(data[0].name).toBe('Item 1');
});
```

### Testing with POST Body

```typescript
it('should create item with POST', async () => {
  // Arrange
  const newItem = { name: 'New Item' };
  const created = { id: 1, ...newItem };
  setupMockFetch(created);

  // Act
  const response = await fetch('http://localhost:3003/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  const data = await response.json();

  // Assert
  expect(data.id).toBeDefined();
  expect(data.name).toBe('New Item');
});
```

### Testing Async State Changes

```typescript
it('should update state after async operation', async () => {
  // Arrange
  setupMockFetch({ status: 'active' });
  const wrapper = createQueryWrapper();

  // Act
  const { result } = renderHook(() => useYourHook(), { wrapper });

  // Assert - wait for state change
  await waitFor(() => {
    expect(result.current.data?.status).toBe('active');
  });
});
```

### Testing Multiple Calls

```typescript
it('should handle sequential operations', async () => {
  // Arrange
  setupMockFetch({ id: 1 });
  const wrapper = createQueryWrapper();

  // Act - First operation
  const { result: result1 } = renderHook(() => useHook1(), { wrapper });
  await waitFor(() => expect(result1.current.isLoading).toBe(false));

  // Act - Second operation (reset mock for new data)
  resetMocks();
  setupMockFetch({ id: 2 });
  const { result: result2 } = renderHook(() => useHook2(), { wrapper });
  await waitFor(() => expect(result2.current.isLoading).toBe(false));

  // Assert
  expect(result1.current.data?.id).toBe(1);
  expect(result2.current.data?.id).toBe(2);
});
```

---

## Tips & Tricks

### Avoid Common Mistakes

```typescript
// ❌ DON'T: Forget resetMocks()
beforeEach(() => {
  // Missing resetMocks()
});

// ✅ DO: Always reset mocks
beforeEach(() => {
  resetMocks();
});

// ❌ DON'T: Forget await waitFor()
it('should fetch data', async () => {
  const { result } = renderHook(() => useData());
  expect(result.current.data).toBeDefined(); // Might not be loaded yet!
});

// ✅ DO: Wait for async operations
it('should fetch data', async () => {
  const { result } = renderHook(() => useData());
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});

// ❌ DON'T: Test implementation details
expect(setStateMock).toHaveBeenCalled();

// ✅ DO: Test user-visible behavior
expect(screen.getByText('Success')).toBeInTheDocument();
```

### Debugging Tests

```typescript
it('should debug test', async () => {
  // Add console logs
  const { result } = renderHook(() => useHook());
  console.log('Result:', result.current);

  // Or use screen debug
  const { debug } = render(<Component />);
  debug();
});
```

---

## Quick Reference

### Mock Functions
- `setupMockFetch(data)` - Mock successful response
- `setupMockFetchError(message)` - Mock error response
- `resetMocks()` - Clear all mocks

### Hook Testing
- `renderHook(() => useHook())` - Render hook
- `waitFor(() => condition)` - Wait for async operations
- `result.current` - Access hook value

### Component Testing
- `render(<Component />)` - Render component
- `screen.getByText()` - Find by text content
- `fireEvent.click()` - Simulate clicks
- `screen.debug()` - Print component HTML

### TanStack Query States
- `isLoading` - Initial load in progress
- `isError` - Error occurred
- `isSuccess` - Data loaded successfully
- `isPending` - Mutation in progress
- `data` - The returned data

---

## Need Help?

- Check [TESTING.md](./TESTING.md) for complete testing guide
- Look at existing test files for examples
- Use `npm run test -- --grep "pattern"` to run specific tests
- Use `npm run test:ui` for visual test runner

**Happy testing! 🧪**
