# Primordial Task Desktop

Desktop client for Primordial Task, built with React, TypeScript, Vite, and Tauri.

## Requirements

- Node.js (LTS)
- pnpm 11+
- Rust toolchain (for Tauri build)

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Run with Tauri desktop shell:

```bash
pnpm dev:tauri
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Production build

```bash
pnpm build:tauri
```
