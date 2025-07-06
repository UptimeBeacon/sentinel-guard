# Performance-Monitoring Features

## Übersicht

SentinelGuard bietet integrierte Performance-Monitoring-Funktionen, die automatisch die Latenz des Services sowie optional angeschlossener Datenbanken (Prisma/Redis) messen.

## Features

### 1. Automatische Service-Latenz-Messung
Bei jedem Heartbeat wird automatisch die interne Service-Latenz gemessen und in den Heartbeat-Daten eingebettet.

### 2. Prisma Datenbank-Latenz
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
sentinel.setPrismaClient(prisma);
```

**Wichtige Hinweise zur PrismaClient-Integration:**
- SentinelGuard nutzt `$queryRaw` als Template-Tag-Funktion: `$queryRaw\`SELECT 1\``
- Dies ist kompatibel mit echten PrismaClient-Instanzen aus `@prisma/client`
- Mock-Clients müssen die korrekte Signatur implementieren: `$queryRaw(query: TemplateStringsArray, ...values: unknown[])`

### 3. Redis-Latenz
```typescript
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();
sentinel.setRedisClient(redis);
```

## Verwendung

### Basis-Setup
```typescript
import { SentinelGuard } from '@uptimebeacon/sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  monitorApiKey: 'your-monitor-api-key',
});

// Optional: Database Clients konfigurieren
sentinel.setPrismaClient(prismaClient);
sentinel.setRedisClient(redisClient);
```

### Performance-Metriken abrufen
```typescript
// Manuelle Performance-Messung
const metrics = await sentinel.getPerformanceMetrics();
console.log('Service Latenz:', metrics.serviceLatency);
console.log('Prisma Latenz:', metrics.prismaLatency);
console.log('Redis Latenz:', metrics.redisLatency);
```

### Heartbeats mit Performance-Daten
```typescript
// Heartbeat wird automatisch mit Performance-Daten erweitert
const response = await sentinel.sendHeartbeat({
  type: 'CUSTOM',
  status: 'ONLINE',
});

// Response enthält Performance-Metriken in response.data.performance
```

### Status-Updates mit Performance
```typescript
// Spezieller Status-Update mit Performance-Snapshot
const response = await sentinel.sendStatusWithPerformance('ONLINE', {
  service: 'my-app',
  version: '1.0.0',
});
```

## Performance-Datenstruktur

```typescript
interface PerformanceMetrics {
  serviceLatency: number;      // Service-eigene Latenz in ms
  prismaLatency?: number;      // Prisma DB-Latenz in ms (optional)
  redisLatency?: number;       // Redis-Latenz in ms (optional)
  timestamp: number;           // Zeitstempel der Messung
}
```

## Beispiel

Siehe `examples/performance-monitoring.ts` für ein vollständiges Beispiel mit Mock-Clients.

## Best Practices

1. **Database Clients früh konfigurieren**: Setzen Sie die Database Clients direkt nach der SentinelGuard-Initialisierung
2. **Graceful Degradation**: Die Library funktioniert auch ohne Database Clients
3. **Fehlerbehandlung**: Database-Latenz-Messungen sind fehlerresistent und loggen Warnungen bei Problemen
4. **Performance-Impact**: Die Messungen sind optimiert und haben minimalen Performance-Impact
