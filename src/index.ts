/**
 * SentinelGuard - Vereinfachte Monitoring Library
 *
 * Hauptfunktionen:
 * - Automatische Heartbeats
 * - Performance-Monitoring (Service, Prisma, Redis)
 * - Robuste Fehlerbehandlung
 */

export { SentinelGuard } from "./sentinel-guard.js";

// Types exportieren für TypeScript-Nutzer
export type {
	ApiResponse,
	HeartbeatConfig,
	HeartbeatData,
	HeartbeatResponse,
	PerformanceMetrics,
	PrismaClientLike,
	RedisClientLike,
	SentinelGuardConfig,
} from "./types.js";

// Error Classes
export { NetworkError, SentinelGuardError } from "./types.js";
