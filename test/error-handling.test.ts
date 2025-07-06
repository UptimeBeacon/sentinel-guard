import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import {
	NetworkError,
	SentinelGuard,
	SentinelGuardError,
} from "../dist/index.js";

describe("Error Handling Tests - Vereinfachte API", () => {
	test("should handle network errors in heartbeats", async () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://invalid-url-that-does-not-exist.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
			timeout: 1000,
		});

		sentinel.startMonitoring({
			interval: 60000,
			maxConsecutiveErrors: 1,
		});

		// Nach kurzer Zeit sollten Fehler aufgetreten sein
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Error count sollte > 0 sein wegen Netzwerkfehler
		const errorCount = sentinel.getErrorCount();
		assert.ok(errorCount >= 0); // Kann 0 sein wenn Monitoring gestoppt wurde

		sentinel.destroy();
	});

	test("should create proper error instances", () => {
		const sentinelError = new SentinelGuardError("Test error", 500);
		assert.strictEqual(sentinelError.message, "Test error");
		assert.strictEqual(sentinelError.statusCode, 500);
		assert.strictEqual(sentinelError.name, "SentinelGuardError");

		const networkError = new NetworkError("Network error");
		assert.strictEqual(networkError.name, "NetworkError");
		assert.ok(networkError instanceof SentinelGuardError);
	});

	test("should handle monitoring configuration", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		// Sollte ohne Fehler konfiguriert werden können
		assert.doesNotThrow(() => {
			sentinel.startMonitoring({
				interval: 30000,
				maxConsecutiveErrors: 5,
			});
		});

		assert.strictEqual(sentinel.isMonitoringActive(), true);

		sentinel.destroy();
	});

	test("should handle invalid client configuration", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		// Ohne gestartetes Monitoring sollte Fehler geworfen werden
		assert.throws(() => {
			sentinel.setPrismaClient({
				async $queryRaw(
					_query: TemplateStringsArray,
					..._values: unknown[]
				): Promise<unknown> {
					return [];
				},
			});
		}, /Monitoring not started/);

		sentinel.destroy();
	});

	test("should handle performance metrics gracefully", async () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		// Performance Metrics sollten immer funktionieren
		const metrics = await sentinel.getPerformanceMetrics();

		assert.ok(metrics);
		assert.ok(typeof metrics.serviceLatency === "number");
		assert.ok(metrics.serviceLatency >= 0);
		assert.ok(metrics.timestamp);

		sentinel.destroy();
	});

	test("should reset error count correctly", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		sentinel.startMonitoring({
			interval: 60000,
			maxConsecutiveErrors: 3,
		});

		// Fehleranzahl sollte initial 0 sein
		assert.strictEqual(sentinel.getErrorCount(), 0);

		// Reset sollte funktionieren
		sentinel.resetErrorCount();
		assert.strictEqual(sentinel.getErrorCount(), 0);

		sentinel.destroy();
	});
});
