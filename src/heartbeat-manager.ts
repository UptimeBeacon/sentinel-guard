import type { HttpClient } from "./http-client.js";
import type {
	ApiResponse,
	HeartbeatConfig,
	HeartbeatData,
	HeartbeatResponse,
} from "./types.js";

/**
 * Heartbeat-Manager für die Verwaltung von regelmäßigen Heartbeats
 */
export class HeartbeatManager {
	private intervalId: NodeJS.Timeout | null = null;
	private consecutiveErrors = 0;
	private isRunning = false;
	private defaultHeartbeatData: Partial<HeartbeatData> = {};

	constructor(
		private readonly httpClient: HttpClient,
		private readonly config: HeartbeatConfig,
	) {
		if (config.autoStart) {
			this.start();
		}
	}

	/**
	 * Sendet einen einzelnen Heartbeat
	 */
	async sendHeartbeat(
		data?: Partial<HeartbeatData>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		const heartbeatData: HeartbeatData = {
			type: "CUSTOM",
			status: "ONLINE",
			...data,
		};

		try {
			const response = await this.httpClient.post<HeartbeatResponse>(
				"/heartbeat",
				heartbeatData,
			);
			this.consecutiveErrors = 0; // Reset error counter on success
			return response;
		} catch (error) {
			this.consecutiveErrors++;
			throw error;
		}
	}

	/**
	 * Startet die automatischen Heartbeats
	 */
	start(): void {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		this.consecutiveErrors = 0;

		this.intervalId = setInterval(async () => {
			try {
				// Verwende Standard-Heartbeat-Daten für automatische Heartbeats
				await this.sendHeartbeat(this.defaultHeartbeatData);
			} catch (error) {
				console.error("Heartbeat failed:", error);

				// Stoppe automatische Heartbeats nach zu vielen aufeinanderfolgenden Fehlern
				if (
					this.config.maxConsecutiveErrors &&
					this.consecutiveErrors >= this.config.maxConsecutiveErrors
				) {
					console.error(
						`Stopping heartbeats after ${this.consecutiveErrors} consecutive errors`,
					);
					this.stop();
				}
			}
		}, this.config.interval);
	}

	/**
	 * Stoppt die automatischen Heartbeats
	 */
	stop(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.isRunning = false;
	}

	/**
	 * Überprüft ob die automatischen Heartbeats laufen
	 */
	isActive(): boolean {
		return this.isRunning;
	}

	/**
	 * Ruft die Anzahl der aufeinanderfolgenden Fehler ab
	 */
	getConsecutiveErrors(): number {
		return this.consecutiveErrors;
	}

	/**
	 * Setzt die Anzahl der aufeinanderfolgenden Fehler zurück
	 */
	resetErrorCount(): void {
		this.consecutiveErrors = 0;
	}

	/**
	 * Ändert das Heartbeat-Intervall
	 */
	setInterval(interval: number): void {
		const wasRunning = this.isRunning;

		if (wasRunning) {
			this.stop();
		}

		this.config.interval = interval;

		if (wasRunning) {
			this.start();
		}
	}

	/**
	 * Ruft die aktuelle Konfiguration ab
	 */
	getConfig(): Readonly<HeartbeatConfig> {
		return { ...this.config };
	}

	/**
	 * Sendet einen Status-Update
	 */
	async sendStatus(
		status: "ONLINE" | "OFFLINE" | "HIGH_LATENCY" | "ERROR",
		metadata?: Record<string, unknown>,
	): Promise<ApiResponse<HeartbeatResponse>> {
		return this.sendHeartbeat({ status, metadata });
	}

	/**
	 * Bereinigt Ressourcen beim Beenden
	 */
	destroy(): void {
		this.stop();
	}

	/**
	 * Setzt die Standard-Heartbeat-Daten für automatische Heartbeats
	 */
	setDefaultHeartbeatData(data: Partial<HeartbeatData>): void {
		this.defaultHeartbeatData = { ...data };
	}

	/**
	 * Ruft die aktuellen Standard-Heartbeat-Daten ab
	 */
	getDefaultHeartbeatData(): Readonly<Partial<HeartbeatData>> {
		return { ...this.defaultHeartbeatData };
	}

	/**
	 * Aktualisiert die Standard-Heartbeat-Daten (merged mit bestehenden)
	 */
	updateDefaultHeartbeatData(data: Partial<HeartbeatData>): void {
		this.defaultHeartbeatData = { ...this.defaultHeartbeatData, ...data };
	}
}
