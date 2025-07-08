export { HeartbeatManager } from "./heartbeat-manager.js";
export { HttpClient } from "./http-client.js";
export { SentinelGuard } from "./sentinel-guard.js";
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

export {
	ClientInitializationError,
	ConfigurationError,
	HeartbeatSendError,
	PerformanceMonitoringError,
	PrismaConnectionError,
	RedisConnectionError,
} from "./types.js";
