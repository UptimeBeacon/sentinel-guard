import type { HttpClient } from "./http-client.js";
import type {
	ApiResponse,
	HeartbeatConfig,
	HeartbeatData,
	HeartbeatResponse,
	PerformanceMetrics,
	PrismaClientLike,
	RedisClientLike,
} from "./types.js";
import {
	HeartbeatSendError,
	PerformanceMonitoringError,
	PrismaConnectionError,
	RedisConnectionError,
} from "./types.js";

/**
 * HeartbeatManager for automatic heartbeats with performance monitoring
 *
 * @class HeartbeatManager
 * @description Manages automatic heartbeat sending with configurable intervals and performance monitoring
 */
export class HeartbeatManager {
	private readonly httpClient: HttpClient;
	private readonly config: HeartbeatConfig;
	private intervalId: NodeJS.Timeout | null = null;
	private isRunning = false;
	private isSending = false;

	// Performance monitoring
	private prismaClient?: PrismaClientLike;
	private redisClient?: RedisClientLike;

	/**
	 * Creates a new HeartbeatManager instance
	 *
	 * @param httpClient - The HTTP client to use for sending heartbeats
	 * @param config - Configuration options for heartbeat behavior
	 */
	constructor(httpClient: HttpClient, config: HeartbeatConfig) {
		this.httpClient = httpClient;
		this.config = config;
	}

	/**
	 * Starts automatic heartbeats with the configured interval
	 *
	 * @description Begins sending heartbeats automatically. The first heartbeat is sent immediately,
	 * then continues at the configured interval.
	 * @returns void
	 */
	start(): void {
		try {
			if (this.isRunning) {
				return;
			}

			this.isRunning = true;

			// Send first heartbeat immediately
			this.sendHeartbeat().catch((error) => {
				// Handle first heartbeat error silently
				console.warn("Initial heartbeat failed:", error);
			});

			// Then send regularly
			this.intervalId = setInterval(() => {
				this.sendHeartbeat().catch((error) => {
					// Handle regular heartbeat errors silently
					console.warn("Heartbeat failed:", error);
				});
			}, this.config.interval);
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to start heartbeat manager",
				"startup",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Stops automatic heartbeats
	 *
	 * @description Stops the automatic heartbeat interval and cleans up resources
	 * @returns void
	 */
	stop(): void {
		try {
			if (!this.isRunning) {
				return;
			}

			this.isRunning = false;

			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to stop heartbeat manager",
				"shutdown",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Checks if heartbeats are currently running
	 *
	 * @returns True if heartbeats are active, false otherwise
	 */
	isActive(): boolean {
		return this.isRunning;
	}

	/**
	 * Configures Prisma Client for database latency monitoring
	 *
	 * @param client - The Prisma client instance to use for latency measurements
	 * @returns void
	 */
	setPrismaClient(client: PrismaClientLike): void {
		try {
			this.prismaClient = client;
		} catch (error) {
			throw new PrismaConnectionError(
				"Failed to set Prisma client",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Configures Redis Client for cache latency monitoring
	 *
	 * @param client - The Redis client instance to use for latency measurements
	 * @returns void
	 */
	setRedisClient(client: RedisClientLike): void {
		try {
			this.redisClient = client;
		} catch (error) {
			throw new RedisConnectionError(
				"Failed to set Redis client",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Sends a heartbeat with performance monitoring
	 *
	 * @description This is the primary heartbeat function that measures service, Prisma, and Redis latency
	 * @param customData - Optional custom data to include in the heartbeat
	 * @returns Promise resolving to the API response
	 */
	async sendHeartbeat(
		customData?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		// Prevent duplicate heartbeats
		if (this.isSending) {
			return {
				success: false,
				error: "Heartbeat already in progress",
				timestamp: new Date().toISOString(),
			};
		}

		this.isSending = true;

		try {
			// Measure performance
			const performanceMetrics = await this.measurePerformance();

			// Compile heartbeat data
			const heartbeatData: HeartbeatData = {
				type: "CUSTOM",
				status: "ONLINE",
				latencyMs: Math.round(performanceMetrics.serviceLatency),
				performance: {
					...performanceMetrics,
					serviceLatency: Math.round(performanceMetrics.serviceLatency),
					prismaLatency: performanceMetrics.prismaLatency
						? Math.round(performanceMetrics.prismaLatency)
						: undefined,
					redisLatency: performanceMetrics.redisLatency
						? Math.round(performanceMetrics.redisLatency)
						: undefined,
				},
				metadata: {
					timestamp: new Date().toISOString(),
					...customData?.metadata,
				},
				...customData,
			};

			// Send HTTP request
			const response = await this.httpClient.request<HeartbeatResponse>(
				"/heartbeat",
				{
					method: "POST",
					body: JSON.stringify(heartbeatData),
				},
			);

			return response;
		} catch (error) {
			const heartbeatError = new HeartbeatSendError(
				"Failed to send heartbeat",
				error instanceof Error ? error : undefined,
			);
			return {
				success: false,
				error: heartbeatError.message,
				timestamp: new Date().toISOString(),
			};
		} finally {
			this.isSending = false;
		}
	}

	/**
	 * Measures performance metrics for service, Prisma, and Redis
	 *
	 * @description Safely measures latency for all configured components
	 * @returns Promise resolving to performance metrics
	 * @private
	 */
	private async measurePerformance(): Promise<PerformanceMetrics> {
		const performanceMetrics: PerformanceMetrics = {
			serviceLatency: 0,
			timestamp: new Date().toISOString(),
		};

		try {
			// Measure service latency
			const startTime = performance.now();
			await new Promise((resolve) => setTimeout(resolve, 1)); // Simulated work
			performanceMetrics.serviceLatency = performance.now() - startTime;
		} catch (error) {
			// Service latency measurement failed, use default
			performanceMetrics.serviceLatency = 0;
		}

		// Measure Prisma latency
		if (this.prismaClient) {
			try {
				const prismaStart = performance.now();
				await this.prismaClient.$queryRaw`SELECT 1 as test`;
				performanceMetrics.prismaLatency = performance.now() - prismaStart;
			} catch (error) {
				// Log but don't throw - this is optional monitoring
				console.warn("Prisma latency measurement failed:", error);
				performanceMetrics.prismaLatency = undefined;
			}
		}

		// Measure Redis latency
		if (this.redisClient) {
			try {
				const redisStart = performance.now();
				await this.redisClient.ping();
				performanceMetrics.redisLatency = performance.now() - redisStart;
			} catch (error) {
				// Log but don't throw - this is optional monitoring
				console.warn("Redis latency measurement failed:", error);
				performanceMetrics.redisLatency = undefined;
			}
		}

		return performanceMetrics;
	}

	/**
	 * Cleanup when destroying the HeartbeatManager instance
	 *
	 * @description Stops all heartbeat intervals and cleans up resources
	 * @returns void
	 */
	destroy(): void {
		try {
			this.stop();
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to cleanup heartbeat manager",
				"cleanup",
				error instanceof Error ? error : undefined,
			);
		}
	}
}
