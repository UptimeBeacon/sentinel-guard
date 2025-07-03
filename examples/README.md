# Examples for SentinelGuard

This directory contains practical examples for using the SentinelGuard Library.

## Available Examples

### 1. Basic Monitor (`basic-monitor.ts`)
Basic monitor management:
- Create monitor
- Retrieve all monitors
- Display monitor details
- Pause/activate monitor
- Delete monitor

```bash
bun run examples/basic-monitor.ts
```

### 2. Heartbeat Example (`heartbeat-example.ts`)
Demonstrating heartbeat functionality:

- Configure heartbeat manager
- Send manual heartbeats
- Start/stop automatic heartbeats
- Send status updates
- Perform health checks

```bash
bun run examples/heartbeat-example.ts
```

### 3. Error Handling (`error-handling.ts`)
Advanced error handling and retry logic:

- Test various error types
- Configuration validation
- Demonstrate retry behavior
- Specific error handling

```bash
bun run examples/error-handling.ts
```

## Preparation

Before running the examples:

1. Adjust API Configuration: Edit the example files and replace placeholder URLs and API keys with actual values.


2. Example Configuration:
```typescript
const sentinel = new SentinelGuard({
  baseUrl: 'https://your-actual-api.com',
  apiKey: process.env.SENTINEL_API_KEY || 'your-real-api-key',
  timeout: 10000,
});
```

3. **Environment Variables** (recommended):
```bash
export SENTINEL_API_KEY="your-actual-api-key"
export SENTINEL_BASE_URL="https://your-actual-api.com"
```

## Troubleshooting

### Common Problems:

1. **Invalid API Key**:
    - Check the API key
    - Ensure it has the correct permissions

2. **Network Timeouts**:
    - Increase the timeout value
    - Check the network connection

## Contributing

If you have other useful examples, feel free to create a Pull Request!