# 1.0.0 (2025-07-03)


### Bug Fixes

* Correct import path for SentinelGuard in compatibility test script ([2af1a91](https://github.com/UptimeBeacon/sentinel-guard/commit/2af1a91727324a04a2f3f3e4b3a7c5ecdc7f4ea7))
* Move build step before tests in CI workflow for improved execution order ([b6dbc69](https://github.com/UptimeBeacon/sentinel-guard/commit/b6dbc69f064d5debd32635e8f85c430d9bb2707b))
* Move build step before tests in CI workflow for improved execution order ([00cd69b](https://github.com/UptimeBeacon/sentinel-guard/commit/00cd69bb937367ddb45c7f7d27098eb2a8895e2b))
* Remove unused @semantic-release/exec plugin from release configuration ([3b3e8c3](https://github.com/UptimeBeacon/sentinel-guard/commit/3b3e8c32974602d59071ccbc8d3191aa42c8c3aa))
* Update author email and repository URLs for consistency ([915f7b0](https://github.com/UptimeBeacon/sentinel-guard/commit/915f7b06d711d939649572daeb138e10483395ea))


### Features

* Implement Heartbeat functionality and monitoring capabilities in SentinelGuard library ([33e58bf](https://github.com/UptimeBeacon/sentinel-guard/commit/33e58bf7cb8ace7b32b6022a31e0e5b6cf8f137c))
* Refactor SentinelGuard types for improved readability and consistency ([df517e4](https://github.com/UptimeBeacon/sentinel-guard/commit/df517e40484d263b0483edfc6ac36b18076f2eb5))

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
