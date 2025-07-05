# SentinelGuard API Documentation v2.0

## Vereinfachte API - Klare Trennung der Monitoring-Modi

Die neue API eliminiert Mehrdeutigkeiten und bietet zwei klare Wege für das Monitoring:

### 🔄 Automatisches Monitoring (Kontinuierlich)
Für Services, die konstant überwacht werden sollen.

### 📤 Manuelle Heartbeats (Event-basiert)
Für spezifische Events oder Ad-hoc Checks.

---

## 🚀 Schnellstart

```typescript
import { SentinelGuard } from '@uptimebeacon/sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.uptimebeacon.com',
  apiKey: 'your-api-key',
  monitorApiKey: 'your-monitor-api-key',
});
```

---

## 📋 API Reference

### Konstruktor

```typescript
new SentinelGuard(config: SentinelGuardConfig)
```

**SentinelGuardConfig:**
```typescript
interface SentinelGuardConfig {
  baseUrl: string;          // API Basis-URL
  apiKey: string;           // Heartbeat API Key
  monitorApiKey: string;    // Monitor Management API Key  
  timeout?: number;         // Request Timeout (default: 30000ms)
  retryConfig?: RetryConfig;
}
```

---

## 🔄 Automatisches Monitoring

### `startAutoMonitoring(config: HeartbeatConfig)`
Startet kontinuierliche Heartbeats mit Performance-Monitoring.

```typescript
sentinel.startAutoMonitoring({
  interval: 30000,           // Intervall in ms
  autoStart: true,           // Sofort starten
  maxConsecutiveErrors: 5,   // Max. Fehler vor Stopp
});
```

### `stopAutoMonitoring()`
Stoppt das automatische Monitoring vollständig.

```typescript
sentinel.stopAutoMonitoring();
```

### `isAutoMonitoringActive(): boolean`
Prüft ob automatisches Monitoring läuft.

```typescript
const isActive = sentinel.isAutoMonitoringActive();
```

### Status-Management

```typescript
// Fehleranzahl abrufen
const errorCount = sentinel.getHeartbeatErrorCount();

// Fehleranzahl zurücksetzen
sentinel.resetHeartbeatErrorCount();

// Intervall ändern
sentinel.setAutoMonitoringInterval(60000);

// Konfiguration abrufen
const config = sentinel.getAutoMonitoringConfig();
```

---

## 📤 Manuelle Heartbeats

### `sendSingleHeartbeat(monitorId: string, data?: Partial<HeartbeatData>)`
Sendet einen einzelnen Heartbeat ohne automatisches Monitoring zu starten.

```typescript
const response = await sentinel.sendSingleHeartbeat('monitor-123', {
  type: 'CUSTOM',
  status: 'ONLINE',
  metadata: {
    version: '1.0.0',
    environment: 'production',
  },
});
```

**HeartbeatData:**
```typescript
interface HeartbeatData {
  type: 'CUSTOM';
  status: 'ONLINE' | 'OFFLINE' | 'HIGH_LATENCY' | 'ERROR';
  latencyMs?: number;           // Service-Latenz
  performance?: PerformanceMetrics;
  metadata?: Record<string, unknown>;
}
```

**PerformanceMetrics:**
```typescript
interface PerformanceMetrics {
  serviceLatency: number;       // Service-Latenz in ms
  prismaLatency?: number;       // Prisma DB-Latenz in ms
  redisLatency?: number;        // Redis-Latenz in ms
  timestamp: number;            // Unix-Timestamp
}
```

---

## 📊 Performance Monitoring

### Database Client Setup

```typescript
// Prisma Client für DB-Latenz-Messung
sentinel.setPrismaClient(prismaClient);

// Redis Client für Cache-Latenz-Messung  
sentinel.setRedisClient(redisClient);
```

### Performance-Daten
Jeder Heartbeat (automatisch/manuell) enthält automatisch:
- **Service-Latenz**: Zeit für interne Operationen
- **Prisma-Latenz**: Datenbankabfrage-Zeit (falls konfiguriert)
- **Redis-Latenz**: Cache-Zugriff-Zeit (falls konfiguriert)

