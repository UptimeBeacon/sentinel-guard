import { HeartbeatManager } from "./heartbeat-manager.js";
import { HttpClient } from "./http-client.js";
import type {
	ApiResponse,
	HeartbeatConfig,
	HeartbeatData,
	HeartbeatResponse,
	PerformanceMetrics,
	PrismaClientLike,
	RedisClientLike,
	SentinelGuardConfig,
} from "./types.js";

/**
 * Vereinfachte SentinelGuard Library
 *
 * Funktionen:
 * - Automatische Heartbeats mit konfigurierbarem Intervall
 * - Performance-Monitoring (Service, Prisma, Redis)
 * - Robuste Fehlerbehandlung
 */
export class SentinelGuard {
	private readonly httpClient: HttpClient;
	private heartbeatManager: HeartbeatManager | null = null;

	constructor(config: SentinelGuardConfig) {
		this.httpClient = new HttpClient(config);
	}

	/**
	 * Startet automatische Heartbeats mit Performance-Monitoring
	 * Dies ist die einzige Methode, die Sie benötigen!
	 */
	startMonitoring(config: HeartbeatConfig): void {
		// Cleanup falls bereits läuft
		if (this.heartbeatManager) {
			this.heartbeatManager.destroy();
		}

		// Neuen HeartbeatManager erstellen und starten
		this.heartbeatManager = new HeartbeatManager(this.httpClient, config);
		this.heartbeatManager.start();
	}

	/**
	 * Stoppt das Monitoring
	 */
	stopMonitoring(): void {
		if (this.heartbeatManager) {
			this.heartbeatManager.stop();
		}
	}

	/**
	 * Konfiguriert Prisma Client für Datenbank-Latenz-Messung
	 */
	setPrismaClient(client: PrismaClientLike): void {
		if (!this.heartbeatManager) {
			throw new Error("Monitoring not started. Call startMonitoring() first.");
		}
		this.heartbeatManager.setPrismaClient(client);
	}

	/**
	 * Konfiguriert Redis Client für Cache-Latenz-Messung
	 */
	setRedisClient(client: RedisClientLike): void {
		if (!this.heartbeatManager) {
			throw new Error("Monitoring not started. Call startMonitoring() first.");
		}
		this.heartbeatManager.setRedisClient(client);
	}

	/**
	 * Prüft ob das Monitoring läuft
	 */
	isMonitoringActive(): boolean {
		return this.heartbeatManager?.isActive() ?? false;
	}

	/**
	 * Gibt die Anzahl aufeinanderfolgender Fehler zurück
	 */
	getErrorCount(): number {
		return this.heartbeatManager?.getConsecutiveErrors() ?? 0;
	}

	/**
	 * Setzt die Fehleranzahl zurück (für Recovery nach Problemen)
	 */
	resetErrorCount(): void {
		this.heartbeatManager?.resetErrorCount();
	}

	/**
	 * Misst aktuelle Performance-Metriken (für manuelle Checks)
	 */
	async getPerformanceMetrics(): Promise<PerformanceMetrics> {
		const startTime = performance.now();

		// Kleine simulierte Arbeit für Service-Latenz
		await new Promise((resolve) => setTimeout(resolve, 1));
		const serviceLatency = performance.now() - startTime;

		const metrics: PerformanceMetrics = {
			serviceLatency,
			timestamp: new Date().toISOString(),
		};

		// Prisma-Latenz messen (falls konfiguriert)
		if (this.heartbeatManager) {
			// Die Latenz-Messung erfolgt intern im HeartbeatManager
			// Hier geben wir nur die Service-Latenz zurück
		}

		return metrics;
	}

	/**
	 * Sendet einen einzelnen Heartbeat (für manuelle Checks)
	 */
	async sendHeartbeat(
		data?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		if (!this.heartbeatManager) {
			throw new Error("Monitoring not started. Call startMonitoring() first.");
		}
		return this.heartbeatManager.sendHeartbeat(data);
	}

	/**
	 * Cleanup beim Beenden der Anwendung
	 */
	destroy(): void {
		if (this.heartbeatManager) {
			this.heartbeatManager.destroy();
			this.heartbeatManager = null;
		}
	}
}
