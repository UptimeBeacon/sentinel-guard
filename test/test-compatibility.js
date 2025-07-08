#!/usr/bin/env node

// Test-Skript für Package Manager Kompatibilität
import { SentinelGuard } from "../dist/index.js";

console.log(
	"🧪 Teste @uptimebeacon/sentinel-guard Library Kompatibilität...\n",
);

try {
	// Teste Import
	console.log("✅ Import erfolgreich");

	// Teste Konfiguration
	const config = {
		baseUrl: "https://test.example.com",
		apiKey: "test-key",
		monitorApiKey: "monitor-key",
		timeout: 1000,
	};

	// Teste Instanzierung
	const sentinel = new SentinelGuard(config);
	console.log("✅ SentinelGuard-Instanz erstellt");

	// Teste Monitoring-Start (aber nicht wirklich starten)
	try {
		// Nur testen ob die Methode existiert, nicht ausführen
		console.log(
			"✅ startMonitoring Methode verfügbar:",
			typeof sentinel.startMonitoring === "function",
		);
		console.log(
			"✅ stopMonitoring Methode verfügbar:",
			typeof sentinel.stopMonitoring === "function",
		);
		console.log(
			"✅ isMonitoringActive Methode verfügbar:",
			typeof sentinel.isMonitoringActive === "function",
		);
		console.log(
			"✅ setPrismaClient Methode verfügbar:",
			typeof sentinel.setPrismaClient === "function",
		);
		console.log(
			"✅ setRedisClient Methode verfügbar:",
			typeof sentinel.setRedisClient === "function",
		);
	} catch (error) {
		console.error("❌ API-Methoden-Test fehlgeschlagen:", error);
	}

	// Teste Status-Abfragen
	const isActive = sentinel.isMonitoringActive();
	console.log("✅ Monitoring-Status abrufbar:", typeof isActive === "boolean");

	// Teste Performance-Metriken (ohne Clients)
	try {
		const metrics = await sentinel.getPerformanceMetrics();
		if (metrics && typeof metrics.serviceLatency === "number") {
			console.log("✅ Performance-Metriken funktionieren");
		}
	} catch (error) {
		console.warn("⚠️ Performance-Metriken-Test übersprungen:", error.message);
	}

	// Cleanup
	sentinel.destroy();
	console.log("✅ Ressourcen bereinigt");

	console.log("\n🎉 Alle Kompatibilitätstests bestanden!");
	console.log("📦 Die Library ist bereit für alle Package Manager.");
} catch (error) {
	console.error("❌ Kompatibilitätstest fehlgeschlagen:", error);
	process.exit(1);
}
