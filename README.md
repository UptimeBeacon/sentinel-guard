# @uptimebeacon/sentinel-guard

A type-safe TypeScript library for API monitoring with heartbeat functionality.

## Features

-   **Type Safety**: Fully typed API with TypeScript
-   **Automatic Heartbeats**: Regular status updates with configurable intervals
-   **Monitor Management**: Create, update, and delete monitors
-   **Retry Logic**: Intelligent retries for temporary errors
-   **HTTP Client**: Robust HTTP client with timeout and error handling
-   **Error Handling**: Detailed error classes for various scenarios

## Installation

@uptimebeacon/sentinel-guard is compatible with all common package managers:

```bash
# npm
npm install @uptimebeacon/sentinel-guard

# yarn
yarn add @uptimebeacon/sentinel-guard

# pnpm
pnpm add @uptimebeacon/sentinel-guard

# bun
bun add @uptimebeacon/sentinel-guard
```

> **System Requirements**: Node.js \\( \geq 16.0.0 \\), TypeScript \\( \geq 5.0.0 \\)
>
> Detailed information on package manager compatibility can be found in [PACKAGE_MANAGERS.md](./PACKAGE_MANAGERS.md)

## Quick Start

```typescript
import { SentinelGuard } from '@uptimebeacon/sentinel-guard';

// Configure the library
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.yourservice.com',
  apiKey: 'your-api-key',
  timeout: 10000,
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 2,
  },
});

// Create a monitor
const monitor = await sentinel.createMonitor({
  name: 'My Website',
  url: 'https://example.com',
  interval: 300, // 5 minutes
  timeout: 30,
});

// Configure and start heartbeat
sentinel.initializeHeartbeat({
  interval: 60000, // 1 minute
  autoStart: true,
  maxConsecutiveErrors: 5,
});

// Manual heartbeat
await sentinel.sendHeartbeat({
  type: 'CUSTOM',
  status: 'ONLINE',
  latencyMs: 150,
  metadata: {
    version: '1.0.0',
    region: 'eu-west'
  }
});
```

## API Reference

### SentinelGuard Configuration

```typescript
interface SentinelGuardConfig {
  baseUrl: string;           // API base URL
  apiKey: string;            // API key
  timeout?: number;          // Request timeout (Default: 10000ms)
  retryConfig?: RetryConfig; // Retry configuration
}

interface RetryConfig {
  maxRetries: number;        // Max. retries
  baseDelay: number;         // Base delay in ms
  backoffMultiplier: number; // Exponential backoff multiplier
}
```

### Monitor Management

```typescript
// Create a monitor
const monitor = await sentinel.createMonitor({
  name: 'My Service',
  url: 'https://myservice.com',
  interval: 300,
  timeout: 30,
  metadata: { environment: 'production' }
});

// Retrieve all monitors
const monitors = await sentinel.getMonitors();

// Retrieve a specific monitor
const monitor = await sentinel.getMonitor('monitor-id');

// Update a monitor
const updated = await sentinel.updateMonitor('monitor-id', {
  name: 'Updated Name',
  interval: 600
});

// Pause/resume a monitor
await sentinel.pauseMonitor('monitor-id');
await sentinel.resumeMonitor('monitor-id');

// Delete a monitor
await sentinel.deleteMonitor('monitor-id');
```

### Heartbeat Functionality

```typescript
// Initialize Heartbeat Manager
sentinel.initializeHeartbeat({
  interval: 60000,        // 1 minute
  autoStart: true,        // Automatically start
  maxConsecutiveErrors: 5 // Max. consecutive errors
});

// Start/stop automatic heartbeats
sentinel.startHeartbeat();
sentinel.stopHeartbeat();

// Manual heartbeat
await sentinel.sendHeartbeat({
  type: 'CUSTOM',
  status: 'ONLINE',
  latencyMs: 120,
  metadata: {
    version: '1.0.0',
    environment: 'production'
  }
});

// Send status update
await sentinel.sendStatus('HIGH_LATENCY', {
  latencyMs: 2500,
  reason: 'database-timeout'
});

// Perform health check
const health = await sentinel.healthCheck();

// Check heartbeat status
const isActive = sentinel.isHeartbeatActive();
const errorCount = sentinel.getHeartbeatErrorCount();
```

### Error Handling

The library provides specific error classes:

```typescript
import {
  SentinelGuardError,
  NetworkError,
  AuthenticationError,
  RateLimitError
} from 'sentinel-guard';

try {
  await sentinel.sendHeartbeat();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('API key invalid');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

### Cleaning Resources

```typescript
// Important: Clean up resources when the application shuts down
sentinel.destroy();
```

## Examples

### Simple Monitor

```typescript
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
});

// Create website monitor
const monitor = await sentinel.createMonitor({
  name: 'Production Website',
  url: 'https://mywebsite.com',
  interval: 300,
  timeout: 30,
});

console.log(`Monitor created: ${monitor.data?.id}`);
```

### Heartbeat with Express.js

```typescript
import express from 'express';
import { SentinelGuard } from 'sentinel-guard';

const app = express();
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
});

// Heartbeat every 30 seconds
sentinel.initializeHeartbeat({
  interval: 30000,
  autoStart: true,
});

app.listen(3000, () => {
  console.log('Server started');
});

// Graceful shutdown
process.on('SIGINT', () => {
  sentinel.destroy();
  process.exit(0);
});
```

### Advanced Configuration

```typescript
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
  timeout: 15000,
  retryConfig: {
    maxRetries: 5,
    baseDelay: 2000,
    backoffMultiplier: 1.5,
  },
});

// Heartbeat with error handling
sentinel.initializeHeartbeat({
  interval: 120000, // 2 minutes
  maxConsecutiveErrors: 3,
  autoStart: false,
});

// Manually start with monitoring
sentinel.startHeartbeat();

// Regularly check error count
setInterval(() => {
  const errors = sentinel.getHeartbeatErrorCount();
  if (errors > 0) {
    console.warn(`${errors} consecutive Heartbeat errors`);
  }
}, 60000);
```

## Development

```bash
# Install dependencies (choose your preferred package manager)
npm install    # or yarn install, pnpm install, bun install

# Start development server
npm run dev    # Standard Node.js
npm run dev:bun # With Bun Runtime

# Create build
npm run build

# Run tests
npm test       # Standard Node.js Tests
npm run test:bun # With Bun Test Runner
```

### Package Manager Compatibility

-   ✅ **npm** - Standard Package Manager
-   ✅ **yarn** - With workspace support
-   ✅ **pnpm** - Efficient disk usage
-   ✅ **bun** - Native TypeScript support

See [PACKAGE_MANAGERS.md](./PACKAGE_MANAGERS.md) for detailed instructions.

## License

MIT License - see [LICENSE](LICENSE) file for details.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.