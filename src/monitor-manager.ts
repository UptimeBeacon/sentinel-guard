import type { HttpClient } from "./http-client.js";
import type {
	ApiResponse,
	CreateMonitorRequest,
	Monitor,
	UpdateMonitorRequest,
} from "./types.js";

/**
 * Monitor-Manager für die Verwaltung von Überwachungsmonitoren
 */
export class MonitorManager {
	constructor(private readonly httpClient: HttpClient) {}

	/**
	 * Erstellt einen neuen Monitor
	 */
	async createMonitor(
		request: CreateMonitorRequest,
	): Promise<ApiResponse<Monitor>> {
		return this.httpClient.post<Monitor>("/monitors", request);
	}

	/**
	 * Ruft alle Monitore ab
	 */
	async getMonitors(): Promise<ApiResponse<Monitor[]>> {
		return this.httpClient.get<Monitor[]>("/monitors");
	}

	/**
	 * Ruft einen spezifischen Monitor ab
	 */
	async getMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.httpClient.get<Monitor>(`/monitors/${id}`);
	}

	/**
	 * Aktualisiert einen Monitor
	 */
	async updateMonitor(
		id: string,
		request: UpdateMonitorRequest,
	): Promise<ApiResponse<Monitor>> {
		return this.httpClient.put<Monitor>(`/monitors/${id}`, request);
	}

	/**
	 * Löscht einen Monitor
	 */
	async deleteMonitor(id: string): Promise<ApiResponse<void>> {
		return this.httpClient.delete<void>(`/monitors/${id}`);
	}

	/**
	 * Pausiert einen Monitor
	 */
	async pauseMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.updateMonitor(id, { status: "paused" });
	}

	/**
	 * Aktiviert einen Monitor
	 */
	async resumeMonitor(id: string): Promise<ApiResponse<Monitor>> {
		return this.updateMonitor(id, { status: "active" });
	}

	/**
	 * Ruft die Historie eines Monitors ab
	 */
	async getMonitorHistory(
		id: string,
		limit?: number,
	): Promise<ApiResponse<unknown[]>> {
		const endpoint = limit
			? `/monitors/${id}/history?limit=${limit}`
			: `/monitors/${id}/history`;
		return this.httpClient.get<unknown[]>(endpoint);
	}

	/**
	 * Ruft Statistiken für einen Monitor ab
	 */
	async getMonitorStats(id: string): Promise<ApiResponse<unknown>> {
		return this.httpClient.get<unknown>(`/monitors/${id}/stats`);
	}
}
