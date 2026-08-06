# Primordial Task

Offline-first, AI-native desktop task and developer workspace (Tauri v2 + React 19).

## Phase 1 — Project Foundation

This repository currently contains the production-ready project foundation only:

- TurboRepo-style npm workspaces monorepo
- TypeScript strict mode, Vite, Tailwind CSS v4
- Tauri v2 desktop shell configuration
- Shared packages: `core`, `infrastructure`, `shared`
- Placeholder packages: `features`, `ai`
- Tooling: ESLint, Prettier, EditorConfig, Husky, lint-staged
- Testing: Vitest, React Testing Library, Playwright
- CI quality gate preparation

Business features, screens, routing, Supabase, and AI integrations are intentionally deferred.

## Specs

- [Engineering Development Blueprint](./doc/ENGINEERING_DEVELOPMENT_BLUEPRINT.md)
- [System Architecture Blueprint](./doc/SYSTEM_ARCHITECTURE_BLUEPRINT.md)
- [Design System](./doc/DESIGN_SYSTEM.md)
- [Technical Foundation Specification](./doc/TECHNICAL_FOUNDATION_SPECIFICATION.md)

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run quality
```

## Structure

```text
apps/desktop/          # Vite + React entry
packages/core/         # Domain contracts, config, DI, errors
packages/infrastructure/
packages/shared/       # Hooks, utils, storage/network contracts
packages/features/     # Feature modules (empty scaffolding)
packages/ai/           # AI package (empty scaffolding)
database/              # Future SQLite migrations/seeds
scripts/               # Future automation
src-tauri/             # Tauri v2 native shell
```
