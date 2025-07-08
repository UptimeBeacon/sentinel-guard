import type { ApiResponse, SentinelGuardConfig } from "./types.js";

import {
	AuthenticationError,
	NetworkError,
	RateLimitError,
	SentinelGuardError,
} from "./types.js";

/**
 * HTTP Client for the SentinelGuard API
 *
 * @class HttpClient
 * @description Handles HTTP requests to the SentinelGuard API with retry logic and error handling
 */
export class HttpClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly monitorApiKey: string;
	private readonly timeout: number;
	private readonly maxRetries: number = 3;

	/**
	 * Creates a new HttpClient instance
	 *
	 * @param config - Configuration options for the HTTP client
	 */
	constructor(config: SentinelGuardConfig) {
		this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
		this.apiKey = config.apiKey;
		this.monitorApiKey = config.monitorApiKey;
		this.timeout = config.timeout ?? 10000; // 10 seconds default
	}

	/**
	 * Executes an HTTP request with retry logic
	 *
	 * @template T - The expected response data type
	 * @param endpoint - The API endpoint to request
	 * @param options - Optional request configuration
	 * @returns Promise resolving to the API response
	 */
	async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const headers = new Headers({
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
				"x-monitor-api-key": this.monitorApiKey,
				"User-Agent": "SentinelGuard-Client/1.0.0",
				...((options.headers as Record<string, string>) || {}),
			});

			const requestOptions: RequestInit = {
				...options,
				headers,
				signal: AbortSignal.timeout(this.timeout),
			};

			return await this.executeWithRetry(url, requestOptions);
		} catch (error) {
			const mappedError = this.mapError(error);
			return {
				success: false,
				error: mappedError.message,
				timestamp: new Date().toISOString(),
			};
		}
	}

	/**
	 * Executes a request with retry logic
	 *
	 * @template T - The expected response data type
	 * @param url - The full URL to request
	 * @param options - Request configuration options
	 * @param attempt - Current attempt number (default: 1)
	 * @returns Promise resolving to the API response
	 */
	private async executeWithRetry<T>(
		url: string,
		options: RequestInit,
		attempt: number = 1,
	): Promise<ApiResponse<T>> {
		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw await this.handleHttpError(response);
			}

			const data = await response.json();
			return {
				success: true,
				data: data as T,
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			const mappedError = this.mapError(error);

			// Check if we should retry
			if (attempt < this.maxRetries && this.shouldRetry(mappedError)) {
				const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
				await new Promise((resolve) => setTimeout(resolve, delay));
				return this.executeWithRetry(url, options, attempt + 1);
			}

			return {
				success: false,
				error: mappedError.message,
				timestamp: new Date().toISOString(),
			};
		}
	}

	/**
	 * Handles HTTP errors and throws appropriate error types
	 *
	 * @param response - The HTTP response object
	 * @returns Promise resolving to a SentinelGuardError
	 */
	private async handleHttpError(
		response: Response,
	): Promise<SentinelGuardError> {
		try {
			const errorText = await response.text();
			let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

			try {
				const errorData = JSON.parse(errorText);
				errorMessage = errorData.message || errorMessage;
			} catch {
				// Fallback to status text if JSON parsing fails
			}

			switch (response.status) {
				case 401:
					return new AuthenticationError(errorMessage);
				case 429:
					return new RateLimitError(errorMessage);
				default:
					return new NetworkError(errorMessage);
			}
		} catch (error) {
			// If error handling itself fails, return a generic network error
			return new NetworkError(
				"Request failed with unknown error",
				error instanceof Error ? error : undefined,
			);
		}
	}

	/**
	 * Checks if a retry should be attempted based on the error type
	 *
	 * @param error - The error that occurred
	 * @returns True if the request should be retried, false otherwise
	 */
	private shouldRetry(error: SentinelGuardError): boolean {
		if (error instanceof AuthenticationError) {
			return false; // Don't retry authentication errors
		}

		if (error instanceof RateLimitError) {
			return true; // Rate limit errors can be retried
		}

		if (error instanceof NetworkError) {
			// Retry network errors that might be transient
			return true;
		}

		// For other SentinelGuard errors, retry if it's a server error
		return error.statusCode ? error.statusCode >= 500 : false;
	}

	/**
	 * Maps unknown errors to SentinelGuard error types
	 *
	 * @param error - The unknown error to map
	 * @returns A SentinelGuardError or subclass
	 */
	private mapError(error: unknown): SentinelGuardError {
		if (error instanceof SentinelGuardError) {
			return error;
		}

		if (error instanceof Error) {
			if (error.name === "AbortError") {
				return new NetworkError("Request timeout", error);
			}
			return new NetworkError(`Network error: ${error.message}`, error);
		}

		return new NetworkError(
			"Unknown error occurred",
			error instanceof Error ? error : undefined,
		);
	}

	/**
	 * Performs a GET request
	 *
	 * @template T - The expected response data type
	 * @param endpoint - The API endpoint to request
	 * @returns Promise resolving to the API response
	 */
	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: "GET" });
	}

	/**
	 * Performs a POST request
	 *
	 * @template T - The expected response data type
	 * @param endpoint - The API endpoint to request
	 * @param data - Optional data to send in the request body
	 * @returns Promise resolving to the API response
	 */
	async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	/**
	 * Performs a PUT request
	 *
	 * @template T - The expected response data type
	 * @param endpoint - The API endpoint to request
	 * @param data - Optional data to send in the request body
	 * @returns Promise resolving to the API response
	 */
	async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	/**
	 * Performs a DELETE request
	 *
	 * @template T - The expected response data type
	 * @param endpoint - The API endpoint to request
	 * @returns Promise resolving to the API response
	 */
	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: "DELETE" });
	}
}
