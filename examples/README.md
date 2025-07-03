# Beispiele für SentinelGuard

Dieses Verzeichnis enthält praktische Beispiele für die Verwendung der SentinelGuard Library.

## Verfügbare Beispiele

### 1. Basic Monitor (`basic-monitor.ts`)
Grundlegende Monitor-Verwaltung:
- Monitor erstellen
- Alle Monitore abrufen
- Monitor-Details anzeigen
- Monitor pausieren/aktivieren
- Monitor löschen

```bash
bun run examples/basic-monitor.ts
```

### 2. Heartbeat Example (`heartbeat-example.ts`)
Heartbeat-Funktionalität demonstrieren:
- Heartbeat-Manager konfigurieren
- Manuelle Heartbeats senden
- Automatische Heartbeats starten/stoppen
- Status-Updates senden
- Health-Checks durchführen

```bash
bun run examples/heartbeat-example.ts
```

### 3. Error Handling (`error-handling.ts`)
Erweiterte Fehlerbehandlung und Retry-Logik:
- Verschiedene Fehlertypen testen
- Konfigurationsvalidierung
- Retry-Verhalten demonstrieren
- Spezifische Fehlerbehandlung

```bash
bun run examples/error-handling.ts
```

## Vorbereitung

Bevor Sie die Beispiele ausführen:

1. **API-Konfiguration anpassen**: Bearbeiten Sie die Beispieldateien und ersetzen Sie die Platzhalter-URLs und API-Schlüssel durch echte Werte.

2. **Beispiel-Konfiguration**:
```typescript
const sentinel = new SentinelGuard({
  baseUrl: 'https://your-actual-api.com',
  apiKey: process.env.SENTINEL_API_KEY || 'your-real-api-key',
  timeout: 10000,
});
```

3. **Umgebungsvariablen** (empfohlen):
```bash
export SENTINEL_API_KEY="your-actual-api-key"
export SENTINEL_BASE_URL="https://your-actual-api.com"
```

## Anpassung für eigene APIs

Die Beispiele verwenden generische Endpunkte. Passen Sie diese an Ihre API an:

### Typische API-Endpunkte:
- `GET /monitors` - Alle Monitore abrufen
- `POST /monitors` - Monitor erstellen
- `GET /monitors/:id` - Spezifischen Monitor abrufen
- `PUT /monitors/:id` - Monitor aktualisieren
- `DELETE /monitors/:id` - Monitor löschen
- `POST /heartbeat` - Heartbeat senden
- `GET /health` - Health-Check

### API-Response-Format:
```typescript
{
  "success": true,
  "data": { /* Ihre Daten */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Erweiterte Beispiele

### Express.js Integration
```typescript
import express from 'express';
import { SentinelGuard } from 'sentinel-guard';

const app = express();
const sentinel = new SentinelGuard({
  baseUrl: process.env.SENTINEL_BASE_URL!,
  apiKey: process.env.SENTINEL_API_KEY!,
});

// Heartbeat bei Server-Start
sentinel.initializeHeartbeat({
  interval: 30000,
  autoStart: true,
});

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  sentinel.destroy();
  server.close();
});
```

### Docker Health Check
```typescript
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: process.env.SENTINEL_BASE_URL!,
  apiKey: process.env.SENTINEL_API_KEY!,
});

// Health check endpoint
async function healthCheck() {
  try {
    const response = await sentinel.healthCheck();
    process.exit(response.success ? 0 : 1);
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();
```

## Fehlerbehebung

### Häufige Probleme:

1. **API-Schlüssel ungültig**:
   - Überprüfen Sie den API-Schlüssel
   - Stellen Sie sicher, dass er die richtigen Berechtigungen hat

2. **Netzwerk-Timeouts**:
   - Erhöhen Sie den Timeout-Wert
   - Überprüfen Sie die Netzwerkverbindung

3. **Rate-Limits**:
   - Reduzieren Sie die Heartbeat-Frequenz
   - Implementieren Sie exponential backoff

4. **CORS-Probleme** (Browser):
   - SentinelGuard ist für Node.js/Server-Side-Verwendung optimiert
   - Für Browser-Anwendungen verwenden Sie einen Proxy

## Beitragen

Wenn Sie weitere nützliche Beispiele haben, erstellen Sie gerne einen Pull Request!
