# @uptimebeacon/sentinel-guard

Eine typsichere TypeScript-Library für API-Monitoring mit Heartbeat-Funktionalität.

## Features

- 🔒 **Typsicherheit**: Vollständig typisierte API mit TypeScript
- 🔄 **Automatische Heartbeats**: Regelmäßige Status-Updates mit konfigurierbaren Intervallen
- 📊 **Monitor-Management**: Erstellen, aktualisieren und löschen von Monitoren
- 🔁 **Retry-Logik**: Intelligente Wiederholung bei temporären Fehlern
- ⚡ **HTTP-Client**: Robuster HTTP-Client mit Timeout und Fehlerbehandlung
- 🎯 **Error Handling**: Detaillierte Fehlerklassen für verschiedene Szenarien

## Installation

@uptimebeacon/sentinel-guard ist mit allen gängigen Package Managern kompatibel:

```bash
# npm
npm install @uptimebeacon/sentinel-guard

# yarn
yarn add @uptimebeacon/sentinel-guard

# pnpm
pnpm add @uptimebeacon/sentinel-guard

# bun
bun add @uptimebeacon/sentinel-guard
```

> 📋 **Systemanforderungen**: Node.js ≥16.0.0, TypeScript ≥5.0.0
> 
> 📖 Detaillierte Informationen zur Package Manager Kompatibilität finden Sie in [PACKAGE_MANAGERS.md](./PACKAGE_MANAGERS.md)

## Schnellstart

```typescript
import { SentinelGuard } from '@uptimebeacon/sentinel-guard';

// Library konfigurieren
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.yourservice.com',
  apiKey: 'your-api-key',
  timeout: 10000,
  retryConfig: {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 2,
  },
});

// Monitor erstellen
const monitor = await sentinel.createMonitor({
  name: 'My Website',
  url: 'https://example.com',
  interval: 300, // 5 Minuten
  timeout: 30,
});

// Heartbeat konfigurieren und starten
sentinel.initializeHeartbeat({
  interval: 60000, // 1 Minute
  autoStart: true,
  maxConsecutiveErrors: 5,
});

// Manueller Heartbeat
await sentinel.sendHeartbeat({
  type: 'CUSTOM',
  status: 'ONLINE',
  latencyMs: 150,
  metadata: {
    version: '1.0.0',
    region: 'eu-west'
  }
});
```

## API-Referenz

### SentinelGuard-Konfiguration

```typescript
interface SentinelGuardConfig {
  baseUrl: string;           // API-Basis-URL
  apiKey: string;            // API-Schlüssel
  timeout?: number;          // Request-Timeout (Standard: 10000ms)
  retryConfig?: RetryConfig; // Retry-Konfiguration
}

interface RetryConfig {
  maxRetries: number;        // Max. Wiederholungen
  baseDelay: number;         // Basis-Verzögerung in ms
  backoffMultiplier: number; // Exponentieller Backoff
}
```

### Monitor-Management

```typescript
// Monitor erstellen
const monitor = await sentinel.createMonitor({
  name: 'My Service',
  url: 'https://myservice.com',
  interval: 300,
  timeout: 30,
  metadata: { environment: 'production' }
});

// Alle Monitore abrufen
const monitors = await sentinel.getMonitors();

// Spezifischen Monitor abrufen
const monitor = await sentinel.getMonitor('monitor-id');

// Monitor aktualisieren
const updated = await sentinel.updateMonitor('monitor-id', {
  name: 'Updated Name',
  interval: 600
});

// Monitor pausieren/fortsetzen
await sentinel.pauseMonitor('monitor-id');
await sentinel.resumeMonitor('monitor-id');

// Monitor löschen
await sentinel.deleteMonitor('monitor-id');
```

### Heartbeat-Funktionalität

