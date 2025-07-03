import {
	AuthenticationError,
	NetworkError,
	RateLimitError,
	SentinelGuard,
	type SentinelGuardConfig,
	SentinelGuardError,
} from "../src/index.js";

/**
 * Beispiel für erweiterte Fehlerbehandlung und Retry-Logik
 */
async function errorHandlingExample() {
	// Konfiguration mit erweiterten Retry-Einstellungen
	const sentinel = new SentinelGuard({
		baseUrl: "https://api.monitoring.example.com",
		apiKey: "potentially-invalid-key", // Absichtlich möglicherweise ungültig
		timeout: 5000,
		retryConfig: {
			maxRetries: 5,
			baseDelay: 1000,
			backoffMultiplier: 2,
		},
	});

	console.log("🔧 Teste erweiterte Fehlerbehandlung...\n");

	// Test verschiedener Fehlerszenarien
	const testCases = [
		{
			name: "Monitor mit ungültiger URL erstellen",
			action: async () => {
				return await sentinel.createMonitor({
					name: "Invalid URL Test",
					url: "invalid-url",
					interval: 300,
				});
			},
		},
		{
			name: "Monitor mit leerem Namen erstellen",
			action: async () => {
				return await sentinel.createMonitor({
					name: "",
					url: "https://example.com",
					interval: 300,
				});
			},
		},
		{
			name: "Nicht existierenden Monitor abrufen",
			action: async () => {
				return await sentinel.getMonitor("non-existent-id");
			},
		},
		{
			name: "Heartbeat senden",
			action: async () => {
				sentinel.initializeHeartbeat({
					interval: 60000,
					autoStart: false,
				});
				return await sentinel.sendHeartbeat({
					status: "ONLINE",
				});
			},
		},
	];

	for (const testCase of testCases) {
		console.log(`🧪 Test: ${testCase.name}`);

		try {
			const result = await testCase.action();

			if (result.success) {
				console.log("✅ Erfolgreich:", result.data);
			} else {
				console.log("⚠️  Nicht erfolgreich:", result.error);
			}
		} catch (error) {
			// Spezifische Fehlerbehandlung
			if (error instanceof AuthenticationError) {
				console.log("🔐 Authentifizierungsfehler:", error.message);
				console.log("   → Überprüfen Sie Ihren API-Schlüssel");
			} else if (error instanceof RateLimitError) {
				console.log("⏱️  Rate-Limit-Fehler:", error.message);
				console.log("   → Versuchen Sie es später erneut");
			} else if (error instanceof NetworkError) {
				console.log("🌐 Netzwerkfehler:", error.message);
				console.log("   → Überprüfen Sie Ihre Internetverbindung");
				if (error.originalError) {
					console.log("   → Original-Fehler:", error.originalError.message);
				}
			} else if (error instanceof SentinelGuardError) {
				console.log("⚠️  SentinelGuard-Fehler:", error.message);
				if (error.statusCode) {
					console.log("   → HTTP-Status:", error.statusCode);
				}
				if (error.response) {
					console.log("   → Antwort:", error.response);
				}
			} else {
				console.log("❌ Unbekannter Fehler:", error);
			}
		}

		console.log(""); // Leerzeile für bessere Lesbarkeit
	}

	// Teste Konfigurationsvalidierung
	console.log("🔧 Teste Konfigurationsvalidierung...\n");

	const invalidConfigs = [
		{
			name: "Fehlende baseUrl",
			config: { apiKey: "test" },
		},
		{
			name: "Fehlender apiKey",
			config: { baseUrl: "https://api.example.com" },
		},
		{
			name: "Ungültiger timeout",
			config: {
				baseUrl: "https://api.example.com",
				apiKey: "test",
				timeout: -1,
			},
		},
		{
			name: "Ungültige retry-Konfiguration",
			config: {
				baseUrl: "https://api.example.com",
				apiKey: "test",
				retryConfig: {
					maxRetries: -1,
					baseDelay: 0,
					backoffMultiplier: 0,
				},
			},
		},
	];

	for (const testConfig of invalidConfigs) {
		console.log(`🧪 Teste: ${testConfig.name}`);

		try {
			SentinelGuard.validateConfig(testConfig.config as SentinelGuardConfig);
			console.log("❌ Validierung sollte fehlschlagen");
		} catch (error) {
			console.log(
				"✅ Validierungsfehler erwartet:",
				error instanceof Error ? error.message : error,
			);
		}

		console.log("");
	}

	// Teste Retry-Verhalten mit simulierter Netzwerklatenz
	console.log("🔄 Teste Retry-Verhalten...\n");

	const retryTestSentinel = new SentinelGuard({
		baseUrl: "https://httpstat.us", // Service für HTTP-Status-Tests
		apiKey: "test-key",
		timeout: 2000,
		retryConfig: {
			maxRetries: 3,
			baseDelay: 500,
			backoffMultiplier: 2,
		},
	});

	try {
		// Teste mit 500 Internal Server Error (sollte Retry auslösen)
		console.log("🧪 Teste Server-Fehler (500) mit Retry...");
		await retryTestSentinel.getMonitors();
	} catch (error) {
		console.log(
			"✅ Retry-Verhalten getestet:",
			error instanceof Error ? error.message : error,
		);
	}

	console.log("\n🧹 Bereinige Ressourcen...");
	sentinel.destroy();
	retryTestSentinel.destroy();
	console.log("✅ Fehlerbehandlungs-Tests abgeschlossen");
}

// Ausführen falls direkt aufgerufen
if (import.meta.main) {
	errorHandlingExample();
}
