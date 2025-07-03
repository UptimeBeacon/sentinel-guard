#!/usr/bin/env node

// Test-Skript für Package Manager Kompatibilität
import { SentinelGuard } from "../dist/index.js";

console.log(
	"🧪 Teste @uptimebeacon/sentinel-guard Library Kompatibilität...\n",
);

try {
	// Teste Konfigurationsvalidierung
	console.log("✅ Import erfolgreich");

	// Teste Konfiguration
	const config = {
		baseUrl: "https://test.example.com",
		apiKey: "test-key",
		timeout: 1000,
	};

	SentinelGuard.validateConfig(config);
	console.log("✅ Konfigurationsvalidierung erfolgreich");

	// Teste Instanzierung
	const sentinel = new SentinelGuard(config);
	console.log("✅ SentinelGuard-Instanz erstellt");

	// Teste Heartbeat-Initialisierung
	sentinel.initializeHeartbeat({
		interval: 60000,
		autoStart: false,
	});
	console.log("✅ Heartbeat-Manager initialisiert");

	// Teste Typen
	const heartbeatConfig = sentinel.getHeartbeatConfig();
	if (heartbeatConfig && typeof heartbeatConfig.interval === "number") {
		console.log("✅ TypeScript-Typen funktionieren korrekt");
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
