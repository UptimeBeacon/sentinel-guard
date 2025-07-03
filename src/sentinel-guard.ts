import { HeartbeatManager } from "./heartbeat-manager.js";

import { HttpClient } from "./http-client.js";
import { MonitorManager } from "./monitor-manager.js";
import type {
	ApiResponse,
	CreateMonitorRequest,
	HeartbeatConfig,
	HeartbeatData,
	HeartbeatResponse,
	Monitor,
	SentinelGuardConfig,
	UpdateMonitorRequest,
} from "./types.js";

/**
 * Hauptklasse der SentinelGuard Library
 * Bietet eine typsichere API für Monitoring und Heartbeat-Funktionalität
 */
export class SentinelGuard {
	private readonly httpClient: HttpClient;
	private readonly monitorManager: MonitorManager;
	private heartbeatManager: HeartbeatManager | null = null;

	constructor(config: SentinelGuardConfig) {
		this.httpClient = new HttpClient(config);
		this.monitorManager = new MonitorManager(this.httpClient);
	}

	// ============================================================================
	// Monitor Management
	// ============================================================================

	/**
	 * Erstellt einen neuen Monitor
	 */
	async createMonitor(
		request: CreateMonitorRequest,
	): Promise<ApiResponse<Monitor>> {
		return this.monitorManager.createMonitor(request);
	}

	/**
	 * Ruft alle Monitore ab
	 */
	async getMonitors(): Promise<ApiResponse<Monitor[]>> {
		return this.monitorManager.getMonitors();
	}

