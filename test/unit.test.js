import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { SentinelGuard } from "../dist/index.js";

describe("SentinelGuard Configuration Tests", () => {
	test("should create instance with valid config", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
		});

		assert.ok(sentinel);
		sentinel.destroy();
	});

	test("should validate configuration correctly", () => {
		const validConfig = {
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
			timeout: 5000,
		};

		assert.doesNotThrow(() => {
			SentinelGuard.validateConfig(validConfig);
		});
	});

	test("should reject invalid configuration", () => {
		const invalidConfig = {
			baseUrl: "",
			apiKey: "test-key",
		};

		assert.throws(() => {
			SentinelGuard.validateConfig(invalidConfig);
		});
	});

	test("should initialize heartbeat manager", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
		});

		sentinel.initializeHeartbeat({
			interval: 60000,
			autoStart: false,
		});

		assert.strictEqual(sentinel.isHeartbeatActive(), false);

		const config = sentinel.getHeartbeatConfig();
		assert.ok(config);
		assert.strictEqual(config.interval, 60000);

		sentinel.destroy();
	});

	test("should handle default heartbeat data", () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://api.example.com",
			apiKey: "test-key",
		});

		sentinel.initializeHeartbeat({
			interval: 60000,
			autoStart: false,
		});

		const defaultData = {
			type: "CUSTOM",
			status: "ONLINE",
			latencyMs: 150,
			metadata: { test: true },
		};

		sentinel.setDefaultHeartbeatData(defaultData);

		const retrieved = sentinel.getDefaultHeartbeatData();
		assert.ok(retrieved);
		assert.strictEqual(retrieved.type, "CUSTOM");
		assert.strictEqual(retrieved.status, "ONLINE");
		assert.strictEqual(retrieved.latencyMs, 150);

		sentinel.destroy();
	});
});
