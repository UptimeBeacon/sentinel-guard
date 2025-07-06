/**
 * Beispiel für die Verwendung echter PrismaClient-Instanzen
 *
 * Zeigt die korrekte Integration von PrismaClient mit SentinelGuard
 */

import { SentinelGuard } from "../src/index.js";

/**
 * Einfaches Beispiel: Prisma Integration mit automatischen Heartbeats
 */

// Mock Prisma Client (ersetzen Sie durch echten PrismaClient)
const mockPrismaClient = {
	async $queryRaw(
		_query: TemplateStringsArray,
		..._values: unknown[]
	): Promise<unknown> {
		// Simuliere Datenbankabfrage
		await new Promise((resolve) =>
			setTimeout(resolve, Math.random() * 50 + 10),
		);
		return [{ test: 1 }];
	},
};

// Mock Redis Client (ersetzen Sie durch echten Redis Client)
const mockRedisClient = {
	async ping(): Promise<string> {
		// Simuliere Redis Ping
		await new Promise((resolve) =>
			setTimeout(resolve, Math.random() * 20 + 5),
		);
		return "PONG";
	},
};

async function main() {
	console.log("🚀 SentinelGuard Beispiel gestartet");

	// 1. SentinelGuard initialisieren
	const sentinel = new SentinelGuard({
		baseUrl: process.env.SENTINEL_BASE_URL || "http://localhost:3001",
		apiKey: process.env.SENTINEL_API_KEY || "test-api-key",
		monitorApiKey:
			process.env.SENTINEL_MONITOR_API_KEY || "test-monitor-api-key",
		timeout: 10000,
	});

	// 2. Monitoring starten (das ist alles was Sie brauchen!)
	sentinel.startMonitoring({
		interval: 30000, // 30 Sekunden
		maxConsecutiveErrors: 3,
	});

	console.log("✅ Monitoring gestartet - sendet alle 30 Sekunden Heartbeats");

	// 3. Optional: Datenbank-Clients für Latenz-Messung konfigurieren
	sentinel.setPrismaClient(mockPrismaClient);
	sentinel.setRedisClient(mockRedisClient);
	console.log("📊 Datenbank-Clients konfiguriert für Performance-Monitoring");

	// 4. Status überwachen
	setInterval(() => {
		const isActive = sentinel.isMonitoringActive();
		const errorCount = sentinel.getErrorCount();

		console.log(
			`📈 Status: ${isActive ? "Aktiv" : "Inaktiv"}, Fehler: ${errorCount}`,
		);

		if (errorCount > 0) {
			console.warn(`⚠️  ${errorCount} aufeinanderfolgende Fehler erkannt`);
		}
	}, 60000); // Jede Minute

	// 5. Graceful Shutdown
	process.on("SIGINT", () => {
		console.log("\n🛑 Shutdown-Signal empfangen...");
		sentinel.stopMonitoring();
		sentinel.destroy();
		console.log("👋 Monitoring beendet");
		process.exit(0);
	});

	console.log("✨ Beispiel läuft - Press Ctrl+C to stop");
}

// Fehlerbehandlung
main().catch((error) => {
	console.error("❌ Fehler:", error);
	process.exit(1);
});

/*
 * Echte Integration (Beispiel):
 *
 * import { PrismaClient } from '@prisma/client';
 * import { createClient } from 'redis';
 *
 * const prisma = new PrismaClient();
 * const redis = createClient({ url: process.env.REDIS_URL });
 * await redis.connect();
 *
 * sentinel.setPrismaClient(prisma);
 * sentinel.setRedisClient(redis);
 */
