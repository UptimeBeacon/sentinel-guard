import { SentinelGuard } from "./src/index.js";

async function example() {
	try {
		// Konfiguration der Library
		const sentinelGuard = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "your-api-key-here",
			timeout: 15000,
			retryConfig: {
				maxRetries: 3,
				baseDelay: 1000,
				backoffMultiplier: 2,
			},
		});

		// Monitor erstellen
		const monitorResponse = await sentinelGuard.createMonitor({
			name: "My Website",
			url: "https://example.com",
			interval: 300, // 5 Minuten
			timeout: 30,
			metadata: {
				environment: "production",
			},
		});

		if (monitorResponse.success) {
			console.log("Monitor erstellt:", monitorResponse.data);

			// Heartbeat konfigurieren
			sentinelGuard.initializeHeartbeat({
				interval: 60000, // 1 Minute
				autoStart: true,
				maxConsecutiveErrors: 5,
			});

			// Manueller Heartbeat
			const heartbeatResponse = await sentinelGuard.sendHeartbeat({
				type: "CUSTOM",
				status: "ONLINE",
				metadata: {
					version: "1.0.0",
					uptime: process.uptime(),
				},
			});

			console.log("Heartbeat gesendet:", heartbeatResponse);

			// Alle Monitore abrufen
			const monitorsResponse = await sentinelGuard.getMonitors();
			if (monitorsResponse.success) {
				console.log("Verfügbare Monitore:", monitorsResponse.data);
			}
		}

		// Ressourcen bereinigen
		sentinelGuard.destroy();
	} catch (error) {
		console.error("Fehler:", error);
	}
}

// Nur ausführen wenn direkt aufgerufen
if (import.meta.main) {
	example();
}