	/**
	 * Ruft einen spezifischen Monitor ab
	 */
	async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.monitorManager.getMonitor(id);
	}

	/**
	 * Aktualisiert einen Monitor
	 */
	async updateMonitor(
		id: string,
		request: UpdateMonitorRequest,
	): Promise<ApiResponse<Monitor>> {
		return this.monitorManager.updateMonitor(id, request);
	}

	/**
	 * Löscht einen Monitor
	 */
	async deleteMonitor(id: string): Promise<ApiResponse<void>> {
		return this.monitorManager.deleteMonitor(id);
	}

	/**
	 * Pausiert einen Monitor
	 */
	async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.monitorManager.pauseMonitor(id);
	}

	/**
	 * Aktiviert einen Monitor
	 */
	async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.monitorManager.resumeMonitor(id);
	}

	/**
	 * Ruft die Historie eines Monitors ab
	 */
	async getMonitorHistory(
		id: string,
		limit?: number,
	): Promise<ApiResponse<unknown[]>> {
		return this.monitorManager.getMonitorHistory(id, limit);
	}

	/**
	 * Ruft Statistiken für einen Monitor ab
	 */
	async getMonitorStats(id: string): Promise<ApiResponse<unknown>> {
		return this.monitorManager.getMonitorStats(id);
	}

	// ============================================================================
	// Heartbeat Management
	// ============================================================================

	/**
	 * Initialisiert den Heartbeat-Manager
	 */
	initializeHeartbeat(config: HeartbeatConfig): void {
		if (this.heartbeatManager) {
			this.heartbeatManager.destroy();
		}
		this.heartbeatManager = new HeartbeatManager(this.httpClient, config);
	}

	/**
	 * Sendet einen einzelnen Heartbeat
	 */
	async sendHeartbeat(
		data?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		return this.heartbeatManager.sendHeartbeat(data);
	}

	/**
	 * Startet die automatischen Heartbeats
	 */
	startHeartbeat(): void {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		this.heartbeatManager.start();
	}

	/**
	 * Stoppt die automatischen Heartbeats
	 */
	stopHeartbeat(): void {
		if (!this.heartbeatManager) {
			return;
		}
		this.heartbeatManager.stop();
	}

	/**
	 * Überprüft ob die automatischen Heartbeats laufen
	 */
	isHeartbeatActive(): boolean {
		return this.heartbeatManager?.isActive() ?? false;
	}

	/**
	 * Ruft die Anzahl der aufeinanderfolgenden Heartbeat-Fehler ab
	 */
	getHeartbeatErrorCount(): number {
		return this.heartbeatManager?.getConsecutiveErrors() ?? 0;
	}

	/**
	 * Setzt die Anzahl der aufeinanderfolgenden Heartbeat-Fehler zurück
	 */
	resetHeartbeatErrorCount(): void {
		this.heartbeatManager?.resetErrorCount();
	}

	/**
	 * Ändert das Heartbeat-Intervall
	 */
	setHeartbeatInterval(interval: number): void {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		this.heartbeatManager.setInterval(interval);
	}

	/**
	 * Ruft die aktuelle Heartbeat-Konfiguration ab
	 */
	getHeartbeatConfig(): Readonly<HeartbeatConfig> | null {
		return this.heartbeatManager?.getConfig() ?? null;
	}

	/**
	 * Sendet einen Status-Update
	 */
	async sendStatus(
		status: "ONLINE" | "OFFLINE" | "HIGH_LATENCY" | "ERROR",
		metadata?: Record<string, unknown>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		return this.heartbeatManager.sendStatus(status, metadata);
	}

	/**
	 * Setzt die Standard-Heartbeat-Daten für automatische Heartbeats
	 */
	setDefaultHeartbeatData(data: Partial<HeartbeatData>): void {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		this.heartbeatManager.setDefaultHeartbeatData(data);
	}

	/**
	 * Ruft die aktuellen Standard-Heartbeat-Daten ab
	 */
	getDefaultHeartbeatData(): Readonly<Partial<HeartbeatData>> | null {
		if (!this.heartbeatManager) {
			return null;
		}
		return this.heartbeatManager.getDefaultHeartbeatData();
	}

	/**
	 * Aktualisiert die Standard-Heartbeat-Daten (merged mit bestehenden)
	 */
	updateDefaultHeartbeatData(data: Partial<HeartbeatData>): void {
		if (!this.heartbeatManager) {
			throw new Error(
				"Heartbeat manager not initialized. Call initializeHeartbeat() first.",
			);
		}
		this.heartbeatManager.updateDefaultHeartbeatData(data);
	}

	// ============================================================================
	// Utility Methods
	// ============================================================================

	/**
	 * Bereinigt alle Ressourcen
	 */
	destroy(): void {
		this.heartbeatManager?.destroy();
		this.heartbeatManager = null;
	}

	/**
	 * Erstellt eine neue SentinelGuard-Instanz mit erweiterten Optionen
	 */
	static create(config: SentinelGuardConfig): SentinelGuard {
		return new SentinelGuard(config);
	}

	/**
	 * Validiert eine Konfiguration
	 */
	static validateConfig(config: SentinelGuardConfig): boolean {
		if (!config.baseUrl || typeof config.baseUrl !== "string") {
			throw new Error("baseUrl is required and must be a string");
		}

		if (!config.apiKey || typeof config.apiKey !== "string") {
			throw new Error("apiKey is required and must be a string");
		}

		if (
			config.timeout !== undefined &&
			(typeof config.timeout !== "number" || config.timeout <= 0)
		) {
			throw new Error("timeout must be a positive number");
		}

		if (config.retryConfig) {
			const { maxRetries, baseDelay, backoffMultiplier } = config.retryConfig;

			if (typeof maxRetries !== "number" || maxRetries < 0) {
				throw new Error("retryConfig.maxRetries must be a non-negative number");
			}

			if (typeof baseDelay !== "number" || baseDelay <= 0) {
				throw new Error("retryConfig.baseDelay must be a positive number");
			}

			if (typeof backoffMultiplier !== "number" || backoffMultiplier <= 0) {
				throw new Error(
					"retryConfig.backoffMultiplier must be a positive number",
				);
			}
		}

		return true;
	}
}
