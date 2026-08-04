# Primordial Task Engineering & Development Blueprint

Version: 1.0  
Phase: 15  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop (Windows, macOS, Linux)  
Architecture: Offline-First, Cloud-Sync, AI-Native, Modular

---

## 1. Engineering Principles

**Purpose**  
To establish a shared mental model and decision-making framework for all technical contributors, ensuring long-term maintainability and system integrity.

**Engineering Rules**  
- **Keep It Simple (KISS)**: Prioritize readable code over clever optimizations.
- **SOLID & Clean Architecture**: Logic must be decoupled from frameworks.
- **Single Responsibility**: Every module, class, and function must do one thing well.
- **Feature-Driven Development**: Organize code by user value, not technical layer.
- **Composition over Inheritance**: Build complex behaviors by combining simple, isolated units.
- **Repository Pattern**: Abstract data access to allow for easy testing and swappable backends (SQLite/Supabase).

**Implementation Standards**  
- All business logic lives in `features/` or `core/domain/`.
- Infrastructure details (API clients, DB adapters) live in `core/infrastructure/`.
- UI components must be stateless where possible, delegating logic to custom hooks.

---

## 2. Development Methodology

**Purpose**  
To define a predictable, high-velocity delivery rhythm that balances feature development with quality and stability.

**Engineering Workflow**  
- **Scrum-lite**: 2-week sprints with Sprint Planning, Daily Sync, and Retrospectives.
- **Backlog Refinement**: Weekly session to ensure stories are ready (Definition of Ready).
- **Estimation**: Use Fibonacci story points for complexity, not hours.
- **Feature Freeze**: 48 hours before a major release; only critical bug fixes allowed.

---

## 3. Project Structure (TurboRepo Monorepo)

**Purpose**  
To organize the codebase for scalability, modularity, and rapid builds.

**Folder Organization**  
- `apps/desktop/`: Tauri + React entry point.
- `packages/features/`: Self-contained business modules (Task, AI, Dev Workspace).
- `packages/shared/`: Shared UI components, hooks, and utilities.
- `packages/core/`: Domain models, abstract repositories, and native bridge logic.
- `packages/ai/`: AI orchestration, prompt registry, and model adapters.
- `database/`: SQLite migrations, seed scripts, and schema definitions.
- `scripts/`: CI/CD, build, and developer productivity tools.

---

## 4. Coding Standards

**Purpose**  
To ensure consistency across the codebase, making it easier for any engineer (or AI agent) to navigate and contribute.

**Naming Conventions**  
- **Components**: `PascalCase` (e.g., `TaskCard.tsx`).
- **Files/Folders**: `kebab-case` (e.g., `user-profile/`).
- **Variables/Functions**: `camelCase`.
- **Interfaces/Types**: `PascalCase`, prefixed with `I` only if it represents a contract (e.g., `ITaskRepository`).
- **Hooks**: Prefixed with `use` (e.g., `useActiveProject.ts`).

**Implementation Standards**  
- **React**: Functional components only. No class components.
- **TypeScript**: Strict mode enabled. `any` is forbidden. Use `unknown` or generics.
- **Imports**: Absolute paths (`@/shared/...`). No relative `../../` nesting.

---

## 5. Git & Branching Strategy

**Purpose**  
To manage concurrent development and release cycles safely.

