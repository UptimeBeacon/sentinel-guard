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

/**
 * Vereinfachter HeartbeatManager für automatische Heartbeats mit Performance-Monitoring
 */
export class HeartbeatManager {
	private readonly httpClient: HttpClient;
	private readonly config: HeartbeatConfig;
	private intervalId: NodeJS.Timeout | null = null;
	private consecutiveErrors = 0;
	private isRunning = false;
	private isSending = false; // Verhindert doppelte Heartbeats

	// Performance-Monitoring
	private prismaClient?: PrismaClientLike;
	private redisClient?: RedisClientLike;

	constructor(httpClient: HttpClient, config: HeartbeatConfig) {
		this.httpClient = httpClient;
		this.config = {
			maxConsecutiveErrors: 5,
			...config,
		};
	}

	/**
	 * Startet automatische Heartbeats
	 */
	start(): void {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		this.consecutiveErrors = 0;

		console.log(
			`🚀 Heartbeats gestartet (Intervall: ${this.config.interval}ms)`,
		);

		// Ersten Heartbeat sofort senden
		this.sendHeartbeat();

		// Dann regelmäßig senden
		this.intervalId = setInterval(() => {
			this.sendHeartbeat();
		}, this.config.interval);
	}

	/**
	 * Stoppt automatische Heartbeats
	 */
	stop(): void {
		if (!this.isRunning) {
			return;
		}

		this.isRunning = false;

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		console.log("🛑 Heartbeats gestoppt");
	}

	/**
	 * Prüft ob Heartbeats laufen
	 */
	isActive(): boolean {
		return this.isRunning;
	}

	/**
	 * Gibt die Anzahl aufeinanderfolgender Fehler zurück
	 */
	getConsecutiveErrors(): number {
		return this.consecutiveErrors;
	}

	/**
	 * Setzt die Fehleranzahl zurück
	 */
	resetErrorCount(): void {
		this.consecutiveErrors = 0;
	}

	/**
	 * Konfiguriert Prisma Client
	 */
	setPrismaClient(client: PrismaClientLike): void {
		this.prismaClient = client;
	}

	/**
	 * Konfiguriert Redis Client
	 */
	setRedisClient(client: RedisClientLike): void {
		this.redisClient = client;
	}

	/**
	 * Sendet einen Heartbeat mit Performance-Monitoring
	 * DIES IST DIE EINZIGE HEARTBEAT-FUNKTION
	 */
	async sendHeartbeat(
		customData?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		// Verhindere doppelte Heartbeats
		if (this.isSending) {
			return {
				success: false,
				error: "Heartbeat already in progress",
				timestamp: new Date().toISOString(),
			};
		}

		this.isSending = true;

		try {
			// Performance messen
			const startTime = performance.now();
			await new Promise((resolve) => setTimeout(resolve, 1)); // Simulierte Arbeit
			const serviceLatency = performance.now() - startTime;

			const performanceMetrics: PerformanceMetrics = {
				serviceLatency,
				timestamp: new Date().toISOString(),
			};

			// Prisma-Latenz messen
			if (this.prismaClient) {
				try {
					const prismaStart = performance.now();
					await this.prismaClient.$queryRaw`SELECT 1 as test`;
					performanceMetrics.prismaLatency = performance.now() - prismaStart;
				} catch (error) {
					console.warn("⚠️ Prisma Latenz-Messung fehlgeschlagen:", error);
				}
			}

			// Redis-Latenz messen
			if (this.redisClient) {
				try {
					const redisStart = performance.now();
					await this.redisClient.ping();
					performanceMetrics.redisLatency = performance.now() - redisStart;
				} catch (error) {
					console.warn("⚠️ Redis Latenz-Messung fehlgeschlagen:", error);
				}
			}

			// Heartbeat-Daten zusammenstellen
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

			// HTTP Request senden
			const response = await this.httpClient.request<HeartbeatResponse>(
				"/heartbeat",
				{
					method: "POST",
					body: JSON.stringify(heartbeatData),
				},
			);

			if (response.success) {
				this.consecutiveErrors = 0;
				console.log("💓 Heartbeat erfolgreich gesendet");
			} else {
				this.handleError(`API Error: ${response.error}`);
			}

			return response;
		} catch (error) {
			this.handleError(`Heartbeat failed: ${error}`);
			return {
				success: false,
				error: `Heartbeat failed: ${error}`,
				timestamp: new Date().toISOString(),
			};
		} finally {
			this.isSending = false;
		}
	}

	/**
	 * Behandelt Fehler
	 */
	private handleError(message: string): void {
		this.consecutiveErrors++;
		console.warn(
			`⚠️ Heartbeat Fehler (${this.consecutiveErrors}/${this.config.maxConsecutiveErrors}): ${message}`,
		);

		// Wenn zu viele Fehler, stoppe automatische Heartbeats
		if (this.consecutiveErrors >= (this.config.maxConsecutiveErrors || 5)) {
			console.error(
				"🚨 Zu viele aufeinanderfolgende Fehler - Stoppe automatische Heartbeats",
			);
			this.stop();
		}
	}

	/**
	 * Cleanup beim Zerstören
	 */
	destroy(): void {
		this.stop();
	}
}
