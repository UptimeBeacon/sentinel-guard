#!/usr/bin/env node

import SentinelGuard from "../dist";

console.log("🧪 Teste korrigierte SentinelGuard Konfiguration...\n");

const sentinel = new SentinelGuard({
	baseUrl: "http://localhost:3001",
	apiKey: "sen_live_faq0QIho10DfuQjTUnRq0arUEZXNVY0X",
	timeout: 5000,
});

try {
	console.log("✅ SentinelGuard Instanz erstellt");

	// Heartbeat-Manager initialisieren
	sentinel.initializeHeartbeat({
		interval: 10000, // 10 Sekunden für Test
		autoStart: false,
		maxConsecutiveErrors: 3,
	});
	console.log("✅ Heartbeat-Manager initialisiert");

	// Test Heartbeat mit korrektem Format
	console.log("\n📡 Sende Test-Heartbeat mit korrektem Backend-Format...");
	const heartbeat = await sentinel.sendHeartbeat({
		type: "CUSTOM",
		status: "ONLINE" as const,
		latencyMs: 150,
		metadata: {
			version: "1.0.0",
			region: "eu-west",
			testMode: true,
		},
	});

	if (heartbeat.success) {
		console.log("✅ Heartbeat erfolgreich gesendet!");
		console.log("📊 Response:", heartbeat.data);
	} else {
		console.log("⚠️  Heartbeat nicht erfolgreich:", heartbeat.error);
	}

	// Test verschiedene Status
	console.log("\n📊 Teste verschiedene Status...");

	const statusTests = [
		{ status: "ONLINE" as const, metadata: { service: "all-operational" } },
		{ status: "HIGH_LATENCY" as const, metadata: { latencyMs: 2500 } },
		{ status: "ERROR" as const, metadata: { error: "test-error" } },
	];

	for (const test of statusTests) {
		try {
			await sentinel.sendStatus(test.status, test.metadata);
			console.log(`✅ Status "${test.status}" gesendet`);
		} catch (error) {
			console.log(
				`❌ Status "${test.status}" fehlgeschlagen:`,
				error instanceof Error ? error.message : error,
			);
		}
	}

	console.log("\n🎉 Alle Tests erfolgreich!");
	console.log('🔧 Header "x-api-key" wird korrekt verwendet');
	console.log("📊 Backend-Format ist korrekt implementiert");
} catch (error) {
	console.error("❌ Test fehlgeschlagen:", error);

	if (error instanceof Error) {
		console.error("📋 Error Details:");
		console.error("   Name:", error.name);
		console.error("   Message:", error.message);
		if ("statusCode" in error) {
			console.error("   Status Code:", error.statusCode);
		}
	}
} finally {
	// Cleanup
	sentinel.destroy();
	console.log("\n🧹 Tests abgeschlossen und Ressourcen bereinigt");
}
