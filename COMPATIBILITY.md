# SentinelGuard - Full Package Manager Compatibility

## ✅ Yes, the library is compatible with ALL common package managers!

### Supported Package Managers

| Package Manager | Status      | Installation           | Specifics                                 |
|-----------------|-------------|------------------------|-------------------------------------------|
| **npm**         | Fully compatible | `npm install sentinel-guard` | Standard, all features                   |
| **yarn**        | Fully compatible | `yarn add sentinel-guard`    | Workspace support, PnP compatible       |
| **pnpm**        | Fully compatible | `pnpm add sentinel-guard`    | Efficient disk usage                    |
| **bun**         | Fully compatible | `bun add sentinel-guard`     | Native TypeScript, best performance |

## Technical Compatibility

### ES Modules Support
-   ✅ Native ES Modules (`"type": "module"`)
-   ✅ TypeScript definitions (`.d.ts`)
-   ✅ Source Maps for debugging
-   ✅ Tree-shaking optimized

### Runtime Compatibility
-   ✅ **Node.js** \\( \geq 16.0.0 \\)
-   ✅ **Bun** (all versions)
-   ✅ **Deno** (via npm specifier)
-   ✅ **Browser** (via Bundler)

### Build Tools Integration
-   ✅ **Webpack** - Automatic tree-shaking
-   ✅ **Vite** - Native ES Module Support
-   ✅ **Rollup** - Optimized for Bundling
-   ✅ **esbuild** - Fast TypeScript compilation
-   ✅ **Parcel** - Zero-config setup
-   ✅ **Bun Build** - Native integration

## Quick Start Guide

### 1. Installation (choose your package manager)

```bash
# npm (Standard)
npm install sentinel-guard

# yarn (Berry/Classic)
yarn add sentinel-guard

# pnpm (Recommended for Monorepos)
pnpm add sentinel-guard

# bun (Fastest Option)
bun add sentinel-guard
```

### 2. Import & Usage

```typescript
// Works identically in all environments
import { SentinelGuard } from 'sentinel-guard';

const sentinel = new SentinelGuard({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key'
});
```

### 3. Development

```bash
# Choose your package manager for development

# npm
npm run dev
npm run build
npm test

# yarn
yarn dev
yarn build
yarn test

# pnpm
pnpm dev
pnpm build
pnpm test

# bun (with specific scripts)
bun run dev:bun
bun run build
bun run test:bun
```

## Recommendations by Use Case

### Enterprise/Teams
-   **pnpm** for Workspace management and disk efficiency
-   Best dependency deduplication
-   Consistent builds in CI/CD

### Performance-Critical Projects
-   **bun** for maximum speed
-   Native TypeScript compilation
-   Fastest installation and tests

### Existing Projects
-   **Retain your current Package Manager**
-   The library works identically everywhere
-   No migration required

### Open Source/Community
-   **npm** for maximum compatibility
-   Standard community choice
-   Best registry integration

## Tested Configurations

```bash
✅ Node.js 16 + npm 8
✅ Node.js 18 + npm 9
✅ Node.js 20 + npm 10
✅ Yarn 1.22 (Classic)
✅ Yarn 3+ (Berry)
✅ pnpm 8+
✅ Bun 1.0+
```

## Known Limitations

-   **None**: The library is fully compatible
-   **TypeScript**: Requires TypeScript \\( \geq 5.0.0 \\) as a peer dependency
-   **Node.js**: Minimum version 16.0.0 for ES Module Support

## Performance Comparison

| Metric         | npm        | yarn       | pnpm       | bun        |
|----------------|------------|------------|------------|------------|
| Install Speed  | Good       | Very Good  | Excellent  | Excellent  |
| Disk Usage     | Good       | Good       | Excellent  | Very Good  |
| Runtime Performance | Good       | Good       | Good       | Very Good  |
| TypeScript Speed | Good       | Good       | Good       | Excellent  |

## Conclusion

**SentinelGuard is 100% compatible with all modern package managers.**

Simply choose your preferred package manager and get started – the library works identically everywhere and offers the same features and performance characteristics.

*Having issues with a specific package manager? [Create an issue](https://github.com/uptimebeacon/sentinel-guard/issues) – we're happy to help!*