import type {
  SentinelGuardConfig,
  RetryConfig,
  ApiResponse,
} from './types.js';

import {
  SentinelGuardError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
} from './types.js';

/**
 * HTTP-Client für die SentinelGuard API
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly retryConfig: RetryConfig;

  constructor(config: SentinelGuardConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Entferne trailing slash
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 10000; // 10 Sekunden Standard
    this.retryConfig = config.retryConfig ?? {
      maxRetries: 3,
      baseDelay: 1000,
      backoffMultiplier: 2,
    };
  }

  /**
   * Führt eine HTTP-Anfrage mit Retry-Logik aus
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'User-Agent': 'SentinelGuard-Client/1.0.0',
      ...((options.headers as Record<string, string>) || {}),
    });

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    return this.executeWithRetry(url, requestOptions);
  }

  /**
   * Führt eine Anfrage mit Retry-Logik aus
   */
  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        await this.handleHttpError(response);
      }

      const data = await response.json();
      return {
        success: true,
        data: data as T,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (attempt < this.retryConfig.maxRetries && this.shouldRetry(error)) {
        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
        return this.executeWithRetry(url, options, attempt + 1);
      }

      throw this.mapError(error);
    }
  }

  /**
   * Behandelt HTTP-Fehler
   */
  private async handleHttpError(response: Response): Promise<never> {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Fallback auf Status-Text
    }

    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorMessage);
      case 429:
        throw new RateLimitError(errorMessage);
      default:
        throw new SentinelGuardError(errorMessage, response.status, errorText);
    }
  }

  /**
   * Überprüft ob ein Retry versucht werden sollte
   */
  private shouldRetry(error: unknown): boolean {
    if (error instanceof AuthenticationError) {
      return false; // Authentifizierungsfehler nicht wiederholen
    }

    if (error instanceof RateLimitError) {
      return true; // Rate-Limit-Fehler können wiederholt werden
    }

    if (error instanceof SentinelGuardError) {
      return error.statusCode ? error.statusCode >= 500 : false;
    }

    return true; // Netzwerkfehler wiederholen
  }

  /**
   * Berechnet die Verzögerung für den nächsten Versuch
   */
  private calculateDelay(attempt: number): number {
    return this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
  }

  /**
   * Hilfsfunktion für Sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Mappt unbekannte Fehler zu SentinelGuard-Fehlern
   */
  private mapError(error: unknown): SentinelGuardError {
    if (error instanceof SentinelGuardError) {
      return error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new NetworkError('Request timeout', error);
      }
      return new NetworkError(`Network error: ${error.message}`, error);
    }

    return new NetworkError('Unknown error occurred');
  }

  /**
   * GET-Anfrage
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST-Anfrage
   */
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT-Anfrage
   */
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE-Anfrage
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
