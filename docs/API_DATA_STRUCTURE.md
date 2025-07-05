# API-Datenstruktur für Monitoring mit Datenbanklatenz

## Heartbeat Request (POST /heartbeat)

### Automatischer Heartbeat mit Performance-Daten
```json
{
  "type": "CUSTOM",
  "status": "ONLINE",
  "latencyMs": 45.23,
  "performance": {
    "serviceLatency": 45.23,
    "prismaLatency": 28.14,
    "redisLatency": 3.87,
    "timestamp": 1625097600000
  },
  "metadata": {
    "service": "user-api",
    "version": "1.2.3",
    "environment": "production",
    "customData": {
      "memoryUsage": {
        "rss": 12345678,
        "heapTotal": 9876543,
        "heapUsed": 6543210
      },
      "uptime": 3600.25
    }
  }
}
```

### Status-Update mit Performance-Snapshot
```json
{
  "type": "CUSTOM",
  "status": "HIGH_LATENCY",
  "latencyMs": 156.78,
  "performance": {
    "serviceLatency": 156.78,
    "prismaLatency": 89.45,
    "redisLatency": 12.33,
    "timestamp": 1625097600000
  },
  "metadata": {
    "service": "payment-service",
    "performanceSnapshot": {
      "serviceLatency": 156.78,
      "prismaLatency": 89.45,
      "redisLatency": 12.33,
      "timestamp": 1625097600000
    },
    "alertLevel": "warning",
    "thresholds": {
      "warning": 100,
      "critical": 500
    },
    "businessMetrics": {
      "transactionsPerSecond": 85,
      "failureRate": 0.003,
      "avgTransactionValue": 127.50
    }
  }
}
```

## API Response

### Erfolgreiche Antwort
```json
{
  "success": true,
  "data": {
    "success": true,
    "timestamp": "2024-07-05T10:30:00.000Z",
    "message": "Heartbeat received",
    "id": "heartbeat-12345"
  },
  "timestamp": "2024-07-05T10:30:00.000Z"
}
```

### Fehler-Antwort (Network Error wird graceful behandelt)
```json
{
  "success": false,
  "error": "Network error: Connection refused",
  "timestamp": "2024-07-05T10:30:00.000Z"
}
```

## Performance-Metriken Details

### PerformanceMetrics Interface
```typescript
interface PerformanceMetrics {
  serviceLatency: number;      // Zeit für interne Verarbeitung (ms)
  prismaLatency?: number;      // Zeit für Prisma $queryRaw (ms)
  redisLatency?: number;       // Zeit für Redis ping (ms)
  timestamp: number;           // Unix timestamp der Messung
}
```

### Beispiel-Werte
- **serviceLatency**: 15-100ms (normale API-Verarbeitung)
- **prismaLatency**: 5-200ms (abhängig von DB-Last)
- **redisLatency**: 1-20ms (Cache-Zugriff)

## Monitor Request (POST /monitors)

```json
{
  "name": "User API",
  "url": "https://api.example.com",
  "interval": 300,
  "timeout": 30,
  "metadata": {
    "environment": "production",
    "team": "backend",
    "performanceBaseline": {
      "expectedLatency": 50,
      "maxAcceptableLatency": 200
    }
  }
}
```
