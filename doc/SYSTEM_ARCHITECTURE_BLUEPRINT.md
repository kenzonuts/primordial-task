# Primordial Task System Architecture & Application Blueprint

Version: 1.0  
Phase: 14  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop Application (Windows, macOS, Linux)  
Architecture Style: Modular, Offline-First, Feature-Driven, Clean Architecture

---

## 1. Executive Summary

The **System Architecture & Application Blueprint** defines the structural foundation of Primordial Task. It is designed to handle complex, high-performance developer workflows by combining the speed of a native desktop application (via Tauri/Rust) with the flexibility of a modern web frontend (React/TypeScript). 

The system prioritizes **Offline-First** reliability, **Context-Aware AI** integration, and a **Unified Developer Workspace**. This document serves as the primary technical mandate for all engineering teams and AI agents.

---

## 2. Architecture Principles

- **Scalability**: Modules are isolated so they can grow independently.
- **Maintainability**: Clean Architecture ensures business logic is decoupled from external frameworks.
- **Testability**: Dependency injection and repository patterns allow for exhaustive unit and integration testing.
- **Security**: Strict process isolation (Tauri) and encrypted local storage for secrets.
- **Performance**: Zero-latency UI via local caching and background synchronization.
- **Offline First**: All core features work without an internet connection.
- **Modular & Feature-Driven**: Features are self-contained units of logic, UI, and state.

---

## 3. Application Layers

### 3.1 Presentation Layer (Frontend)
- **Responsibility**: UI Rendering, User Interaction, Local State.
- **Tech**: React, Tailwind CSS v4, shadcn/ui, Framer Motion.
- **Boundary**: Communicates only with the Application Layer via Hooks.

### 3.2 Application Layer (Orchestration)
- **Responsibility**: Feature-specific logic, Command execution, Side effects.
- **Tech**: TanStack Query, Custom Hooks.
- **Boundary**: Orchestrates Domain services and State stores.

### 3.3 Domain Layer (Business Logic)
- **Responsibility**: Pure business rules, Entities, Interfaces.
- **Boundary**: Framework-agnostic. No knowledge of React or Tauri.

### 3.4 Infrastructure Layer (Data Access)
- **Responsibility**: Repositories, API Clients, Database Adapters.
- **Tech**: SQLite (Local), Supabase (Cloud).
- **Boundary**: Maps Domain models to Persistence models.

### 3.5 Persistence Layer (Storage)
- **Responsibility**: SQLite for local data, Secure Storage for credentials.
- **Tech**: Tauri-plugin-sql, Keytar/Keyring.

### 3.6 Native Layer (Rust/Tauri)
- **Responsibility**: File system access, PTY (Terminal), OS Integration, IPC.
- **Tech**: Rust, Tauri v2 Commands.

### 3.7 Cloud Layer (Synchronization)
- **Responsibility**: Real-time sync, Auth, File Storage, Edge Functions.
- **Tech**: Supabase Auth, PostgreSQL, Realtime, Storage.

### 3.8 AI Layer (Intelligence)
- **Responsibility**: RAG, Prompt Engineering, Model Routing.
- **Tech**: Multi-provider bridge (OpenAI, Anthropic, Gemini, Local).

---

## 4. Module Architecture

Every module follows a standardized internal structure: `UI -> Logic -> Repository -> Data`.

| Module | Purpose | Key Dependency |
| --- | --- | --- |
| **Authentication** | User identity & Session management | Supabase Auth |
| **Dashboard** | Unified activity & health summary | All Content Modules |
| **Workspace** | High-level container for projects | Supabase Postgres |
| **Project** | Focused grouping of tasks and tools | Workspace Module |
| **Task** | Atomic unit of work (Kanban/Calendar) | Project Module |
| **Notes** | Long-form documentation & AI docs | Editor Module |
| **Analytics** | KPI & Velocity reporting | Analytics Engine |
| **AI Workspace** | Contextual assistance & RAG | AI Layer |
| **Developer Workspace** | Git, DB, API, Terminal integration | Native Layer (Rust) |
| **Settings** | Global & Scoped configuration | Settings Store |
| **Search** | Universal fuzzy-search index | Search Indexer |
| **Cloud Sync** | Offline/Online data reconciliation | Sync Engine |
---

