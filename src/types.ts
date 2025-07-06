/**
 * Vereinfachte Typdefinitionen für SentinelGuard
 */

export interface SentinelGuardConfig {
	/** Base URL der API */
	baseUrl: string;
	/** API-Schlüssel */
	apiKey: string;
	/** Monitor API-Schlüssel */
	monitorApiKey: string;
	/** Timeout in Millisekunden (optional, Standard: 10000) */
	timeout?: number;
	/** Retry-Konfiguration (optional) */
	retryConfig?: RetryConfig;
}

export interface RetryConfig {
	/** Maximale Anzahl der Wiederholungsversuche */
	maxRetries: number;
	/** Basis-Delay zwischen den Versuchen in Millisekunden */
	baseDelay: number;
	/** Exponentieller Backoff-Multiplikator */
	backoffMultiplier: number;
}

export interface HeartbeatConfig {
	/** Intervall für Heartbeats in Millisekunden */
	interval: number;
	/** Maximale aufeinanderfolgende Fehler bevor Stopp */
	maxConsecutiveErrors?: number;
}

export interface HeartbeatData {
	/** Status des Services */
	status: "ONLINE" | "OFFLINE" | "ERROR" | "HIGH_LATENCY";
	/** Typ des Heartbeats */
	type: "CUSTOM";
	/** Service-Latenz in Millisekunden */
	latencyMs?: number;
	/** Performance-Daten */
	performance?: PerformanceMetrics;
	/** Zusätzliche Metadaten */
	metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
	/** Service-Latenz in Millisekunden */
	serviceLatency: number;
	/** Prisma-Latenz in Millisekunden */
	prismaLatency?: number;
	/** Redis-Latenz in Millisekunden */
	redisLatency?: number;
	/** Timestamp der Messung als ISO 8601 String */
	timestamp: string;
}

export interface HeartbeatResponse {
	success: boolean;
	timestamp: string;
	message?: string;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	timestamp: string;
}

// Prisma Client Interface
export interface PrismaClientLike {
	$queryRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
}

// Redis Client Interface
export interface RedisClientLike {
	ping: () => Promise<string>;
}

// Error Classes
export class SentinelGuardError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = "SentinelGuardError";
	}
}

export class NetworkError extends SentinelGuardError {
	constructor(
		message: string,
		public readonly originalError?: Error,
	) {
		super(message);
		this.name = "NetworkError";
	}
}

export class AuthenticationError extends SentinelGuardError {
	constructor(message: string = "Authentication failed") {
		super(message, 401);
		this.name = "AuthenticationError";
	}
}

export class RateLimitError extends SentinelGuardError {
	constructor(message: string = "Rate limit exceeded") {
		super(message, 429);
		this.name = "RateLimitError";
	}
}