import { HeartbeatManager } from "./heartbeat-manager.js";
import { HttpClient } from "./http-client.js";
import {
	type ApiResponse,
	ClientInitializationError,
	ConfigurationError,
	type HeartbeatConfig,
	type HeartbeatData,
	type HeartbeatResponse,
	HeartbeatSendError,
	type PerformanceMetrics,
	PerformanceMonitoringError,
	type PrismaClientLike,
	PrismaConnectionError,
	type RedisClientLike,
	RedisConnectionError,
	type SentinelGuardConfig,
} from "./types.js";

/**
 * Simplified SentinelGuard Library
 *
 * @class SentinelGuard
 * @description Main class for SentinelGuard monitoring functionality
 *
 * Features:
 * - Automatic heartbeats with configurable interval
 * - Performance monitoring (Service, Prisma, Redis)
 * - Robust error handling
 */
export class SentinelGuard {
	private readonly httpClient: HttpClient;
	private heartbeatManager: HeartbeatManager | null = null;

	/**
	 * Creates a new SentinelGuard instance
	 *
	 * @param config - Configuration options for the SentinelGuard client
	 */
	constructor(config: SentinelGuardConfig) {
		try {
			// Validate configuration
			this.validateConfiguration(config);
			this.httpClient = new HttpClient(config);
		} catch (error) {
			throw new ClientInitializationError(
				"Failed to initialize SentinelGuard client",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Validates the configuration
	 *
	 * @param config - Configuration to validate
	 * @private
	 */
	private validateConfiguration(config: SentinelGuardConfig): void {
		if (!config.baseUrl) {
			throw new ConfigurationError("baseUrl is required");
		}
		if (!config.apiKey) {
			throw new ConfigurationError("apiKey is required");
		}
		if (!config.monitorApiKey) {
			throw new ConfigurationError("monitorApiKey is required");
		}
	}

	/**
	 * Starts automatic heartbeats with performance monitoring
	 *
	 * @description This is the primary method you need to call to begin monitoring
	 * @param config - Configuration options for heartbeat behavior
	 * @returns void
	 */
	startMonitoring(config: HeartbeatConfig): void {
		try {
			// Validate heartbeat configuration
			if (!config.interval || config.interval <= 0) {
				throw new ConfigurationError("Heartbeat interval must be positive");
			}

			// Cleanup if already running
			if (this.heartbeatManager) {
				this.heartbeatManager.destroy();
			}

			// Create and start new HeartbeatManager
			this.heartbeatManager = new HeartbeatManager(this.httpClient, config);
			this.heartbeatManager.start();
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to start monitoring",
				"monitoring",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Stops monitoring
	 *
	 * @description Stops all automatic heartbeat monitoring
	 * @returns void
	 */
	stopMonitoring(): void {
		try {
			if (this.heartbeatManager) {
				this.heartbeatManager.stop();
			}
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to stop monitoring",
				"monitoring",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Configures Prisma Client for database latency measurement
	 *
	 * @param client - The Prisma client instance to use for latency measurements
	 * @returns void
	 */
	setPrismaClient(client: PrismaClientLike): void {
		try {
			if (!this.heartbeatManager) {
				throw new PerformanceMonitoringError(
					"Monitoring not started. Call startMonitoring() first.",
					"configuration",
				);
			}
			this.heartbeatManager.setPrismaClient(client);
		} catch (error) {
			if (error instanceof PerformanceMonitoringError) {
				throw error;
			}
			throw new PrismaConnectionError(
				"Failed to set Prisma client",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Configures Redis Client for cache latency measurement
	 *
	 * @param client - The Redis client instance to use for latency measurements
	 * @returns void
	 */
	setRedisClient(client: RedisClientLike): void {
		try {
			if (!this.heartbeatManager) {
				throw new PerformanceMonitoringError(
					"Monitoring not started. Call startMonitoring() first.",
					"configuration",
				);
			}
			this.heartbeatManager.setRedisClient(client);
		} catch (error) {
			if (error instanceof PerformanceMonitoringError) {
				throw error;
			}
			throw new RedisConnectionError(
				"Failed to set Redis client",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Checks if monitoring is running
	 *
	 * @returns True if monitoring is active, false otherwise
	 */
	isMonitoringActive(): boolean {
		try {
			return this.heartbeatManager?.isActive() ?? false;
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to check monitoring status",
				"status",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Measures current performance metrics (for manual checks)
	 *
	 * @description Provides current performance measurements without sending a heartbeat
	 * @returns Promise resolving to current performance metrics
	 */
	async getPerformanceMetrics(): Promise<PerformanceMetrics> {
		try {
			const startTime = performance.now();

			// Small simulated work for service latency
			await new Promise((resolve) => setTimeout(resolve, 1));
			const serviceLatency = performance.now() - startTime;

			return {
				serviceLatency,
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to get performance metrics",
				"metrics",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Sends a single heartbeat (for manual checks)
	 *
	 * @param data - Optional custom data to include in the heartbeat
	 * @returns Promise resolving to the API response
	 */
	async sendHeartbeat(
		data?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		try {
			if (!this.heartbeatManager) {
				throw new PerformanceMonitoringError(
					"Monitoring not started. Call startMonitoring() first.",
					"heartbeat",
				);
			}
			return await this.heartbeatManager.sendHeartbeat(data);
		} catch (error) {
			if (error instanceof PerformanceMonitoringError) {
				return {
					success: false,
					error: error.message,
					timestamp: new Date().toISOString(),
				};
			}
			const heartbeatError = new HeartbeatSendError(
				"Failed to send heartbeat",
				error instanceof Error ? error : undefined,
			);
			return {
				success: false,
				error: heartbeatError.message,
				timestamp: new Date().toISOString(),
			};
		}
	}

	/**
	 * Cleanup when shutting down the application
	 *
	 * @description Stops monitoring and cleans up all resources
	 * @returns void
	 */
	destroy(): void {
		try {
			if (this.heartbeatManager) {
				this.heartbeatManager.destroy();
				this.heartbeatManager = null;
			}
		} catch (error) {
			throw new PerformanceMonitoringError(
				"Failed to cleanup SentinelGuard",
				"cleanup",
				error instanceof Error ? error : undefined,
			);
		}
	}
}
