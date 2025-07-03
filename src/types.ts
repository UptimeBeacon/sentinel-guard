/**
 * Typdefinitionen für die SentinelGuard Library
 */

export interface SentinelGuardConfig {
  /** Die Basis-URL der API */
  baseUrl: string;
  /** Der API-Schlüssel für die Authentifizierung */
  apiKey: string;
  /** Optionale Timeout-Einstellungen in Millisekunden */
  timeout?: number;
  /** Optionale Retry-Konfiguration */
  retryConfig?: RetryConfig;
}

export interface RetryConfig {
  /** Maximale Anzahl der Wiederholungsversuche */
  maxRetries: number;
  /** Basis-Delay zwischen den Versuchen in Millisekunden */
  baseDelay: number;
  /** Exponentieller Backoff-Multiplikator */
  backoffMultiplier: number;
}

export interface Monitor {
  /** Eindeutige ID des Monitors */
  id: string;
  /** Name des Monitors */
  name: string;
  /** URL die überwacht wird */
  url: string;
  /** Überprüfungsintervall in Sekunden */
  interval: number;
  /** Timeout für die Überprüfung in Sekunden */
  timeout: number;
  /** Status des Monitors */
  status: MonitorStatus;
  /** Zeitstempel der letzten Überprüfung */
  lastCheck?: string;
  /** Zeitstempel der Erstellung */
  createdAt: string;
  /** Zeitstempel der letzten Aktualisierung */
  updatedAt: string;
  /** Zusätzliche Metadaten */
  metadata?: Record<string, unknown>;
}

export type MonitorStatus = 'active' | 'inactive' | 'paused' | 'error';

export interface CreateMonitorRequest {
  /** Name des Monitors */
  name: string;
  /** URL die überwacht wird */
  url: string;
  /** Überprüfungsintervall in Sekunden (optional, Standard: 300) */
  interval?: number;
  /** Timeout für die Überprüfung in Sekunden (optional, Standard: 30) */
  timeout?: number;
  /** Zusätzliche Metadaten */
  metadata?: Record<string, unknown>;
}

export interface UpdateMonitorRequest {
  /** Name des Monitors */
  name?: string;
  /** URL die überwacht wird */
  url?: string;
  /** Überprüfungsintervall in Sekunden */
  interval?: number;
  /** Timeout für die Überprüfung in Sekunden */
  timeout?: number;
  /** Status des Monitors */
  status?: MonitorStatus;
  /** Zusätzliche Metadaten */
  metadata?: Record<string, unknown>;
}

export interface HeartbeatData {
  /** Typ des Heartbeats */
  type: 'CUSTOM';
  /** Status des Services */
  status: 'ONLINE' | 'OFFLINE' | 'HIGH_LATENCY' | 'ERROR';
  /** Latenz in Millisekunden (optional) */
  latencyMs?: number;
  /** Zusätzliche Metadaten */
  metadata?: Record<string, unknown>;
}

export interface HeartbeatResponse {
  /** Erfolg des Heartbeats */
  success: boolean;
  /** Zeitstempel der Antwort */
  timestamp: string;
  /** Optionale Nachricht */
  message?: string;
}

export interface ApiResponse<T = unknown> {
  /** Erfolg der Anfrage */
  success: boolean;
  /** Daten der Antwort */
  data?: T;
  /** Fehlermeldung falls vorhanden */
  error?: string;
  /** Zeitstempel der Antwort */
  timestamp: string;
}

export interface HeartbeatConfig {
  /** Intervall für automatische Heartbeats in Millisekunden */
  interval: number;
  /** Automatisches Starten der Heartbeats */
  autoStart?: boolean;
  /** Maximale Anzahl aufeinanderfolgender Fehler vor dem Stoppen */
  maxConsecutiveErrors?: number;
}

export class SentinelGuardError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'SentinelGuardError';
  }
}

export class NetworkError extends SentinelGuardError {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends SentinelGuardError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends SentinelGuardError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}
