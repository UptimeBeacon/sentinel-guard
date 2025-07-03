import { SentinelGuard } from "../src/index.js";

/**
 * Beispiel für die Heartbeat-Funktionalität
 */
async function heartbeatExample() {
	const sentinel = new SentinelGuard({
		baseUrl: "https://api.monitoring.example.com",
		apiKey: "your-api-key-here",
		timeout: 10000,
	});

	try {
		// Heartbeat-Manager initialisieren
		console.log("💓 Heartbeat-Manager initialisieren...");
		sentinel.initializeHeartbeat({
			interval: 30000, // 30 Sekunden
			autoStart: false, // Manuell starten
			maxConsecutiveErrors: 3,
		});

		// Manueller Heartbeat mit korrektem Backend-Format
		console.log("📡 Sende ersten Heartbeat...");
		const heartbeatResponse = await sentinel.sendHeartbeat({
			type: "CUSTOM",
			status: "ONLINE",
			latencyMs: 150,
			metadata: {
				version: "1.0.0",
				region: "eu-west",
				pid: process.pid,
				uptime: process.uptime(),
				memory: process.memoryUsage(),
			},
		});

		if (heartbeatResponse.success) {
			console.log("✅ Heartbeat gesendet:", heartbeatResponse.data);
		}

		// Status-Updates senden
		console.log("\n📊 Status-Updates senden...");

		// Service läuft normal
		await sentinel.sendStatus("ONLINE", { service: "all-systems-operational" });
		console.log('✅ Status "ONLINE" gesendet');

		// Simuliere high latency status
		await sentinel.sendStatus("HIGH_LATENCY", {
			latencyMs: 2500,
			reason: "database-slow",
		});
		console.log('⚠️  Status "HIGH_LATENCY" gesendet');

		// Automatische Heartbeats starten
		console.log("\n🚀 Starte automatische Heartbeats...");
		sentinel.startHeartbeat();
		console.log("✅ Automatische Heartbeats gestartet");

		// Status überwachen
		console.log("\n📊 Überwache Heartbeat-Status...");
		console.log(`Heartbeat aktiv: ${sentinel.isHeartbeatActive()}`);
		console.log(`Aktuelle Konfiguration:`, sentinel.getHeartbeatConfig());

		// Kurz warten um automatische Heartbeats zu demonstrieren
		console.log("\n⏳ Warte 10 Sekunden für automatische Heartbeats...");
		await new Promise((resolve) => setTimeout(resolve, 10000));

		// Heartbeat-Status nach Wartezeit
		console.log("\n📈 Heartbeat-Status nach Wartezeit:");
		console.log(`Fehleranzahl: ${sentinel.getHeartbeatErrorCount()}`);
		console.log(`Immer noch aktiv: ${sentinel.isHeartbeatActive()}`);

		// Heartbeat-Intervall ändern
		console.log("\n⚙️  Ändere Heartbeat-Intervall auf 60 Sekunden...");
		sentinel.setHeartbeatInterval(60000);
		console.log("✅ Intervall geändert");

		// Automatische Heartbeats stoppen
		console.log("\n⏹️  Stoppe automatische Heartbeats...");
		sentinel.stopHeartbeat();
		console.log("✅ Automatische Heartbeats gestoppt");

		// Finaler Status
		await sentinel.sendStatus("ONLINE", {
			message: "Service wird heruntergefahren",
		});
		console.log("✅ Finaler Status gesendet");
	} catch (error) {
		console.error("❌ Fehler:", error);

		// Versuche Fehler-Status zu senden
		try {
			await sentinel.sendStatus("ERROR", { error: String(error) });
		} catch (statusError) {
			console.error("❌ Konnte Fehler-Status nicht senden:", statusError);
		}
	} finally {
		// Ressourcen bereinigen
		console.log("\n🧹 Bereinige Ressourcen...");
		sentinel.destroy();
		console.log("✅ Ressourcen bereinigt");
	}
}

// Graceful shutdown
process.on("SIGINT", () => {
	console.log("\n🛑 Empfange SIGINT, beende Anwendung...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("\n🛑 Empfange SIGTERM, beende Anwendung...");
	process.exit(0);
});

// Ausführen falls direkt aufgerufen
if (import.meta.main) {
	heartbeatExample();
}
