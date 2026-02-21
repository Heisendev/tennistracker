# 🧪 Testing Checklist & Quick Reference

## ✅ Setup Verification

When you first run tests, verify:

```bash
# 1. Install dependencies
npm install

# 2. Run tests - should see something like:
npm run test
#
# ✓ src/__tests__/services/players.api.test.ts (12)
# ✓ src/__tests__/services/matchs.api.test.ts (16)
# ✓ src/__tests__/services/liveMatch.api.test.ts (20)
# ✓ src/__tests__/hooks/useLiveMatch.test.ts (25)
# ✓ src/__tests__/hooks/useMatchs.test.ts (28)
#
# Test Files  5 passed (5)
# Tests  90 + passed (101)

# 3. Watch mode - for development
npm run test:watch

# 4. Coverage - see how much is tested
npm run test:coverage

# 5. UI - visual test runner
npm run test:ui
```

---

## 📝 Quick Templates

### Basic API Service Test
```typescript
import { setupMockFetch, resetMocks } from '../utils/mockFetch';

describe('API Service', () => {
  beforeEach(() => resetMocks());

  it('should fetch data', async () => {
    setupMockFetch({ id: 1 });
    const response = await fetch('/api');
    const data = await response.json();
    expect(data.id).toBe(1);
  });
});
```

### Basic Hook Test
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

function wrapper({ children }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
}

