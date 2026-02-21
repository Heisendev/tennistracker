# Testing Guide - TennisTracker

## Overview

TennisTracker uses **Vitest** for unit and integration testing. The testing strategy follows a priority-based approach focusing on high-impact, maintainable tests.

## 🎯 Testing Pyramid

```
        Components (Integration)
       /                      \
      /     Hooks (Logic)       \
     /                          \
    / Services (Pure Functions)  \
```

**Start with**: Services → Hooks → Components

## 📦 Setup

### Dependencies
- **vitest** - Fast unit testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM matchers
- **jsdom** - DOM environment for tests

### Configuration Files
- `vitest.config.ts` - Vitest configuration
- `src/__tests__/setup.ts` - Test setup and global configuration

## 🏃 Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 📁 Test Structure

```
src/__tests__/
├── setup.ts                          # Global test setup
├── utils/
│   └── mockFetch.ts                 # Fetch mocking utilities
├── services/
│   ├── players.api.test.ts         # Players API tests
│   ├── matchs.api.test.ts          # Matchs API tests
│   └── liveMatch.api.test.ts       # Live match API tests
├── hooks/
│   ├── usePlayers.test.ts          # usePlayers hook tests
│   ├── useMatchs.test.ts           # useMatchs hook tests
│   └── useLiveMatch.test.ts        # useLiveMatch hook tests
└── components/
    ├── MatchSummary.test.tsx       # Component tests (future)
    └── MatchStats.test.tsx         # Component tests (future)
```

## 🧪 Testing Patterns

### 1. Testing API Services (Top Priority)

Services are pure functions that call APIs. They're the easiest to test.

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setupMockFetch, resetMocks } from '../utils/mockFetch';

describe('Players API Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should fetch all players', async () => {
    // Arrange
    const mockPlayers = [
      { id: 1, firstname: 'Carlos', lastname: 'Alcaraz', country: 'ES' }
    ];
    setupMockFetch(mockPlayers);

    // Act
    const response = await fetch('/players');
    const data = await response.json();

    // Assert
    expect(data).toEqual(mockPlayers);
    expect(response.status).toBe(200);
  });
});
```

**Tips:**
- Use `setupMockFetch()` helper for common patterns
- Test success and error paths
- Test edge cases (empty lists, null values)
- Verify correct endpoints and HTTP methods

### 2. Testing Custom Hooks (Medium Priority)

Hooks are tested with React Testing Library and need a QueryClientProvider wrapper.

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMatchs } from '../../hooks/useMatchs';

const wrapper = createQueryWrapper(); // Helper from setup

describe('useMatchs Hook', () => {
  it('should fetch matches', async () => {
    setupMockFetch([
      { id: 1, tournament: 'Wimbledon', playerA_id: 1, playerB_id: 2 }
    ]);

    const { result } = renderHook(() => useMatchs(), { wrapper });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
  });
});
```

**Tips:**
- Use the `createQueryWrapper()` helper
- Test loading, success, and error states
- Use `waitFor()` for async operations
- Don't test React Query internals, test your logic

### 3. Testing Components (Lower Priority)

Components are integration tests - test user behavior, not implementation.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerHeader } from '../../components/PlayerHeader';

describe('PlayerHeader', () => {
  it('should display player information', () => {
    const player = {
      id: 1,
      firstname: 'Carlos',
      lastname: 'Alcaraz',
      country: 'ES'
    };

    render(<PlayerHeader player={player} winner={false} />);

    expect(screen.getByText('Carlos')).toBeInTheDocument();
    expect(screen.getByText('Alcaraz')).toBeInTheDocument();
  });
});
```

## 🛠️ Utility Functions

### Mock Fetch Helpers

Located in `src/__tests__/utils/mockFetch.ts`:

```typescript
// Mock successful response
setupMockFetch({ id: 1, name: 'Player' });

// Mock error response
setupMockFetchError('Server error');

// Mock rejected promise
setupMockFetchReject(new Error('Network error'));

// Clear all mocks
resetMocks();
```

## ✅ Testing Checklist

When writing tests:

- [ ] Tests are isolated (no side effects)
- [ ] Use descriptive test names
- [ ] Follow Arrange-Act-Assert pattern
- [ ] Mock external dependencies (API calls)
- [ ] Test both success and error paths
- [ ] Test edge cases
- [ ] Keep tests simple and focused
- [ ] Use helper functions for common setups
- [ ] Verify function calls with `.toHaveBeenCalledWith()`

## 📊 Coverage Goals

Target coverage:
- **Services**: 90%+ (easiest to test, high value)
- **Hooks**: 80%+ (important business logic)
- **Components**: 60%+ (integration tests, harder to achieve)
- **Overall**: 75%+

Run coverage report:
```bash
npm run test:coverage
```

## 🔍 Debugging Tests

### Run single test file
```bash
npm run test -- players.api.test.ts
```

### Run tests matching pattern
```bash
npm run test -- --grep "should fetch"
```

### Open test UI (visual test runner)
```bash
npm run test:ui
```

## 🚫 Common Pitfalls

1. **Testing implementation details instead of behavior**
   - ❌ Test that `useState` is called
   - ✅ Test the component output/behavior

2. **Forgetting to mock external dependencies**
   - ❌ Actual API calls in tests
   - ✅ Use `setupMockFetch()` helper

3. **Not awaiting async operations**
   - ❌ `expect(result.data).toBeDefined()`
   - ✅ `await waitFor(() => { expect(result.data).toBeDefined(); })`

4. **Overly complex test setup**
   - ❌ 50 lines of setup for 5 lines of test
   - ✅ Extract common setup to helpers

## 📚 Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing Tests

When adding new features:
1. Write tests first (TDD) or immediately after
2. Aim for high-impact tests: services first, hooks second
3. Keep tests simple and readable
4. Update this guide if adding new patterns

---

**Final Note**: Start with testing API services. They're the easiest to test and have the highest ROI. Once comfortable, move to hooks and components.
