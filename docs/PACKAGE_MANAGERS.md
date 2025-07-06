# Installation & Package Manager Compatibility

SentinelGuard is compatible with all common package managers and can be used in both Node.js and Bun projects.

## Installation

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

## Development with Different Package Managers

### With npm
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Create build
npm run build

# Run tests
npm test
```

### With yarn
```bash
# Install dependencies
yarn install

# Start development
yarn dev

# Create build
yarn build

# Run tests
yarn test
```

### With pnpm
```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Create build
pnpm build

# Run tests
pnpm test
```

### With bun
```bash
# Install dependencies
bun install

# Start development (Bun specific script)
bun run dev:bun

# Create build
bun run build

# Run tests (Bun specific script)
bun run test:bun
```

## System Requirements

-   **Node.js**: Version 16.0.0 or higher
-   **TypeScript**: Version 5.0.0 or higher (as a peer dependency)
-   **Bun**: Any current version (optional)

## Usage in Different Environments

### ES Modules (Modern Node.js Projects)
```typescript
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
});
```

### TypeScript Projects
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
// Works natively with Bun's TypeScript support
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
});
```

## Build Compatibility

The library is provided as an ES Module and is compatible with:

-   **Webpack**: Automatic tree-shaking support
-   **Rollup**: Native ES Module support
-   **Vite**: Optimized for modern bundlers
-   **esbuild**: Fast bundling with TypeScript
-   **Parcel**: Zero-config bundling
-   **Bun**: Native TypeScript and ES Module support

## Package Manager Features

### npm
-   Standard Package Manager
-   Full npm registry support
-   Automatic Dependency Resolution

### yarn
-   Workspace support
-   Yarn Plug'n'Play compatible
-   Berry (Yarn 2+) compatible

### pnpm
-   Efficient disk usage through Content-Addressable Storage
-   Workspace support
-   Faster installation

### bun
-   Native TypeScript support
-   Fastest installation and execution
-   Integrated test runner

## Common Problems & Solutions

### TypeScript Errors
```bash
# Ensure TypeScript is installed
npm install -D typescript @types/node

# Or as a peer dependency
npm install typescript
```

### Import Errors
```bash
# Ensure your package.json contains "type": "module"
# Or use .mts file extensions for ES Modules
```

### Bun Specific Issues
```bash
# Install Bun types if needed
bun add -d @types/bun
```

## Migration between Package Managers

### From npm to yarn
```bash
rm package-lock.json
yarn install
```

### From npm to pnpm
```bash
rm package-lock.json
pnpm install
```

### From npm to bun
```bash
rm package-lock.json
bun install
```

## Performance Comparison

| Package Manager | Install Speed | Disk Usage | Runtime Performance |
|-----------------|---------------|------------|---------------------|
| npm             | Good          | Good       | Very Good           |
| yarn            | Very Good     | Good       | Very Good           |
| pnpm            | Excellent     | Excellent  | Very Good           |
| bun             | Excellent     | Very Good  | Excellent           |

## Recommendations

-   **New Projects**: Bun for maximum performance
-   **Enterprise**: pnpm for Workspace management
-   **Existing Projects**: Retain your current Package Manager
-   **CI/CD**: pnpm or yarn for consistent builds