describe('useHook', () => {
  it('should load data', async () => {
    setupMockFetch({ id: 1 });
    const { result } = renderHook(() => useHook(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.id).toBe(1);
  });
});
```

---

## 🎯 Writing Tests - Step by Step

### Step 1: Choose What to Test
```
API Service → Hook → Component
   (easy)     (medium)   (hard)
```

### Step 2: Pick a Template
- API Service → [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) Template 1
- Query Hook → [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) Template 2
- Mutation Hook → [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) Template 3
- Component → [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) Template 4

### Step 3: Copy & Adapt
1. Copy template from [TEST_TEMPLATES.md](./TEST_TEMPLATES.md)
2. Replace naming (yourService → yourService)
3. Update mock data ({ id: 1 } → actual data)
4. Adjust assertions (expectations)

### Step 4: Run & Verify
```bash
npm run test:watch -- yourFile.test.ts
# Watch for "PASS ✓"
```

---

## 📋 Testing Checklist

### Before Writing
- [ ] Understood the function purpose
- [ ] Identified success and error cases
- [ ] Picked appropriate template
- [ ] Reviewed similar existing test

### While Writing
- [ ] Using `resetMocks()` in beforeEach
- [ ] Using `setupMockFetch()` for mocks
- [ ] Following Arrange-Act-Assert pattern
- [ ] Testing success path
- [ ] Testing error path
- [ ] Testing edge cases

### After Writing
- [ ] Test passes: `npm run test`
- [ ] Test is readable (clear names)
- [ ] Test is isolated (no side effects)
- [ ] Test covers the important logic
- [ ] Coverage improved: `npm run test:coverage`

---

## 🔧 Common Code Patterns

### Test API Service
```typescript
// ✅ DO
setupMockFetch({ id: 1 });

// ❌ DON'T
global.fetch = jest.fn(() => Promise.resolve(...));
```

### Test Hook with Query
```typescript
// ✅ DO
const { result } = renderHook(() => useHook(), { wrapper });

// ❌ DON'T
render(<YourHookConsumer />);
```

### Wait for Async
```typescript
// ✅ DO
await waitFor(() => expect(result.current.isLoading).toBe(false));

// ❌ DON'T
expect(result.current.data).toBeDefined(); // Too fast!
```

---

## 🚨 Top Issues & Fixes

| Issue | Fix | Line |
|-------|-----|------|
| Tests fail randomly | Add `resetMocks()` in `beforeEach` | [setup.ts](./src/__tests__/setup.ts#L5) |
| Hook returns undefined | Use `createQueryWrapper()` | [template](./TEST_TEMPLATES.md#L52) |
| Test hangs | Add `await waitFor()` | [template](./TEST_TEMPLATES.md#L48) |
| Mock not working | Verify `setupMockFetch()` is called | [mockFetch.ts](./src/__tests__/utils/mockFetch.ts) |
| Fetch not mocked | Check `fetch()` is not real import | [setup.ts](./src/__tests__/setup.ts) |

---

## 📊 File Organization

```
Perfect for:

✅ Unit Tests → src/__tests__/services/
   (Test single functions)

✅ Hook Tests → src/__tests__/hooks/
   (Test React hooks)

✅ Component Tests → src/__tests__/components/ (TODO)
   (Test React components)

✅ Integration Tests → src/__tests__/integration/ (TODO)
   (Test multiple pieces together)

❌ NOT Here → src/
   (Don't mix tests with code)
```

---

## 🎓 Learning Path

### Start Here (30 minutes)
1. Read [TESTING_SETUP_COMPLETE.md](./TESTING_SETUP_COMPLETE.md)
2. Run `npm run test`
3. Open one test file, read it

### Next Phase (1-2 hours)
1. Read [TESTING.md](./TESTING.md) "Testing Patterns" section
2. Review [TEST_TEMPLATES.md](./TEST_TEMPLATES.md)
3. Copy template, make small change, run

### Practice Phase (2-4 hours)
1. Pick one untested function
2. Use template from [TEST_TEMPLATES.md](./TEST_TEMPLATES.md)
3. Write 3-5 test cases
4. Run `npm run test:watch`
5. See tests pass! ✨

### Advanced Phase (Ongoing)
1. Write tests for components
2. Write integration tests
3. Improve coverage to 80%+
4. Set up CI/CD with GitHub Actions

---

## 💬 Test Naming Convention

### Good Test Names (✅)
```typescript
it('should fetch players successfully')
it('should return empty array when no players exist')
it('should handle server errors gracefully')
it('should show loading state while fetching')
it('should return error when player not found')
```

### Bad Test Names (❌)
```typescript
it('test')
it('works')
it('should work')
it('test the hook')
it('check data')
```

---

## 🔗 Quick Links

| Topic | File |
|-------|------|
| Main Testing Guide | [TESTING.md](./TESTING.md) |
| Copy-Paste Templates | [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) |
| Complete Summary | [TEST_SETUP_SUMMARY.md](./TEST_SETUP_SUMMARY.md) |
| Implementation Details | [TESTING_SETUP_COMPLETE.md](./TESTING_SETUP_COMPLETE.md) |
| In-Suite Documentation | [src/__tests__/README.md](./src/__tests__/README.md) |

---

## 🏃 Quick Commands

```bash
# Development workflow
npm run test:watch        # Watch mode (use this!)

# Before commit
npm run test             # Run all tests
npm run test:coverage   # Check coverage

# Debugging
console.log(data)                    # Add logs
npm run test:ui                      # Visual runner
npm run test -- --reporter=verbose   # More details
```

---

## ⚡ Pro Tips

1. **Use watch mode**: `npm run test:watch` - tests rerun as you edit
2. **Read existing tests**: Copy patterns from similar tests
3. **Keep tests simple**: 1 test = 1 thing to verify
4. **Test behavior, not implementation**: Focus on inputs/outputs
5. **Mock external calls**: Use setup helpers, not real APIs
6. **Use descriptive names**: Tell future-you what you tested
7. **Test error paths**: success + error = complete test
8. **Run coverage**: `npm run test:coverage` - see what needs testing

---

## 📞 When Stuck

1. **Check your test name** - Is it descriptive?
2. **Review similar test** - Copy its structure
3. **Add console.log()** - Debug your data
4. **Read the error** - Usually tells you what's wrong
5. **Use test:ui** - Watch test execution visually
6. **Check documentation** - [TESTING.md](./TESTING.md) has patterns

---

## ✨ You'll Know You're Ready When

- [ ] Can run `npm run test` with no errors
- [ ] Understand the Arrange-Act-Assert pattern
- [ ] Can copy a template and write a test
- [ ] Know how to use `setupMockFetch()`
- [ ] Can interpret test failures
- [ ] Wrote your first 3 tests
- [ ] See all tests passing ✅

---

## 🎯 Next Test to Write

You have 90+ tests. Next:

1. **usePlayersHook** (similar to useMatchs)
2. **MatchSummary component** (using patterns from hooks)
3. **Server backend routes** (similar API service pattern)

**Try it with template:** Use [TEST_TEMPLATES.md](./TEST_TEMPLATES.md) Template 2 or 3

---

**You've got this! 💪**

*Start with:*
```bash
npm run test:watch
```

*Then open a test file and explore!*

---

*Last Updated: 2024*
*Status: Ready to Test* ✅
