# @uptimebeacon/sentinel-guard

A type-safe TypeScript library for simple application monitoring with automatic heartbeat functionality. Part of the [UptimeBeacon.cloud](https://uptimebeacon.cloud) monitoring platform.

## About UptimeBeacon

This library is the official client for **UptimeBeacon.cloud** - a powerful SaaS monitoring platform that helps you keep track of your applications, services, and infrastructure. UptimeBeacon provides real-time monitoring, alerting, and performance analytics for your critical systems.

**Key Benefits:**

- 🚀 **Easy Integration**: Get started in minutes with this simple library
- 📊 **Real-time Monitoring**: Live dashboards and metrics
- 🔔 **Smart Alerts**: Discord webhook notifications (Email, SMS, Slack, and webhook notifications coming soon)
- 📈 **Performance Analytics**: Historical data and trends
- 🌍 **Global Infrastructure**: Monitoring from multiple regions
- 💰 **Affordable Pricing**: Scale with your business needs

[Sign up for UptimeBeacon.cloud →](https://uptimebeacon.cloud)

## Features

- **Simple Setup**: Start monitoring with just a few lines of code
- **Automatic Heartbeats**: Regular status updates with configurable intervals
- **Type Safety**: Fully typed API with TypeScript
- **Performance Monitoring**: Database latency tracking (Prisma & Redis)
- **Error Handling**: Intelligent error tracking and retry logic
- **Graceful Shutdown**: Clean resource management

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

> **System Requirements**: Node.js ≥ 16.0.0, TypeScript ≥ 5.0.0
>
> **Prerequisites**: You need an [UptimeBeacon.cloud](https://uptimebeacon.cloud) account to get your API keys.

## Quick Start

### 1. Get Your API Keys

1. Sign up at [UptimeBeacon.cloud](https://uptimebeacon.cloud)
2. Create a new project in your dashboard
3. Copy your API keys from the project settings

### 2. Initialize and Start Monitoring

```typescript
import { SentinelGuard } from "@uptimebeacon/sentinel-guard";

// Initialize with your UptimeBeacon.cloud API keys
const sentinel = new SentinelGuard({
  apiKey: process.env.SENTINEL_API_KEY!, // From UptimeBeacon dashboard
  baseUrl: process.env.SENTINEL_API_URL!, // Your UptimeBeacon API endpoint
  monitorApiKey: process.env.SENTINEL_MONITOR_API_KEY!, // Monitor-specific key
  timeout: 10000, // optional
});

// Start automatic monitoring - data will appear in your UptimeBeacon dashboard
sentinel.startMonitoring({
  interval: 30000, // Send heartbeat every 30 seconds
  maxConsecutiveErrors: 5,
});

console.log("✅ Monitoring started");

// 3. Graceful shutdown
process.on("SIGINT", () => {
  sentinel.stopMonitoring();
  process.exit(0);
});
```

That's it! Your application now automatically sends heartbeats every 30 seconds to UptimeBeacon.cloud. Monitor your application health, performance, and uptime directly from your [UptimeBeacon dashboard](https://uptimebeacon.cloud/dashboard).

## API Reference

### SentinelGuard Configuration

```typescript
interface SentinelGuardConfig {
  apiKey: string; // Your UptimeBeacon.cloud API key
  baseUrl: string; // UptimeBeacon API base URL (from dashboard)
  monitorApiKey: string; // Monitor-specific API key (from dashboard)
  timeout?: number; // Request timeout (default: 10000ms)
}
```

All configuration values can be found in your [UptimeBeacon.cloud dashboard](https://uptimebeacon.cloud/dashboard) under project settings.

### Core Methods

#### Starting and Stopping Monitoring

```typescript
// Start automatic monitoring
sentinel.startMonitoring({
  interval: 30000, // Heartbeat interval in ms
  maxConsecutiveErrors: 5, // Max errors before alerting
});

// Stop monitoring
sentinel.stopMonitoring();

// Check if monitoring is active
const isActive = sentinel.isMonitoringActive();

// Get current error count
const errorCount = sentinel.getErrorCount();

// Clean up resources
sentinel.destroy();
```

#### Manual Heartbeats

```typescript
// Send a manual heartbeat
const response = await sentinel.sendHeartbeat({
  status: 'ONLINE',           // Status of your application
  metadata?: {                // Optional metadata
    service: 'my-app',
    version: '1.0.0',
    environment: 'production'
  }
});

if (response.success) {
  console.log('✅ Heartbeat sent successfully');
} else {
  console.log('❌ Heartbeat failed:', response.error);
}
```

### Database Performance Monitoring (Optional)

Track database latency by providing your database clients:

```typescript
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const prisma = new PrismaClient();
const redis = createClient();
await redis.connect();

// Configure database clients for latency tracking
sentinel.setPrismaClient(prisma);
sentinel.setRedisClient(redis);
```

When configured, SentinelGuard will automatically measure and include database latency in heartbeats.

## Examples

### Basic Express.js App

```typescript
import express from "express";
import { SentinelGuard } from "@uptimebeacon/sentinel-guard";

const app = express();

// Initialize monitoring
const sentinel = new SentinelGuard({
  apiKey: process.env.SENTINEL_API_KEY!,
  baseUrl: process.env.SENTINEL_API_URL!,
  monitorApiKey: process.env.SENTINEL_MONITOR_API_KEY!,
});

// Start monitoring when server starts
app.listen(3000, () => {
  console.log("Server started on port 3000");

  sentinel.startMonitoring({
    interval: 60000, // Every minute
    maxConsecutiveErrors: 3,
  });

  console.log("✅ Monitoring started");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down...");
  sentinel.stopMonitoring();
  process.exit(0);
});
```

### With Database Monitoring

```typescript
import { SentinelGuard } from "@uptimebeacon/sentinel-guard";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

const sentinel = new SentinelGuard({
  apiKey: process.env.SENTINEL_API_KEY!,
  baseUrl: process.env.SENTINEL_API_URL!,
  monitorApiKey: process.env.SENTINEL_MONITOR_API_KEY!,
});

// Setup database clients
const prisma = new PrismaClient();
const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

// Configure for performance monitoring
sentinel.setPrismaClient(prisma);
sentinel.setRedisClient(redis);

// Start monitoring with database latency tracking
sentinel.startMonitoring({
  interval: 30000,
  maxConsecutiveErrors: 5,
});

console.log("✅ Monitoring with database tracking started");
```

### Manual Heartbeat with Custom Data

```typescript
// Send heartbeat with custom application data
try {
  const response = await sentinel.sendHeartbeat({
    status: "ONLINE",
    metadata: {
      service: "user-service",
      version: "2.1.0",
      environment: "production",
      region: "eu-west-1",
      activeUsers: 1247,
      memoryUsage: process.memoryUsage(),
    },
  });

  if (response.success) {
    console.log("✅ Custom heartbeat sent");
  }
} catch (error) {
  console.error("❌ Heartbeat error:", error);
}
```

### Monitoring Status

```typescript
// Check monitoring status periodically
setInterval(() => {
  const isActive = sentinel.isMonitoringActive();
  const errorCount = sentinel.getErrorCount();

  console.log(`📊 Monitoring: ${isActive ? "Active" : "Inactive"}`);

  if (errorCount > 0) {
    console.warn(`⚠️ ${errorCount} consecutive errors`);
  }
}, 60000); // Check every minute
```

## Error Handling

The library handles errors gracefully and provides detailed information:

```typescript
try {
  const response = await sentinel.sendHeartbeat({
    status: "ONLINE",
  });

  if (!response.success) {
    console.error("Heartbeat failed:", response.error);
  }
} catch (error) {
  console.error("Network or API error:", error);
}
```

## Best Practices

1. **Environment Variables**: Store API keys in environment variables
2. **Graceful Shutdown**: Always call `stopMonitoring()` before exit
3. **Error Monitoring**: Monitor the error count regularly
4. **Appropriate Intervals**: Choose heartbeat intervals based on your needs (30-300 seconds recommended)
5. **Resource Cleanup**: Call `destroy()` when shutting down

## Development

```bash
# Install dependencies
bun install

# Start development
bun run dev

# Build library
bun run build

# Run tests
bun test

# Check compatibility
bun run test:compatibility
```

## Environment Variables

Create a `.env` file in your project with your UptimeBeacon.cloud credentials:

```env
# Get these from your UptimeBeacon.cloud dashboard
SENTINEL_API_KEY=your-uptimebeacon-api-key
SENTINEL_API_URL=https://api.uptimebeacon.cloud
SENTINEL_MONITOR_API_KEY=your-monitor-api-key
```

**Where to find your credentials:**

> Currently UptimeBeacon is in a closed beta. Please contact us for access.

1. Log in to [UptimeBeacon.cloud](https://uptimebeacon.cloud)
2. Go to your dashboard
3. Navigate to "API Keys"
4. Create and copy the required keys and API endpoint
5. Navigate to your monitors
6. Create a monitor
7. Navigate to "configure"
8. Generate a new API key

## License

MIT License - see [LICENSE](LICENSE) file for details.