```typescript
// Heartbeat-Manager initialisieren
sentinel.initializeHeartbeat({
  interval: 60000,        // 1 Minute
  autoStart: true,        // Automatisch starten
  maxConsecutiveErrors: 5 // Max. aufeinanderfolgende Fehler
});

// Automatische Heartbeats starten/stoppen
sentinel.startHeartbeat();
sentinel.stopHeartbeat();

// Manueller Heartbeat
await sentinel.sendHeartbeat({
  type: 'CUSTOM',
  status: 'ONLINE',
  latencyMs: 120,
  metadata: { 
    version: '1.0.0',
    environment: 'production' 
  }
});

// Status-Update senden
await sentinel.sendStatus('HIGH_LATENCY', { 
  latencyMs: 2500,
  reason: 'database-timeout' 
});

// Health-Check durchführen
const health = await sentinel.healthCheck();

// Heartbeat-Status prüfen
const isActive = sentinel.isHeartbeatActive();
const errorCount = sentinel.getHeartbeatErrorCount();
```

### Fehlerbehandlung

Die Library bietet spezifische Fehlerklassen:

```typescript
import { 
  SentinelGuardError, 
  NetworkError, 
  AuthenticationError, 
  RateLimitError 
} from 'sentinel-guard';

try {
  await sentinel.sendHeartbeat();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('API-Schlüssel ungültig');
  } else if (error instanceof RateLimitError) {
    console.error('Rate-Limit erreicht');
  } else if (error instanceof NetworkError) {
    console.error('Netzwerkfehler:', error.message);
  }
}
```

### Ressourcen bereinigen

```typescript
// Wichtig: Ressourcen bereinigen wenn die Anwendung beendet wird
sentinel.destroy();
```

## Beispiele

### Einfacher Monitor

```typescript
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
});

// Website-Monitor erstellen
const monitor = await sentinel.createMonitor({
  name: 'Production Website',
  url: 'https://mywebsite.com',
  interval: 300,
  timeout: 30,
});

console.log(`Monitor erstellt: ${monitor.data?.id}`);
```

### Heartbeat mit Express.js

```typescript
import express from 'express';
import { SentinelGuard } from 'sentinel-guard';

const app = express();
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
});

// Heartbeat alle 30 Sekunden
sentinel.initializeHeartbeat({
  interval: 30000,
  autoStart: true,
});

app.listen(3000, () => {
  console.log('Server gestartet');
});

// Graceful shutdown
process.on('SIGINT', () => {
  sentinel.destroy();
  process.exit(0);
});
```

### Erweiterte Konfiguration

```typescript
const sentinel = new SentinelGuard({
  baseUrl: 'https://api.monitoring.com',
  apiKey: process.env.API_KEY!,
  timeout: 15000,
  retryConfig: {
    maxRetries: 5,
    baseDelay: 2000,
    backoffMultiplier: 1.5,
  },
});

// Heartbeat mit Error-Handling
sentinel.initializeHeartbeat({
  interval: 120000, // 2 Minuten
  maxConsecutiveErrors: 3,
  autoStart: false,
});

// Manuell starten mit Überwachung
sentinel.startHeartbeat();

// Fehleranzahl regelmäßig prüfen
setInterval(() => {
  const errors = sentinel.getHeartbeatErrorCount();
  if (errors > 0) {
    console.warn(`${errors} aufeinanderfolgende Heartbeat-Fehler`);
  }
}, 60000);
```

## Entwicklung

```bash
# Dependencies installieren (wähle deinen bevorzugten Package Manager)
npm install    # oder yarn install, pnpm install, bun install

# Entwicklungsserver starten
npm run dev    # Standard Node.js
npm run dev:bun # Mit Bun Runtime

# Build erstellen
npm run build

# Tests ausführen
npm test       # Standard Node.js Tests
npm run test:bun # Mit Bun Test Runner
```

### Package Manager Kompatibilität

- ✅ **npm** - Standard Package Manager
- ✅ **yarn** - Mit Workspace-Unterstützung
- ✅ **pnpm** - Effiziente Disk-Nutzung
- ✅ **bun** - Native TypeScript-Unterstützung

Siehe [PACKAGE_MANAGERS.md](./PACKAGE_MANAGERS.md) für detaillierte Anweisungen.

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.d

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
