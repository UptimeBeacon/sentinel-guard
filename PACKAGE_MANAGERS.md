# 📦 Installation & Package Manager Kompatibilität

SentinelGuard ist mit allen gängigen Package Managern kompatibel und kann sowohl in Node.js- als auch in Bun-Projekten verwendet werden.

## 🚀 Installation

### npm
```bash
npm install sentinel-guard
```

### yarn
```bash
yarn add sentinel-guard
```

### pnpm
```bash
pnpm add sentinel-guard
```

### bun
```bash
bun add sentinel-guard
```

## 🛠️ Entwicklung mit verschiedenen Package Managern

### Mit npm
```bash
# Dependencies installieren
npm install

# Entwicklung starten
npm run dev

# Build erstellen
npm run build

# Tests ausführen
npm test
```

### Mit yarn
```bash
# Dependencies installieren
yarn install

# Entwicklung starten
yarn dev

# Build erstellen
yarn build

# Tests ausführen
yarn test
```

### Mit pnpm
```bash
# Dependencies installieren
pnpm install

# Entwicklung starten
pnpm dev

# Build erstellen
pnpm build

# Tests ausführen
pnpm test
```

### Mit bun
```bash
# Dependencies installieren
bun install

# Entwicklung starten (spezifisches Bun-Skript)
bun run dev:bun

# Build erstellen
bun run build

# Tests ausführen (spezifisches Bun-Skript)
bun run test:bun
```

## 📋 Systemanforderungen

- **Node.js**: Version 16.0.0 oder höher
- **TypeScript**: Version 5.0.0 oder höher (als peer dependency)
- **Bun**: Jede aktuelle Version (optional)

## 🔧 Verwendung in verschiedenen Umgebungen

### ES Modules (moderne Node.js Projekte)
```typescript
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
});
```

### TypeScript Projekte
```typescript
import { 
  SentinelGuard, 
  type SentinelGuardConfig,
  type Monitor 
} from 'sentinel-guard';

const config: SentinelGuardConfig = {
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  timeout: 10000,
};

const sentinel = new SentinelGuard(config);
```

### Bun Runtime
```typescript
// Funktioniert nativ mit Bun's TypeScript-Support
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
});
```

## 🏗️ Build-Kompatibilität

Die Library wird als ES Module bereitgestellt und ist kompatibel mit:

- **Webpack**: Automatische Tree-shaking Unterstützung
- **Rollup**: Native ES Module Unterstützung
- **Vite**: Optimiert für moderne Bundler
- **esbuild**: Schnelles Bundling mit TypeScript
- **Parcel**: Zero-config Bundling
- **Bun**: Native TypeScript und ES Module Unterstützung

## 🔍 Package Manager Features

### npm
- Standard Package Manager
- Vollständige npm registry Unterstützung
- Automatische Dependency Resolution

### yarn
- Workspace-Unterstützung
- Yarn Plug'n'Play kompatibel
- Berry (Yarn 2+) kompatibel

### pnpm
- Effiziente Disk-Nutzung durch Content-Addressable Storage
- Workspace-Unterstützung
- Schnellere Installation

### bun
- Native TypeScript-Unterstützung
- Schnellste Installation und Ausführung
- Integrierte Test-Runner

## 🚨 Häufige Probleme & Lösungen

### TypeScript Errors
```bash
# Stelle sicher, dass TypeScript installiert ist
npm install -D typescript @types/node

# Oder als peer dependency
npm install typescript
```

### Import Errors
```bash
# Stelle sicher, dass deine package.json "type": "module" enthält
# Oder verwende .mts Dateierweiterungen für ES Modules
```

### Bun spezifische Issues
```bash
# Installiere Bun types falls benötigt
bun add -d @types/bun
```

## 🔄 Migration zwischen Package Managern

### Von npm zu yarn
```bash
rm package-lock.json
yarn install
```

### Von npm zu pnpm
```bash
rm package-lock.json
pnpm install
```

### Von npm zu bun
```bash
rm package-lock.json
bun install
```

## 📊 Performance Vergleich

| Package Manager | Install Speed | Disk Usage | Runtime Performance |
|----------------|---------------|------------|-------------------|
| npm            | ⭐⭐⭐         | ⭐⭐⭐       | ⭐⭐⭐⭐           |
| yarn           | ⭐⭐⭐⭐        | ⭐⭐⭐       | ⭐⭐⭐⭐           |
| pnpm           | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐           |
| bun            | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐          |

## 🎯 Empfehlungen

- **Neue Projekte**: Bun für maximale Performance
- **Enterprise**: pnpm für Workspace-Management
- **Bestehende Projekte**: Behalten Sie Ihren aktuellen Package Manager
- **CI/CD**: pnpm oder yarn für konsistente Builds
