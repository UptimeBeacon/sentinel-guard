# Test Directory

Dieses Verzeichnis enthält alle Tests für @uptimebeacon/sentinel-guard.

## Test-Dateien

### **Unit Tests**
- `unit.test.ts` - Grundlegende Unit Tests für SentinelGuard-Klasse
- `error-handling.test.ts` - Tests für Fehlerbehandlung und Error-Klassen

### **Integration Tests**
- `test-compatibility.js` - Package Manager Kompatibilitätstests
- `test-backend-integration.ts` - Backend-Integration Tests

## Tests ausführen

### **Node.js Tests**
```bash
npm test
# oder direkt:
node --test test/*.test.ts
```

### **Bun Tests**
```bash
npm run test:bun
# oder direkt:
bun test test/
```

### **Kompatibilitätstests**
```bash
npm run test:compatibility
# oder direkt:
node test/test-compatibility.js
```

### **Backend-Integration**
```bash
# Stellen Sie sicher, dass Ihr Backend läuft
node test/test-backend-integration.ts
```

## Test-Struktur

```
test/
├── README.md                    # Diese Datei
├── unit.test.ts                 # Unit Tests
├── error-handling.test.ts       # Error Handling Tests
├── test-compatibility.js        # Kompatibilitätstests
└── test-backend-integration.ts  # Backend Integration
```

## Test-Kategorien

### **🧪 Unit Tests**
- Konfigurationsvalidierung
- Heartbeat-Manager Initialisierung
- Standard-Heartbeat-Daten
- Grundlegende Funktionalität

### **⚠️ Error Handling**
- Netzwerkfehler
- Authentifizierungsfehler
- Rate-Limit-Fehler
- Retry-Konfiguration

### **🔗 Integration Tests**
- Package Manager Kompatibilität
- Backend-API Integration
- Real-world Szenarien

## CI/CD Integration

Diese Tests sind für die Ausführung in CI/CD-Pipelines optimiert:

```yaml
# GitHub Actions Beispiel
- name: Run Tests
  run: |
    npm run build
    npm test
    npm run test:compatibility
```

## Lokale Entwicklung

Für die lokale Entwicklung:

```bash
# Alles testen
npm run check

# Nur Tests
npm test

# Watch-Mode (falls implementiert)
npm run test:watch
```
