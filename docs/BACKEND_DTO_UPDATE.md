# Backend DTO Update für Performance Monitoring

## Erweiterte CreateHeartbeatDto

```typescript
import { HeartbeatStatus } from "@mono/database/prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	ValidateNested,
	IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export enum HeartbeatType {
	HTTP = "HTTP",
	TCP = "TCP",
	PING = "PING",
	CUSTOM = "CUSTOM",
}

export class PerformanceMetricsDto {
	@ApiProperty({
		description: "Service response latency in milliseconds",
		example: 45.2,
	})
	@IsNumber()
	serviceLatency!: number;

	@ApiProperty({
		description: "Prisma database latency in milliseconds",
		example: 12.8,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	prismaLatency?: number;

	@ApiProperty({
		description: "Redis latency in milliseconds",
		example: 3.1,
		required: false,
	})
	@IsNumber()
	@IsOptional()
	redisLatency?: number;

	@ApiProperty({
		description: "Timestamp when performance was measured",
		example: "2025-07-05T10:30:00.000Z",
	})
	@IsDateString()
	timestamp!: string;
}

export class CreateHeartbeatDto {
	@ApiProperty({
		enum: HeartbeatType,
		description: "Type of heartbeat check",
		example: HeartbeatType.CUSTOM,
	})
	@IsEnum(HeartbeatType)
	@IsNotEmpty()
	type!: HeartbeatType;

	@ApiProperty({
		enum: HeartbeatStatus,
		description: "Current status of the monitored service",
		example: HeartbeatStatus.ONLINE,
	})
	@IsEnum(HeartbeatStatus)
	@IsNotEmpty()
	status!: HeartbeatStatus;

	@ApiProperty({
		description: "Response latency in milliseconds (deprecated - use performance.serviceLatency)",
		example: 150,
		required: false,
		deprecated: true,
	})
	@IsNumber()
	@IsOptional()
	latencyMs?: number;

	@ApiProperty({
		description: "Performance metrics including service and database latencies",
		type: PerformanceMetricsDto,
		required: false,
	})
	@ValidateNested()
	@Type(() => PerformanceMetricsDto)
	@IsOptional()
	performance?: PerformanceMetricsDto;

	@ApiProperty({
		description: "Additional metadata for the heartbeat",
		example: { version: "1.0.0", region: "eu-west" },
		required: false,
	})
	@IsObject()
	@IsOptional()
	// biome-ignore lint/suspicious/noExplicitAny: Flexible metadata structure
	metadata?: Record<string, any>;
}
```

## Migration Guide

1. **Backwards Compatibility**: Das bestehende `latencyMs` Feld bleibt bestehen, ist aber als deprecated markiert
2. **Neue Performance-Daten**: Werden über das `performance` Objekt übertragen
3. **Validierung**: Das neue `PerformanceMetricsDto` validiert alle Performance-Metriken
4. **Timestamp**: Jede Performance-Messung hat einen eigenen Timestamp für bessere Nachverfolgung

## Database Schema Update

```sql
-- Neue Spalten für Performance-Monitoring
ALTER TABLE heartbeats 
ADD COLUMN service_latency_ms DECIMAL(8,3),
ADD COLUMN prisma_latency_ms DECIMAL(8,3),
ADD COLUMN redis_latency_ms DECIMAL(8,3),
ADD COLUMN performance_timestamp TIMESTAMP;

-- Index für Performance-Abfragen
CREATE INDEX idx_heartbeats_performance ON heartbeats(service_latency_ms, performance_timestamp);
```
