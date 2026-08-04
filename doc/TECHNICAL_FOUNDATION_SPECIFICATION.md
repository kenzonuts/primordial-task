# Primordial Task Technical Foundation Master Specification

Version: 1.0  
Phase: 16  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop (Windows, macOS, Linux)  
Architecture: Offline-First, Cloud-Sync, AI-Native, Modular

---

## Table of Contents
1. [Section 01: Database Specification](#section-01-database-specification)
2. [Section 02: API Specification](#section-02-api-specification)
3. [Section 03: Component Library](#section-03-component-library)
4. [Section 04: AI Prompt Library](#section-04-ai-prompt-library)
5. [Section 05: Coding Agent Rules](#section-05-coding-agent-rules)

---

## SECTION 01: DATABASE SPECIFICATION

### 1.1 Architectural Overview
Primordial Task uses a **Hybrid Relational Architecture**. 
- **Local Persistence**: SQLite (via Tauri-plugin-sql) for zero-latency offline access.
- **Cloud Persistence**: Supabase (PostgreSQL) for cross-device synchronization and collaboration.
- **Sync Strategy**: Delta-based synchronization with a local `sync_queue` to handle offline-to-online transitions.

### 1.2 Entity List & Schema

#### Core Identity & Access
| Table | Columns | Purpose |
| --- | --- | --- |
| `users` | `id (PK)`, `email`, `display_name`, `avatar_url`, `created_at`, `updated_at` | Global user profile. |
| `workspaces` | `id (PK)`, `name`, `owner_id (FK)`, `slug`, `settings_json`, `created_at` | Organizational containers. |
| `workspace_members` | `workspace_id (FK)`, `user_id (FK)`, `role (Admin/Member/Observer)` | Membership and permissions. |
| `sessions` | `id (PK)`, `user_id (FK)`, `device_id`, `token_hash`, `expires_at` | Active user sessions. |

#### Project & Task Management
| Table | Columns | Purpose |
| --- | --- | --- |
| `projects` | `id (PK)`, `workspace_id (FK)`, `name`, `description`, `local_path`, `type` | Project metadata and folder links. |
| `tasks` | `id (PK)`, `project_id (FK)`, `parent_id (FK)`, `title`, `description`, `status_id (FK)`, `priority`, `due_date`, `assignee_id (FK)`, `order_index` | Atomic units of work. |
| `task_status` | `id (PK)`, `workspace_id (FK)`, `label`, `color`, `is_final` | Custom workflow states. |
| `task_history` | `id (PK)`, `task_id (FK)`, `user_id (FK)`, `change_json`, `created_at` | Audit trail for task updates. |
| `comments` | `id (PK)`, `task_id (FK)`, `user_id (FK)`, `body`, `created_at` | Task-level collaboration. |

#### Developer Workspace
| Table | Columns | Purpose |
| --- | --- | --- |
| `git_repositories` | `id (PK)`, `project_id (FK)`, `path`, `remote_url`, `last_index_at` | Local git repo tracking. |
| `db_connections` | `id (PK)`, `project_id (FK)`, `type`, `host`, `port`, `credentials_vault_id` | Database connection profiles. |
| `api_collections` | `id (PK)`, `project_id (FK)`, `name`, `environment_json` | API testing groups. |
| `api_requests` | `collection_id (FK)`, `method`, `url`, `headers_json`, `body_json` | Individual API endpoints. |
| `code_snippets` | `id (PK)`, `user_id (FK)`, `title`, `body`, `language`, `tags` | Reusable code fragments. |

#### AI & Analytics
| Table | Columns | Purpose |
| --- | --- | --- |
| `ai_conversations` | `id (PK)`, `workspace_id (FK)`, `title`, `context_type`, `created_at` | AI chat threads. |
| `ai_messages` | `conversation_id (FK)`, `role`, `content`, `tokens`, `model`, `created_at` | Individual AI turns. |
| `ai_memory` | `id (PK)`, `user_id (FK)`, `key`, `value_json`, `vector_id` | Long-term AI context (RAG). |
| `audit_logs` | `id (PK)`, `workspace_id (FK)`, `user_id (FK)`, `action`, `metadata_json` | Security audit trail. |

#### Task & Project Extensions
| Table | Columns | Purpose |
| --- | --- | --- |
| `task_priorities` | `id (PK)`, `label`, `value`, `color` | Standardized priority levels. |
| `subtasks` | `id (PK)`, `parent_task_id (FK)`, `title`, `is_completed` | Nested task items. |
| `checklists` | `id (PK)`, `task_id (FK)`, `title` | Structured lists within tasks. |
| `checklist_items` | `checklist_id (FK)`, `content`, `is_checked` | Individual checklist entries. |
| `attachments` | `id (PK)`, `task_id (FK)`, `file_url`, `file_type`, `size` | File links. |
| `tags` | `id (PK)`, `workspace_id (FK)`, `label`, `color` | Cross-project categorization. |
| `task_tags` | `task_id (FK)`, `tag_id (FK)` | Many-to-many relationship. |

#### Documentation & Notes
| Table | Columns | Purpose |
| --- | --- | --- |
| `notes` | `id (PK)`, `project_id (FK)`, `title`, `body_json`, `created_at` | Long-form project notes. |
| `documentation_pages` | `id (PK)`, `workspace_id (FK)`, `slug`, `content_md`, `parent_id (FK)` | Internal workspace wiki. |

#### System & Integration
| Table | Columns | Purpose |
| --- | --- | --- |
| `notifications` | `id (PK)`, `user_id (FK)`, `type`, `body`, `read_at`, `link` | In-app alerts. |
| `plugins` | `id (PK)`, `name`, `version`, `is_enabled`, `config_json` | Extension metadata. |
| `activity_logs` | `id (PK)`, `workspace_id (FK)`, `entity_type`, `entity_id`, `action` | High-level activity feed. |
| `sync_queue` | `id (PK)`, `operation`, `table_name`, `payload_json`, `status` | Offline sync management. |
| `devices` | `id (PK)`, `user_id (FK)`, `os`, `app_version`, `last_active` | Tracking user hardware. |
| `environment_variables` | `project_id (FK)`, `key`, `value_encrypted`, `is_secret` | Developer environment vars. |
| `calendar_events` | `id (PK)`, `user_id (FK)`, `title`, `start_at`, `end_at` | User schedule. |
| `timeline_items` | `id (PK)`, `project_id (FK)`, `start_date`, `end_date`, `task_id` | Gantt/Timeline data. |

### 1.3 Synchronization & Performance
- **Conflict Resolution**: `updated_at` timestamps with "Last Write Wins" for atomic fields. JSON merging for complex metadata.
- **Soft Delete**: `deleted_at` column on all primary tables; filtered out by default in queries.
- **Indexing**: Composite indexes on `(workspace_id, deleted_at)` and `(project_id, order_index)` for all list views.
- **Backup**: Daily automated SQLite dumps to `~/Documents/Primordial/Backups` + Supabase PITR (Point-in-Time Recovery).

---

## SECTION 02: API SPECIFICATION

### 2.1 Design Principles
- **Style**: RESTful JSON API.
- **Authentication**: Bearer JWT (Supabase Auth).
- **Authorization**: Row Level Security (RLS) + RBAC (Admin/Member).
- **Realtime**: Supabase Realtime (WebSockets) for task updates and presence.

### 2.2 Core Endpoints (Selected)

#### Workspaces & Projects
- `GET /workspaces`: List all workspaces for the current user.
- `POST /workspaces`: Create a new workspace.
- `GET /workspaces/{id}/projects`: Fetch projects within a workspace.
- `PATCH /projects/{id}`: Update project metadata or local path link.

#### Tasks & Workflow
- `GET /projects/{id}/tasks`: Fetch tasks with filters (`status`, `priority`, `assignee`).
- `POST /tasks`: Create a new task (supports optimistic local ID).
- `PATCH /tasks/{id}`: Update task properties (triggers `task_history` log).
- `GET /tasks/{id}/comments`: Fetch task conversation.

#### Developer Workspace
- `POST /developer/git/scan`: Trigger a local folder scan for Git repositories.
- `POST /developer/db/query`: Execute a query against a saved connection (Tauri native bridge).
- `GET /developer/api/collections`: Fetch API testing collections.

#### AI Services
- `POST /ai/chat/stream`: SSE (Server-Sent Events) endpoint for streaming AI responses.
- `GET /ai/context`: Fetch computed semantic context for the current active item.

### 2.3 Error Responses
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "User does not have access to workspace X",
    "details": { "workspace_id": "..." }
  }
}
```

---

## SECTION 03: COMPONENT LIBRARY

### 3.1 Design Tokens (Phase 01)
- **Palette**: `gray.0` (White) to `gray.950` (Deep Black).
- **Typography**: Inter (UI), JetBrains Mono (Code).
- **Radius**: `sm: 4px`, `md: 8px`, `lg: 12px`.

### 3.2 Key Components

| Component | Purpose | Interaction |
| --- | --- | --- |
| **Command Palette** | Global navigation & action hub. | `Cmd+K` to open; fuzzy search; action execution. |
| **Data Grid** | High-performance list/table for tasks and DB. | Virtualized scrolling; column reorder; keyboard nav. |
| **Monaco Editor** | Code editing and query writing. | Language support; AI completions; Git diff markers. |
| **Kanban Card** | Visual task representation. | Drag-and-drop; quick edit on hover; status badges. |
| **Status Badge** | Semantic status indicator. | Monochrome by default; status colors for success/danger. |
| **Tree View** | File explorer and navigation hierarchy. | Keyboard navigation (Arrows); drag-and-drop move. |

### 3.3 Accessibility
- **WCAG 2.1 AA**: Minimum contrast ratios of 4.5:1.
- **Keyboard**: 100% functionality via `Tab`, `Enter`, `Esc`, and custom `Cmd` shortcuts.
- **Screen Readers**: Aria-labels on all icon-only buttons; live regions for sync status.

---

## SECTION 04: AI PROMPT LIBRARY

### 4.1 Git & Development
- **Commit Message**: "Analyze the following git diff and generate a conventional commit message. Input: [Diff]. Output: [Type]([Scope]): [Summary]."
- **Code Review**: "Scan the selected code for security vulnerabilities, performance bottlenecks, and adherence to [Design System]. Input: [Code Block]."
- **SQL Generator**: "Given the schema [Schema], translate this natural language request into a PostgreSQL query. Request: [User Prompt]."

### 4.2 Planning & Management
- **Sprint Summary**: "Distill the activity of the last 14 days in project [X] into a high-level executive summary. Highlight blockers and velocity."
- **Task Breakdown**: "Break down the goal '[Goal]' into a logical list of subtasks with priority and effort estimations."

### 4.3 Safety & System Rules
- **Rule**: Never expose API keys or secrets in prompt outputs.
- **Rule**: Cite sources using `[Task #ID]` or `[Doc Name]` markers.

---

## SECTION 05: CODING AGENT RULES

### 5.1 Universal Rules
- **NEVER bypass the Type System**: Avoid `any`. Use explicit interfaces defined in `packages/types`.
- **NEVER duplicate components**: Check `packages/shared/ui` before creating new atoms or molecules.
- **NEVER modify database schema without a migration**: All SQL changes must live in `database/migrations`.
- **ALWAYS write tests**: Every new service or logic hook requires a `*.test.ts` file (Vitest).
- **ALWAYS update documentation**: Changes to APIs or state must be reflected in the corresponding `.md` file.

### 5.2 Git & PR Standards
- **Commit Style**: Use Conventional Commits.
- **Surgical Edits**: Prefer targeting specific lines/functions. Avoid rewriting entire files unless necessary for refactoring.
- **Review Checklist**: Accessibility, Performance, Security, Logic, Style.

---

## IMPLEMENTATION NOTES

### Developer Workflow
1. **Branch**: `feat/` or `fix/` from `develop`.
2. **Local DB**: Run `npm run db:up` to start local SQLite and seed data.
3. **Frontend**: Use `npm run dev` for Tauri + HMR.
4. **Validation**: `npm run quality` runs lint, type-check, and tests.

### Quality Bar
The implementation is successful when it passes all **Quality Gates**:
- Lint: 0 errors.
- Tests: 100% pass, >80% coverage.
- Accessibility: 0 critical Axe violations.
- Performance: <2s startup; <50ms search latency.

---
**END OF SPECIFICATION**