**Workflow Rules**  
- **Branching**: `main` (Stable), `develop` (Integration), `feature/*`, `hotfix/*`, `release/*`.
- **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(task): add drag-and-drop to kanban`).
- **Pull Requests**:
    - Minimum 2 approvals required.
    - All CI checks (Lint, Type, Test) must pass.
    - Squash and Merge to keep history clean.

---

## 6. Database & API Standards

**Purpose**  
To ensure data integrity, performance, and predictable communication.

**Database Rules**  
- **Naming**: `snake_case` for tables and columns.
- **Integrity**: Use Foreign Keys and Constraints at the DB level, not just the app level.
- **Soft Delete**: Use `deleted_at` column for user-facing data.
- **Migrations**: Never modify a migration once it is merged. Create a new one.

**API Rules**  
- **REST**: Follow standard HTTP methods and status codes.
- **Realtime**: Use Supabase Realtime for collaborative features only.
- **Validation**: Every request must be validated using `zod` or equivalent.

---

## 7. AI Development & Agent Guidelines

**Purpose**  
To govern how AI features are built and how AI agents are used to accelerate development without compromising quality.

**AI Engineering Rules**  
- **Prompt Registry**: Store all prompts in versioned files, never hardcoded in strings.
- **Provider Abstraction**: All AI calls must go through the `AiService` wrapper.
- **Token Budgeting**: Implement monitoring and limits per user/workspace.
- **Context Management**: Use RAG (Local SQLite index) to provide minimal, relevant context to LLMs.

**AI Coding Agent Rules**  
1. **Architectural Integrity**: Never modify core architecture (`packages/core/`) without human approval.
2. **Design System**: Never violate `DESIGN_SYSTEM.md` monochrome tokens or component logic.
3. **Business Rules**: Never bypass validation or permission logic.
4. **DRY (Don't Repeat Yourself)**: Always search for existing components/hooks before creating new ones.
5. **Testing**: Always generate Vitest unit tests for any new logic.
6. **Documentation**: Always update relevant `.md` files or TSDoc comments when code changes.
7. **Brevity & Quality**: Prefer surgical `replace` calls over full file rewrites to minimize context usage.
8. **Compatibility**: Maintain backwards compatibility for local SQLite schemas during migrations.

---

## 16. Acceptance Criteria (AC) Standards

**Purpose**  
To ensure every feature is built to a measurable, high-quality standard.

**Standard AC Format**  
Every feature specification must include:
- **Functional AC**: "Given [context], when [action], then [result]."
- **Non-Functional AC**: Accuracy, reliability, and usability requirements.
- **Performance Criteria**: Specific latency or resource usage targets.
- **Security Criteria**: Required permission checks or data masking.
- **Accessibility Criteria**: Specific keyboard and screen reader expectations.

---

## 17. Definition of Done (DoD)

**Purpose**  
To define a predictable, multi-layered state management strategy that supports offline-first operations and real-time synchronization.

**Engineering Rules**  
- **Server State (TanStack Query)**: Primary source of truth for remote data. Handles caching, revalidation, and background fetching.
- **Client State (Zustand)**: For global UI state, active selections, and temporary workspace configurations.
- **Native State (SQLite)**: Persistent local storage for offline access. Synchronized via the Sync Engine.
- **Secure State (OS Keychain)**: For encrypted storage of secrets and credentials.

**Implementation Standards**  
- Use "Optimistic Updates" for all user actions to ensure perceived zero-latency.
- Implement an `OfflineQueue` in SQLite to track pending writes for the sync engine.

---

## 9. Accessibility (a11y) Requirements

**Purpose**  
To ensure Primordial Task is usable by all developers, regardless of their physical abilities or input devices.

**Engineering Rules**  
- **Keyboard Navigation**: 100% of functionality must be reachable via keyboard.
- **Focus Management**: Focus must be logically managed during navigation and modal interactions.
- **ARIA**: Use semantic HTML and ARIA labels for technical visualizations (e.g., Git Graph, Kanban).
- **Reduced Motion**: Respect system settings to disable non-essential animations.

---

## 10. Testing Strategy

...

---

## 11. CI/CD Pipeline

**Purpose**  
To automate quality control and delivery across all target platforms.

**Pipeline Stages**  
1. **Lint & Format**: Run ESLint and Prettier.
2. **Type Check**: Run `tsc` for full project validation.
3. **Unit & Integration Tests**: Run Vitest suite.
4. **Build (Tauri)**: Generate binaries for Windows, macOS (Intel/Silicon), and Linux.
5. **E2E Tests**: Run Playwright against the production-built binaries.
6. **Sign & Notarize**: Apply developer signatures and macOS notarization.
7. **Publish**: Distribute to release channels (GitHub Releases, Auto-updater).

---

## 12. Release Management

**Purpose**  
To define a stable and transparent process for delivering software to end users.

**Release Channels**  
- **Alpha (Internal)**: Daily builds for the engineering team.
- **Beta (Early Access)**: Weekly builds for power users.
- **Stable**: Monthly verified releases for the general public.

**Versioning**  
- Use [Semantic Versioning (SemVer)](https://semver.org/).
- Automated changelog generation based on conventional commit history.

---

## 13. Observability & Monitoring

**Purpose**  
To proactively detect and diagnose issues in production.

**Observability Strategy**  
- **Logging**: Structured logs with levels (Debug, Info, Warn, Error).
- **Telemetry**: Anonymous usage metrics to track feature adoption (opt-in).
- **Crash Reporting**: Sentry integration for both React (JS) and Tauri (Rust) layers.
- **Performance Tracing**: Monitor sync latency and database query performance.

---

## 14. Documentation Standards

**Purpose**  
To maintain a high-signal, self-documenting ecosystem.

**Standard Doc Types**  
- **Architecture (ADRs)**: Document significant architectural decisions and their rationale.
- **API (OpenAPI)**: Document all internal and external endpoints.
- **Developer Guide**: Setup, workflows, and "How-To" for new contributors.
- **AI Context (GEMINI.md)**: Standardized instructions for AI agents in each directory.

---

## 15. Engineering Checklists

### Before Merge (PR Checklist)
- [ ] Conventional commit message used.
- [ ] No `TODO` or `FIXME` comments left in code.
- [ ] All tests pass locally.
- [ ] No new lint/type errors introduced.
- [ ] PR description includes "Why" and "How".

### Before Release Checklist
- [ ] All Release Candidate (RC) tests pass on all 3 OS platforms.
- [ ] Changelog updated and verified.
- [ ] Security audit for new dependencies.
- [ ] Manual smoke test of critical sync and AI features.

---

## 16. Definition of Done (DoD)

**Requirement List**  
- [ ] Code follows naming and architectural standards.
- [ ] Logic is covered by Unit and Integration tests.
- [ ] Accessibility (Keyboard, ARIA) is verified.
- [ ] Performance meets targets (Startup, Memory).
- [ ] Documentation (Markdown/TSDoc) is updated.
- [ ] Feature is verified in the build for at least one OS.
- [ ] PR is reviewed and approved by at least 2 engineers.

---

## 10. Performance & Security Targets

**Performance**  
- **Startup**: < 2 seconds to interactive state.
- **Memory**: < 300MB idle, < 800MB under heavy developer load.
- **List Rendering**: Virtualized for > 100 items.

**Security**  
- **Secrets**: Zero plain-text API keys in logs or local storage.
- **Workspace Isolation**: Verified Row Level Security (RLS) in Supabase.
- **Native Security**: Scoped file system permissions in Tauri.

---

## 11. Technology Stack Implementation

- **Desktop**: Tauri v2 (Rust commands for FS, Git, PTY).
- **Frontend**: React 19, TypeScript, Tailwind CSS v4.
- **State**: Zustand (Global), TanStack Query (Server/Cloud), SQLite (Local Cache).
- **DevOps**: GitHub Actions (Lint, Test, Build, Sign).
- **AI**: Gemini (Primary), Claude/OpenAI (Fallbacks), Ollama (Local).

---

## 12. Stakeholder Implementation Notes

### Frontend Notes
- Focus on "Optimistic Updates" for all UI actions to mask network latency.
- Strictly adhere to `DESIGN_SYSTEM.md` monochrome tokens.

### Backend/Native Notes
- Heavy operations (Git indexing, DB migrations) must run on a background thread in Rust.
- Implement robust retry logic for the Offline-First sync queue.

### DevOps Notes
- Ensure all builds are signed and notarized for macOS and Windows.
- Implement "Preview Environments" for PRs where possible.

### AI Engineering Notes
- Maintain a local vector index of the codebase for AI-assisted workspace features.
- Implement prompt "Evals" to monitor for regressions in AI response quality.

---

## 13. Engineering Quality Gates

| Gate | Check | Failure Action |
| --- | --- | --- |
| **Lint/Format** | ESLint + Prettier | Block PR |
| **Type Check** | `tsc` | Block PR |
| **Unit Tests** | Coverage > 80% | Block PR |
| **Sign-off** | 2 Senior Reviews | Block Merge |
| **Security Scan** | Dependency audit | Block Build |

---

## 14. Quality Bar

The engineering organization is successful when features are shipped with **zero regressions**, the application feels **instantaneous** to the end user, and the codebase remains **self-documenting and accessible** to both humans and AI agents.
