import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { SentinelGuard } from "../dist/index.js";

describe("SentinelGuard Tests", () => {
	test("should create instance with valid config", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		assert.ok(sentinel);
		sentinel.destroy();
	});

	test("should start and stop monitoring", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		// Monitoring sollte initial nicht laufen
		assert.strictEqual(sentinel.isMonitoringActive(), false);

		// Monitoring starten
		sentinel.startMonitoring({
			interval: 60000,
		});

		assert.strictEqual(sentinel.isMonitoringActive(), true);

		// Monitoring stoppen
		sentinel.stopMonitoring();
		assert.strictEqual(sentinel.isMonitoringActive(), false);

		sentinel.destroy();
	});

	test("should handle database clients", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		// Mock Prisma Client
		const mockPrismaClient = {
			async $queryRaw(
				_query: TemplateStringsArray,
				..._values: unknown[]
			): Promise<unknown> {
				return [{ test: 1 }];
			},
		};

		// Mock Redis Client
		const mockRedisClient = {
			async ping(): Promise<string> {
				return "PONG";
			},
		};

		// Monitoring starten
		sentinel.startMonitoring({
			interval: 60000,
		});

		// Clients sollten ohne Fehler gesetzt werden können
		assert.doesNotThrow(() => {
			sentinel.setPrismaClient(mockPrismaClient);
			sentinel.setRedisClient(mockRedisClient);
		});

		sentinel.destroy();
	});

	test("should require monitoring to be started before setting clients", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		const mockPrismaClient = {
			async $queryRaw(
				_query: TemplateStringsArray,
				..._values: unknown[]
			): Promise<unknown> {
				return [{ test: 1 }];
			},
		};

		// Ohne gestartetes Monitoring sollte ein Fehler geworfen werden
		assert.throws(() => {
			sentinel.setPrismaClient(mockPrismaClient);
		}, /Monitoring not started/);

		sentinel.destroy();
	});

	test("should measure performance metrics", async () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			monitorApiKey: "monitor-key",
		});

		const metrics = await sentinel.getPerformanceMetrics();

		assert.ok(metrics);
		assert.ok(typeof metrics.serviceLatency === "number");
		assert.ok(metrics.serviceLatency >= 0);
		assert.ok(metrics.timestamp);
		assert.ok(new Date(metrics.timestamp));

		sentinel.destroy();
	});
});