---

## 🛡️ Fehlerbehandlung

### Robuste Netzwerkbehandlung
```typescript
// Netzwerkfehler crashen die Anwendung NICHT
const response = await sentinel.sendSingleHeartbeat('monitor-id', data);

if (!response.success) {
  console.log('Heartbeat failed:', response.error);
  // Anwendung läuft weiter
}
```

### Error Recovery
```typescript
// Automatisches Monitoring erholt sich von Fehlern
sentinel.startAutoMonitoring({
  interval: 30000,
  maxConsecutiveErrors: 3,  // Stoppt nach 3 aufeinanderfolgenden Fehlern
});

// Manueller Reset bei Problemen
sentinel.resetHeartbeatErrorCount();
```

---

## 🎯 Verwendungsmuster

### Pattern 1: Kontinuierliche Überwachung
```typescript
// Einmalig starten
sentinel.startAutoMonitoring({ interval: 30000 });

// Läuft automatisch im Hintergrund
// Sendet alle 30 Sekunden Heartbeats mit Performance-Daten
```

### Pattern 2: Event-basierte Überwachung
```typescript
// Bei spezifischen Events
async function onUserAction(action: string) {
  await sentinel.sendSingleHeartbeat('user-activity', {
    type: 'CUSTOM',
    status: 'ONLINE',
    metadata: { action, timestamp: Date.now() },
  });
}

// Bei Fehlern
async function onError(error: Error) {
  await sentinel.sendSingleHeartbeat('error-tracking', {
    type: 'CUSTOM', 
    status: 'ERROR',
    metadata: { error: error.message, stack: error.stack },
  });
}
```

### Pattern 3: Hybride Überwachung
```typescript
// Kontinuierliche Basis-Überwachung
sentinel.startAutoMonitoring({ interval: 60000 });

// Plus Event-basierte Details
await sentinel.sendSingleHeartbeat('deployment', {
  status: 'ONLINE',
  metadata: { version: '1.2.3' },
});
```

---

## 🔄 Migration von v1.x

### Alte API (v1.x)
```typescript
// ❌ Mehrdeutig und verwirrend
sentinel.initializeHeartbeat(config);
sentinel.startHeartbeat();
await sentinel.sendHeartbeat(data);
```

### Neue API (v2.x)
```typescript
// ✅ Klar und eindeutig

// FÜR KONTINUIERLICHE ÜBERWACHUNG:
sentinel.startAutoMonitoring(config);

// FÜR EINZELNE HEARTBEATS:
await sentinel.sendSingleHeartbeat(monitorId, data);
```

---

## 📈 Backend Integration

### Neue DTO Struktur
```typescript
// Backend CreateHeartbeatDto erweitert um:
interface CreateHeartbeatDto {
  type: HeartbeatType;
  status: HeartbeatStatus;
  latencyMs?: number;        // Deprecated - verwende performance.serviceLatency
  performance?: {            // NEU: Strukturierte Performance-Daten
    serviceLatency: number;
    prismaLatency?: number;
    redisLatency?: number;
    timestamp: string;
  };
  metadata?: Record<string, any>;
}
```

---

## ✨ Vorteile der neuen API

### 🎯 Klarheit
- **Eine Methode für automatisches Monitoring**: `startAutoMonitoring()`
- **Eine Methode für manuelle Heartbeats**: `sendSingleHeartbeat()`
- Keine Verwirrung mehr zwischen verschiedenen Modi

### 🛡️ Robustheit
- Netzwerkfehler crashen die Anwendung nicht
- Automatische Error Recovery
- Graceful Degradation

### 📊 Performance Insights
- Automatische Service-Latenz-Messung
- Optionale Datenbank-Latenz-Messung
- Strukturierte Performance-Daten im Backend

### 🔧 Einfache Integration
- Minimaler Setup-Code
- Klare Trennung der Verantwortlichkeiten
- Bessere TypeScript-Unterstützung
