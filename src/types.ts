/**
 * Simplified type definitions for SentinelGuard
 *
 * @fileoverview Type definitions and interfaces for the SentinelGuard monitoring library
 * @description Provides TypeScript type definitions for configuration, responses, and error handling
 * @version 1.0.0
 */

/**
 * Configuration options for SentinelGuard client
 *
 * @interface SentinelGuardConfig
 * @description Main configuration interface for initializing the SentinelGuard client
 */
export interface SentinelGuardConfig {
	/** Base URL of the API */
	baseUrl: string;
	/** API key */
	apiKey: string;
	/** Monitor API key */
	monitorApiKey: string;
	/** Timeout in milliseconds (optional, default: 10000) */
	timeout?: number;
}

/**
 * Configuration options for heartbeat behavior
 *
 * @interface HeartbeatConfig
 * @description Defines how often heartbeats are sent and error tolerance
 */
export interface HeartbeatConfig {
	/** Interval for heartbeats in milliseconds */
	interval: number;
}

/**
 * Data structure for heartbeat payloads
 *
 * @interface HeartbeatData
 * @description Contains service status, performance metrics, and metadata for heartbeat requests
 */
export interface HeartbeatData {
	/** Status of the service */
	status: "ONLINE" | "OFFLINE" | "ERROR" | "HIGH_LATENCY";
	/** Type of heartbeat */
	type: "CUSTOM";
	/** Service latency in milliseconds */
	latencyMs?: number;
	/** Performance data */
	performance?: PerformanceMetrics;
	/** Additional metadata */
	metadata?: Record<string, unknown>;
}

/**
 * Performance metrics for monitoring various service components
 *
 * @interface PerformanceMetrics
 * @description Contains latency measurements for different service components
 */
export interface PerformanceMetrics {
	/** Service latency in milliseconds */
	serviceLatency: number;
	/** Prisma latency in milliseconds */
	prismaLatency?: number;
	/** Redis latency in milliseconds */
	redisLatency?: number;
	/** Timestamp of measurement as ISO 8601 string */
	timestamp: string;
}

/**
 * Response structure for heartbeat requests
 *
 * @interface HeartbeatResponse
 * @description API response format for heartbeat submissions
 */
export interface HeartbeatResponse {
	success: boolean;
	timestamp: string;
	message?: string;
}

/**
 * Generic API response wrapper
 *
 * @interface ApiResponse
 * @template T - The type of data returned in successful responses
 * @description Standard response format for all API calls
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp: string;
}

/**
 * Prisma Client interface for database latency monitoring
 *
 * @interface PrismaClientLike
 * @description Minimal interface for Prisma client to enable database latency measurements
 */
export interface PrismaClientLike {
	$queryRaw: (
		query: TemplateStringsArray,
		...values: unknown[]
	) => Promise<unknown>;
}

/**
 * Redis Client interface for cache latency monitoring
 *
 * @interface RedisClientLike
 * @description Minimal interface for Redis client to enable cache latency measurements
 */
export interface RedisClientLike {
	ping: () => Promise<string>;
}

/**
 * Base error class for all SentinelGuard errors
 *
 * @class SentinelGuardError
 * @extends Error
 * @description Base class for all SentinelGuard-related errors
 */
export class SentinelGuardError extends Error {
	/**
	 * Creates a new SentinelGuardError
	 *
	 * @param message - Error message
	 * @param statusCode - Optional HTTP status code
	 */
	constructor(
		message: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = "SentinelGuardError";
	}
}

/**
 * Network-related error class
 *
 * @class NetworkError
 * @extends SentinelGuardError
 * @description Thrown when network requests fail
 */
export class NetworkError extends SentinelGuardError {
	/**
	 * Creates a new NetworkError
	 *
	 * @param message - Error message
	 * @param originalError - Optional original error that caused this network error
	 */
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "NetworkError";
	}
}

/**
 * Authentication-related error class
 *
 * @class AuthenticationError
 * @extends SentinelGuardError
 * @description Thrown when API authentication fails (HTTP 401)
 */
export class AuthenticationError extends SentinelGuardError {
	/**
	 * Creates a new AuthenticationError
	 *
	 * @param message - Error message (default: "Authentication failed")
	 */
	constructor(message: string = "Authentication failed") {
		super(message, 401);
		this.name = "AuthenticationError";
	}
}

/**
 * Rate limiting error class
 *
 * @class RateLimitError
 * @extends SentinelGuardError
 * @description Thrown when API rate limits are exceeded (HTTP 429)
 */
export class RateLimitError extends SentinelGuardError {
	/**
	 * Creates a new RateLimitError
	 *
	 * @param message - Error message (default: "Rate limit exceeded")
	 */
	constructor(message: string = "Rate limit exceeded") {
		super(message, 429);
		this.name = "RateLimitError";
	}
}

/**
 * Heartbeat sending error class
 *
 * @class HeartbeatSendError
 * @extends SentinelGuardError
 * @description Thrown when heartbeat sending fails
 */
export class HeartbeatSendError extends SentinelGuardError {
	/**
	 * Creates a new HeartbeatSendError
	 *
	 * @param message - Error message
	 * @param originalError - Optional original error that caused this heartbeat error
	 */
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "HeartbeatSendError";
	}
}

/**
 * Configuration error class
 *
 * @class ConfigurationError
 * @extends SentinelGuardError
 * @description Thrown when configuration is invalid or incomplete
 */
export class ConfigurationError extends SentinelGuardError {
	/**
	 * Creates a new ConfigurationError
	 *
	 * @param message - Error message
	 */
	constructor(message: string) {
		super(message);
		this.name = "ConfigurationError";
	}
}

/**
 * Client initialization error class
 *
 * @class ClientInitializationError
 * @extends SentinelGuardError
 * @description Thrown when HTTP client initialization fails
 */
export class ClientInitializationError extends SentinelGuardError {
	/**
	 * Creates a new ClientInitializationError
	 *
	 * @param message - Error message
	 * @param originalError - Optional original error that caused this initialization error
	 */
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "ClientInitializationError";
	}
}

/**
 * Performance monitoring error class
 *
 * @class PerformanceMonitoringError
 * @extends SentinelGuardError
 * @description Thrown when performance measurement fails
 */
export class PerformanceMonitoringError extends SentinelGuardError {
	/**
	 * Creates a new PerformanceMonitoringError
	 *
	 * @param message - Error message
	 * @param component - The component that failed (e.g., "service", "prisma", "redis")
	 * @param originalError - Optional original error that caused this monitoring error
	 */
	constructor(
		message: string,
		public readonly component: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "PerformanceMonitoringError";
	}
}

/**
 * Prisma connection error class
 *
 * @class PrismaConnectionError
 * @extends SentinelGuardError
 * @description Thrown when Prisma latency measurement fails
 */
export class PrismaConnectionError extends SentinelGuardError {
	/**
	 * Creates a new PrismaConnectionError
	 *
	 * @param message - Error message
	 * @param originalError - Optional original error that caused this Prisma error
	 */
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "PrismaConnectionError";
	}
}

/**
 * Redis connection error class
 *
 * @class RedisConnectionError
 * @extends SentinelGuardError
 * @description Thrown when Redis latency measurement fails
 */
export class RedisConnectionError extends SentinelGuardError {
	/**
	 * Creates a new RedisConnectionError
	 *
	 * @param message - Error message
	 * @param originalError - Optional original error that caused this Redis error
	 */
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "RedisConnectionError";
	}
}
