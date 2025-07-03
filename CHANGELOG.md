# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-03

### Added
- Initial release of @uptimebeacon/sentinel-guard
- Typesafe SentinelGuard class for API monitoring
- HTTP client with automatic retry logic and exponential backoff
- Monitor management (create, read, update, delete, pause, resume)
- Heartbeat functionality with automatic and manual modes
- Standard heartbeat data configuration for automatic heartbeats
- Support for all major package managers (npm, yarn, pnpm, bun)
- Comprehensive error handling with specific error classes:
  - `SentinelGuardError` - Base error class
  - `NetworkError` - Network-related errors
  - `AuthenticationError` - API authentication failures
  - `RateLimitError` - Rate limit exceeded errors
- TypeScript definitions for complete type safety
- ES Modules support with tree-shaking optimization
- Configurable timeouts and retry policies
- Graceful resource cleanup and shutdown handling

### Features
- **Monitor Management**: Full CRUD operations for monitoring endpoints
- **Heartbeat System**: 
  - Automatic heartbeats with configurable intervals
  - Manual heartbeat sending with custom data
  - Standard heartbeat data for consistent automatic reporting
  - Status updates (ONLINE, OFFLINE, HIGH_LATENCY, ERROR)
- **Error Handling**: Robust error handling with specific error types
- **Retry Logic**: Intelligent retry with exponential backoff
- **Type Safety**: Complete TypeScript support with full type definitions
- **Package Manager Support**: Works with npm, yarn, pnpm, and bun
- **Configuration Validation**: Built-in configuration validation

### Technical Details
- Node.js >= 16.0.0 required
- ES Modules only (type: "module")
- TypeScript >= 5.0.0 peer dependency
- Zero runtime dependencies
- Comprehensive examples and documentation

### API Compatibility
- Backend format: `{ type: "CUSTOM", status: "ONLINE", latencyMs?: number, metadata?: object }`
- Header authentication: `x-api-key` header
- Endpoints: `/monitors`, `/heartbeat`
- HTTP methods: GET, POST, PUT, DELETE

### Documentation
- Comprehensive README with examples
- Package manager compatibility guide
- TypeScript usage examples
- Error handling patterns
- Best practices for production use