## 5. Application Navigation & State

### 5.1 Navigation Flows
- **Authentication Flow**: `Onboarding -> Login/Signup -> Workspace Selection`.
- **Workspace Flow**: `Workspace Home -> Project List -> Module Selection`.
- **Project Flow**: `Project Overview -> Task Board -> Calendar -> Analytics`.
- **Developer Flow**: `Terminal -> Git Graph -> DB Explorer -> API Client`.
- **Global Navigation**: Left Sidebar (Modules), Top Bar (Global Search, Settings, Command Palette).

### 5.2 Application State (Zustand)
- **Auth Store**: Tracks `session`, `userProfile`, and `permissions`.
- **Workspace Store**: Tracks `activeWorkspace`, `memberList`, and `workspaceConfig`.
- **Project Store**: Tracks `activeProject`, `projectMetadata`, and `localPath`.
- **UI Store**: Tracks `sidebarCollapsed`, `activeTab`, and `theme`.
- **Sync Store**: Tracks `syncQueueSize`, `lastSyncTime`, and `onlineStatus`.

### 5.3 State Lifecycle
- **Initialization**: Hydrate from SQLite and Secure Storage.
- **Runtime**: Reactive updates via user actions and WebSocket events.
- **Persistence**: Debounced writes to local SQLite to ensure crash recovery.

---

## 6. System Communication (Expanded)

### 6.1 Native Bridge (Tauri IPC)
- **Direct Command**: `invoke('cmd_name', { args })` for blocking/non-blocking calls.
- **Event Bus**: `listen('event_name', (event) => { ... })` for native streams (PTY, FS events).
- **Security**: Commands are scoped by Capability-Based Security in Tauri v2.

---

## 13. Error Handling & Recovery

### 13.1 Strategy
- **Global Error Boundary**: Catch-all for React rendering errors with "Graceful Degradation".
- **Module Errors**: Isolated failures; one module crashing does not take down the app.
- **API/Sync Errors**: Automatic retry with exponential backoff for network failures.
- **Database Errors**: Atomic transactions; rollback on failure to maintain integrity.

### 13.2 Recovery
- **Crash Reports**: Automatic diagnostic upload to Sentry (opt-in).
- **Auto-Repair**: Background verification of local SQLite integrity on startup.
- **Force Sync**: User-triggered full reconciliation if local state drifts.

---

## 14. Observability & Performance Strategy
## 6. Data Flow & Synchronization

### 6.1 Input Flow
1. User interacts with UI.
2. Application Logic validates input.
3. Infrastructure Layer writes to **Local SQLite**.
4. Sync Engine queues a "Push" job.

### 6.2 Synchronization Flow (Offline-First)
- **Offline**: Writes are queued in a local `SyncQueue` table.
- **Online**: Sync Engine processes the queue, pushing changes to Supabase via Delta updates.
- **Conflicts**: Last-write-wins by default, with "Diff & Resolve" UI for complex data (Notes/Docs).

---

## 7. Database Architecture

### 7.1 Local Database (SQLite)
- **Schema**: Mirror of Supabase relational schema.
- **Purpose**: Low-latency reads and offline persistence.
- **Versioning**: Managed via migration scripts bundled with the Tauri binary.

### 7.2 Cloud Database (Supabase / PostgreSQL)
- **Schema**: Multi-tenant (Workspace isolated).
- **Purpose**: Source of truth, Collaboration, Backup.

### 7.3 Secure Storage
- **Secrets**: API Keys, SSH Keys, Database Passwords.
- **Tech**: Stored in system keychain (macOS), Credential Manager (Windows), or Secret Service (Linux).

---

## 8. Search & Command Palette

