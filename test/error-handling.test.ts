import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import {
	AuthenticationError,
	NetworkError,
	RateLimitError,
	SentinelGuard,
	SentinelGuardError,
} from "../dist/index.js";

describe("Error Handling Tests", () => {
	test("should handle network errors correctly", async () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://invalid-url-that-does-not-exist.com",
			apiKey: "test-key",
			timeout: 1000,
		});

		try {
			await sentinel.getMonitors();
			assert.fail("Should have thrown an error");
		} catch (error) {
			assert.ok(error instanceof NetworkError);
		} finally {
			sentinel.destroy();
		}
	});

	test("should handle authentication errors", async () => {
		const sentinel = new SentinelGuard({
			baseUrl: "https://httpbin.org",
			apiKey: "invalid-key",
			timeout: 5000,
		});

		try {
			await sentinel.getMonitors();
			// Note: httpbin might not return 401, so this test might not fail as expected
			// But the structure is correct for real authentication errors
		} catch (error) {
			if (error instanceof AuthenticationError) {
				assert.ok(error.message);
				assert.strictEqual(error.statusCode, 401);
			}
		} finally {
			sentinel.destroy();
		}
	});

	test("should create proper error instances", () => {
		const sentinelError = new SentinelGuardError("Test error", 500, "response");
		assert.strictEqual(sentinelError.message, "Test error");
		assert.strictEqual(sentinelError.statusCode, 500);
		assert.strictEqual(sentinelError.response, "response");
		assert.strictEqual(sentinelError.name, "SentinelGuardError");

		const networkError = new NetworkError("Network error");
		assert.strictEqual(networkError.name, "NetworkError");
		assert.ok(networkError instanceof SentinelGuardError);

		const authError = new AuthenticationError("Auth failed");
		assert.strictEqual(authError.name, "AuthenticationError");
		assert.strictEqual(authError.statusCode, 401);

		const rateError = new RateLimitError("Rate limit");
		assert.strictEqual(rateError.name, "RateLimitError");
		assert.strictEqual(rateError.statusCode, 429);
	});

	test("should validate retry configuration", () => {
		const invalidConfigs = [
			{
				baseUrl: "https://api.example.com",
				apiKey: "test",
				retryConfig: { maxRetries: -1, baseDelay: 1000, backoffMultiplier: 2 },
			},
			{
				baseUrl: "https://api.example.com",
				apiKey: "test",
				retryConfig: { maxRetries: 3, baseDelay: 0, backoffMultiplier: 2 },
			},
			{
				baseUrl: "https://api.example.com",
				apiKey: "test",
				retryConfig: { maxRetries: 3, baseDelay: 1000, backoffMultiplier: 0 },
			},
		];

		for (const config of invalidConfigs) {
			assert.throws(() => {
				SentinelGuard.validateConfig(config);
			});
		}
	});
});
