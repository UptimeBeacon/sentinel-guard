# Test Directory

This directory contains all tests for @uptimebeacon/sentinel-guard.

## Test Files

### Unit Tests
-   `unit.test.ts` - Basic unit tests for SentinelGuard class
-   `error-handling.test.ts` - Tests for error handling and error classes

### Integration Tests
-   `test-compatibility.js` - Package Manager compatibility tests
-   `test-backend-integration.ts` - Backend integration tests

## Running Tests

### Node.js Tests
```bash
npm test
# or directly:
node --test test/*.test.ts
```

### Bun Tests
```bash
npm run test:bun
# or directly:
bun test test/
```

### Compatibility Tests
```bash
npm run test:compatibility
# or directly:
node test/test-compatibility.js
```

### Backend Integration
```bash
# Ensure your backend is running
node test/test-backend-integration.ts
```

## Test Structure

```
test/
├── README.md                    # This file
├── unit.test.ts                 # Unit Tests
├── error-handling.test.ts       # Error Handling Tests
├── test-compatibility.js        # Compatibility Tests
└── test-backend-integration.ts  # Backend Integration
```

## Test Categories

### Unit Tests
-   Configuration validation
-   Heartbeat manager initialization
-   Standard heartbeat data
-   Basic functionality

### Error Handling
-   Network errors
-   Authentication errors
-   Rate limit errors
-   Retry configuration

### Integration Tests
-   Package Manager compatibility
-   Backend API integration
-   Real-world scenarios

## CI/CD Integration

These tests are optimized for execution in CI/CD pipelines:

```yaml
# GitHub Actions Example
- name: Run Tests
  run: |
    npm run build
    npm test
    npm run test:compatibility
```

## Local Development

For local development:

```bash
# Test all
npm run check

# Only tests
npm test

# Watch mode (if implemented)
npm run test:watch
```