### 8.1 Universal Search
- **Indexing**: Background worker indexes Tasks, Projects, Notes, and Git history.
- **Ranking**: Weighted by Recency, Frequency, and Relevance.
- **Pipeline**: `Search Trigger -> Local Index Query -> (Optional) Semantic AI Search -> Grouped Results`.

### 8.2 Command Palette (`Cmd+K`)
- **Registry**: Central registry of all executable commands across modules.
- **Context**: Commands are filtered based on the active module (e.g., Git commands only visible in Dev Workspace).

---

## 9. Security Architecture

- **Workspace Isolation**: Row Level Security (RLS) in Supabase ensures data privacy.
- **Process Isolation**: Tauri's multi-process model keeps the UI (WebView) separate from the system (Rust).
- **Audit Logs**: Every sensitive operation (Settings change, Export) is logged locally and synced.
- **Encryption**: Data at rest (SQLite) can be encrypted with a user-provided master password.

---

## 10. Technology Stack

- **Desktop Framework**: Tauri v2 (Rust)
- **Frontend Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State Management**: Zustand (Global), TanStack Query (Server State)
- **Local Storage**: SQLite (via `tauri-plugin-sql`)
- **Cloud Backend**: Supabase (Auth, DB, Realtime, Edge Functions)
- **Rich Editor**: Monaco Editor (for Code), Tiptap (for Notes)
- **Terminal**: xterm.js
- **Animations**: Framer Motion

---

## 11. Folder Architecture

```text
primordial-task/
├── src-tauri/               # Native Rust logic (PTY, Git, DB Bridge)
├── src/
│   ├── app/                 # Root application setup (Providers, Router)
│   ├── features/            # Feature-based modules (Self-contained)
│   │   ├── task/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   └── ...
│   ├── shared/              # Cross-feature utilities
│   │   ├── components/      # UI components (shadcn)
│   │   ├── hooks/           # Generic hooks (useLocalStorage, etc.)
│   │   ├── services/        # Global services (API, Logger)
│   │   └── ui/              # Design system primitives
│   ├── core/                # Clean Architecture layers
│   │   ├── domain/          # Pure entities & interfaces
│   │   ├── infrastructure/  # Repositories & Adapters
│   │   └── native/          # Tauri IPC wrappers
│   └── assets/              # Static files
├── database/                # SQLite Migrations & Seeds
└── scripts/                 # Build & Tooling scripts
```

---

## 12. Coding Standards

- **Functional Components**: Use `const Component: FC = () => { ... }`.
- **Repository Pattern**: All data access must go through a Repository interface to allow mocking.
- **Naming**: `PascalCase` for components/types, `camelCase` for variables/functions, `kebab-case` for files.
- **Imports**: Use absolute paths (`@/features/...`).
- **Hooks**: Logic must be extracted into custom hooks; components should focus on rendering.

---

## 13. Testing Strategy

- **Unit (Vitest)**: Business logic, utility functions, pure domain rules.
- **Integration (Testing Library)**: Feature workflows and component interactions.
- **E2E (Playwright)**: Critical user paths (Login -> Create Task -> Sync).
- **Accessibility**: Automated `axe` checks in CI/CD.
- **Native (Rust)**: Native logic tested via `cargo test`.

---

## 14. Deployment & Maintenance

- **Release Channels**: Stable, Beta, Nightly.
- **Auto-Update**: Managed via Tauri's built-in updater.
- **Error Observability**: Sentry for frontend/native crash reporting; custom telemetry for sync health.
- **Migrations**: SQLite migrations are applied on app startup before the UI renders.

---

## 15. Scalability & Future-Proofing

- **Plugin System**: Planned SDK for third-party widgets and AI prompts.
- **Extension SDK**: Infrastructure to allow users to build custom "Viewers" for specialized data types.
- **Enterprise Ready**: Designed for multi-workspace, multi-tenant environments from day one.

---

## 16. Quality Bar

The architecture is complete when it enables a seamless, lag-free experience for power users, maintains perfect data integrity through complex offline/online transitions, and allows the development team to ship new features with confidence and speed.
