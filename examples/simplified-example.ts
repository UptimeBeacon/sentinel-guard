import { SentinelGuard } from '../src/index.js';

/**
 * Vereinfachtes Beispiel - So sollte Ihr Code aussehen
 */

async function main() {
	// 1. SentinelGuard initialisieren
	const sentinel = new SentinelGuard({
		apiKey: process.env.SENTINEL_API_KEY as string,
		baseUrl: process.env.SENTINEL_API_URL as string,
		monitorApiKey: process.env.SENTINEL_MONITOR_API_KEY as string,
		timeout: 10000,
	});

	// 2. Automatisches Monitoring starten
	sentinel.startMonitoring({
		interval: 30000, // Alle 30 Sekunden
		maxConsecutiveErrors: 5,
	});

	console.log('✅ Monitoring gestartet');
	console.log('Status:', sentinel.isMonitoringActive());

	// 3. Datenbank-Clients konfigurieren (optional für Latenz-Messung)
	// sentinel.setPrismaClient(prismaClient);
	// sentinel.setRedisClient(redisClient);

	// 4. Optional: Einzelne Heartbeats senden
	try {
		const response = await sentinel.sendHeartbeat({
			status: 'ONLINE',
			metadata: {
				service: 'my-app',
				version: '1.0.0',
			},
		});

		if (response.success) {
			console.log('✅ Manueller Heartbeat gesendet');
		} else {
			console.log('❌ Heartbeat Fehler:', response.error);
		}
	} catch (error) {
		console.error('❌ Heartbeat Exception:', error);
	}

	// Das wars! Das System sendet jetzt automatisch alle 30 Sekunden Heartbeats

	// 5. Graceful shutdown
	process.on('SIGINT', () => {
		console.log('🛑 Stopping monitoring...');
		sentinel.stopMonitoring();
		process.exit(0);
	});
}

main().catch(console.error);
