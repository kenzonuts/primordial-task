# Primordial Task Developer Workspace Specification

Version: 1.0  
Phase: 12  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [AI Workspace Specification](./AI_WORKSPACE_SPECIFICATION.md)

---

## 1. Product Overview

The **Developer Workspace** is the high-performance integrated development environment (IDE) core of Primordial Task. It consolidates the essential tools of software engineering—Git, Databases, APIs, Terminals, Containers, and Snippets—into a single, cohesive desktop application. 

By eliminating context switching between disparate tools (VS Code, Postman, DBeaver, Docker Desktop), the Developer Workspace empowers engineers to manage the entire development lifecycle within one unified, AI-enhanced interface.

---

## 2. Objectives

- **Unify**: Bring Git, DB, API, and Terminal into one workspace.
- **Simplify**: Reduce visual noise and focus on high-signal developer data.
- **Enhance**: Infuse every module with context-aware AI assistance.
- **Automate**: Detect frameworks, sync environments, and generate boilerplate.
- **Secure**: Provide local-first, encrypted storage for credentials and secrets.

---

## 3. Design Philosophy

- **Performance First**: Interactions must feel instantaneous. No layout thrashing.
- **High Information Density**: Designed for power users who need to scan complex data quickly.
- **Monochrome & Minimal**: Focus on the code and data, not the UI chrome.
- **Contextual Intelligence**: The workspace knows your active project and adjusts tools accordingly.

---

## 4. User Flow

```text
Workspace Selection
  ↓
Developer Workspace (Module: Dashboard)
  ↓
Navigation (Sidebar/Command Palette)
  ↓
Development Task (e.g., Commit Code, Query DB, Test API)
  ↓
AI Assistance (e.g., Generate SQL, Suggest Commit Message)
  ↓
Real-time Feedback (Logs, Notifications, Terminal Output)
  ↓
Synchronization (Git Push, Cloud Sync, Team Updates)
```

- **Transition: Dashboard to Module**: Smooth transition via sidebar or `Cmd+K`. The active module's state is preserved.
- **Transition: Context Switch**: Changing the active "Local Project" triggers a re-scan of Git, DB connections, and Environment variables relevant to that project.

---

## 5. Global Search & Command Palette

### Purpose
The nervous system of the workspace. Provides instant access to any resource or command across all modules.

### Global Search
- **Scope**: Repositories, Files, Commits, Branches, Databases, Tables, API Collections, Requests, Snippets, Env Vars, Logs, Terminal History.
- **Behavior**: Fuzzy matching, keyboard-centric, grouped results with module icons.

### Command Palette (`Cmd+K` / `Ctrl+K`)
- **Actions**: "Open Project", "Run Command", "Connect Database", "Run SQL", "Git Commit", "Generate Documentation".
- **AI Integration**: Ask questions directly in the palette; it routes to the AI Workspace.

---

## 6. Required Modules

### 6.1 Developer Dashboard

**Purpose**  
The central hub for current development status and quick actions.

**Business Rules**  
- Show data only for the active workspace/project.
- Real-time updates for Git status and running services.

**Layout**  
- Multi-column grid of widgets.
- Customizable widget order and visibility.

**Components**  
- **Git Status Widget**: Branch name, uncommitted changes count, ahead/behind status.
- **Recent Commits Widget**: List of the last 5 commits with hash and summary.
- **Running Services**: Status of Docker containers or background terminal processes.
- **Workspace Health**: Summary of linting, test coverage, or build status (Phase 10).

**Interactions**  
- Clicking a widget jumps to the corresponding module.
- "Refresh" button triggers a full workspace re-scan.

**Validation**  
- Widget data must time out if the source (e.g., Docker) is unreachable.

**Accessibility**  
- Widgets must be focusable via `Tab`.
- ARIA live regions for health status changes.

**Database Relationships**  
- Fetches from `Project`, `GitRepo`, `Container`, `APICollection`.

**API Requirements**  
- `GET /workspace/status`: Aggregated health and activity feed.

**State Management**  
- Dashboard state stored in `dashboardStore` (Zustand).

**Realtime Behavior**  
- WebSockets for container status and git file watching.

**Offline Strategy**  
- Cache last known status in SQLite for instant startup.

**Security**  
- No secrets displayed in dashboard widgets.

**Performance**  
- Lazy load widgets; prioritize Git and Project metadata.

**Implementation Notes**  
- Use `Reorder.Group` (Framer Motion) for widget customization.
- **UX Reasoning**: Reduces "blank page" syndrome by showing where the user left off.
- **Frontend**: Dashboard widgets share a `WidgetCard` base component.
- **Backend**: Polling/Event-driven updates from background watchers.

---

### 6.2 Git Integration

**Purpose**  
Comprehensive Git client for managing version control without leaving the app.

**Business Rules**  
- Support standard Git operations (Commit, Push, Pull, Merge, Rebase).
- Multi-repository support within one project.

**Layout**  
- Three-pane layout: Repo/Branch list (Left), Change list (Middle), Diff viewer/Commit form (Right).

**Components**  
- **Git Graph**: Visual branch history and merge points.
- **Diff Viewer**: Side-by-side or unified diff (Monaco Editor).
- **Commit Form**: Subject, description, AI "Generate" button.

**Interactions**  
- Drag and drop files to stage/unstage.
- Right-click branch for Merge/Rebase options.
- Click commit hash to view full diff.

**Validation**  
- Prevent commit with empty message.
- Conflict detection before merge.

**Accessibility**  
- Keyboard shortcuts for Stage (`Cmd+S`), Unstage (`Cmd+U`), Commit (`Cmd+Enter`).

**Database Relationships**  
- `GitRepo` (path, remote_url, metadata).

**API Requirements**  
- `GET /git/status`: Current repo state.
- `POST /git/commit`: Execute commit.
- `POST /git/push`: Push to remote.

**State Management**  
- `gitStore` tracks staging area, current branch, and diff data.

**Realtime Behavior**  
- FS Watcher (Tauri) triggers Git status refresh on file changes.

**Offline Strategy**  
- Full local Git functionality (it's Git).

**Security**  
- SSH/GPG key management via system keychain.

**Performance**  
- Virtualized Git history list for large repos.
- Background indexing of commits for fast search.

**Implementation Notes**  
- Use `isomorphic-git` or native Git binary via Tauri `Command`.
- **UX Reasoning**: Mimic GitHub Desktop simplicity with VS Code power.
- **Frontend**: Monaco Diff Editor for code comparisons.
- **DevOps**: Ensure Git binaries are bundled for each OS.

---

### 6.3 Local Project Manager

**Purpose**  
Scan and organize local folders into manageable "Projects" within the workspace.

**Business Rules**  
- Auto-detect frameworks (React, Go, Python, etc.) via `package.json`, `go.mod`, etc.
- Support "Pinning" and "Favorites".

**Layout**  
- List or Grid view of detected projects.
- Metadata panel for selected project.

**Components**  
- **Project Card**: Name, path, framework icon, last opened date.
- **Scan Dialog**: Select folder to scan for projects.

**Interactions**  
- Double-click project to "Activate" in the workspace.
- Right-click "Open in VS Code" or "Show in Finder/Explorer".

**Validation**  
- Check if project path still exists on disk.

**Accessibility**  
- List keyboard navigation (Arrow keys, Enter).

**Database Relationships**  
- `Project` (id, path, type, metadata).

**API Requirements**  
- `GET /local/projects`: List saved projects.
- `POST /local/scan`: Start directory scan.

**State Management**  
- `projectStore` tracks the active project and recently used list.

**Realtime Behavior**  
- Background worker updates project metadata (e.g., repo status).

**Offline Strategy**  
- Local SQLite cache of project metadata and icons.

**Security**  
- Only scan folders explicitly permitted by the user (Tauri FS permissions).

**Performance**  
- Throttled folder scanning to prevent CPU spikes.

**Implementation Notes**  
- **UX Reasoning**: Quick entry point for daily work.
- **Frontend**: Framework-specific icons for visual recognition.
- **QA**: Test with deeply nested directories and massive folders.

---

### 6.4 File Explorer

**Purpose**  
Native-feeling file browser for the active project.

**Business Rules**  
- Respect `.gitignore`.
- Support standard FS operations (Create, Delete, Rename, Move).

**Layout**  
- Collapsible tree view.

**Components**  
- **Tree Item**: Icon, name, git status color (Phase 01 status tokens).
- **Quick Open**: `Cmd+P` style file search.

**Interactions**  
- Single click to preview, double click to open.
- Drag and drop for moving files/folders.

**Validation**  
- Filename collision check.

**Accessibility**  
- Full tree keyboard navigation (Left/Right to collapse/expand, Up/Down to navigate).

**State Management**  
- `fileStore` tracks expanded folders and active selection.

**Realtime Behavior**  
- Tauri FS watcher for immediate UI updates on external changes.

**Offline Strategy**  
- Fully local.

**Security**  
- Prevent access outside project root unless explicitly authorized.

**Performance**  
- Virtualized tree for repositories with 100k+ files.

**Implementation Notes**  
- Use `react-virtuoso` or `react-window` for tree virtualization.
- **UX Reasoning**: Minimalist design with high-signal Git status overlays.
- **Frontend**: Custom icons for 100+ file extensions.

---

### 6.5 Database Manager

**Purpose**  
Multi-database GUI client for PostgreSQL, MySQL, SQLite, MongoDB, and Redis.

**Business Rules**  
- Connection profile management with encrypted password storage.
- Support for SSH tunneling.

**Layout**  
- Sidebar (Connections/Tables), Center (Query Editor/Results), Right (Schema Inspector).

**Components**  
- **Query Editor**: Monaco with SQL syntax highlighting and autocomplete.
- **Results Table**: High-performance grid with sorting, filtering, and export.
- **ER Diagram**: Visual representation of table relationships.

**Interactions**  
- `Cmd+Enter` to run SQL query.
- Right-click table to "View Data" or "Export Schema".

**Validation**  
- SQL syntax check before execution (where supported).

**Accessibility**  
- Accessible results table (headers, row IDs).

**Database Relationships**  
- `DbConnection` (id, type, host, encrypted_creds).

**API Requirements**  
- `POST /db/query`: Execute SQL/NoSQL command.
- `GET /db/schema`: Fetch database metadata.

**State Management**  
- `dbStore` manages active connections and query history.

**Realtime Behavior**  
- Streaming results for large datasets.

**Offline Strategy**  
- Query history stored locally in SQLite.

**Security**  
- Credentials stored in system keychain (via Tauri).
- Encryption for locally cached results.

**Performance**  
- Paginated/Virtualized result sets.
- Connection pooling.

**Implementation Notes**  
- Use native drivers via Tauri sidecars or Node.js bridge.
- **UX Reasoning**: DBeaver power with Cursor aesthetic.
- **AI**: "Generate SQL" integration in the query editor.

---

### 6.6 API Workspace

**Purpose**  
Integrated API testing and documentation tool (Postman/Insomnia alternative).

**Business Rules**  
- Support REST, GraphQL, WebSocket.
- Environment variable interpolation (e.g., `{{baseUrl}}`).

**Layout**  
- Sidebar (Collections/History), Center (Request Config), Bottom (Response Viewer).

**Components**  
- **Request Builder**: Method, URL, Headers, Body (JSON, Form, Raw).
- **Auth Manager**: OAuth2, Bearer, Basic, API Key.
- **Response Viewer**: Body (Pretty/Raw/Preview), Status, Time, Size.

**Interactions**  
- "Send" button or `Cmd+Enter`.
- Save requests to collections.

**Validation**  
- JSON body validation.
- URL format validation.

**Accessibility**  
- Readable response text; keyboard navigation for request tabs.

**Database Relationships**  
- `ApiCollection`, `ApiRequest`, `ApiEnv`.

**API Requirements**  
- `POST /api/test`: Relay request through backend/Tauri to avoid CORS.

**State Management**  
- `apiStore` for active requests and environment selection.

**Realtime Behavior**  
- WebSocket live connection viewer.

**Offline Strategy**  
- Collections and history stored in local SQLite.

**Security**  
- Mask secrets in logs.
- Encrypted environment variables.

**Performance**  
- Handle large JSON responses without UI freezing.

**Implementation Notes**  
- **UX Reasoning**: Contextual environment switching based on active project.
- **AI**: "Generate Request Body" from documentation/schema.

---

### 6.7 Snippet Manager

**Purpose**  
Personal and team code snippet repository.

**Business Rules**  
- Support for multiple languages.
- Organization via Tags and Categories.

**Layout**  
- Grid/List view with search and tag filters.

**Components**  
- **Snippet Editor**: Monaco with language detection.
- **Tag Cloud**: Quick filtering by technology.

**Interactions**  
- "Copy to Clipboard" with one click.
- "Insert in Editor" integration.

**Validation**  
- Required Title and Body.

**Database Relationships**  
- `Snippet` (id, title, body, language, tags).

**API Requirements**  
- `GET /snippets`: Fetch all.
- `POST /snippets`: Create/Update.

**State Management**  
- `snippetStore` for searching and filtering.

**Offline Strategy**  
- Fully local by default; sync optional.

**Security**  
- No secrets in snippets (automatic scanning).

**Performance**  
- Instant search across thousands of snippets.

**Implementation Notes**  
- **UX Reasoning**: Centralize knowledge; reduce "Google searching" for the same boilerplate.

---

### 6.8 Environment Manager

**Purpose**  
Manage secrets and environment variables across projects.

**Business Rules**  
- Profiles (Local, Dev, Staging, Prod).
- Encryption for sensitive values.

**Layout**  
- Table-based editor with "Secret" masking.

**Components**  
- **Variable Table**: Key, Value, Type (String/Secret), Profile.
- **Import/Export**: `.env` file support.

**Interactions**  
- Toggle "Eye" icon to reveal secrets.
- Bulk import from `.env`.

**Validation**  
- Prevent duplicate keys within a profile.

**Security**  
- AES-256 encryption for values marked as "Secret".
- Password protection for exports.

**API Requirements**  
- `POST /env/encrypt`: Securely store value.

**State Management**  
- `envStore` for active profile variables.

**Implementation Notes**  
- **UX Reasoning**: Avoid committing `.env` files by managing them in the UI.

---

### 6.9 Terminal Manager

**Purpose**  
Integrated multi-tab terminal.

**Business Rules**  
- Support for multiple shell profiles (Zsh, Bash, PowerShell).
- Persistent sessions (reconnect on restart).

**Layout**  
- Tabbed view; split-pane support.

**Components**  
- **Terminal Instance**: xterm.js powered.
- **Command History**: Searchable recent commands.

**Interactions**  
- `Cmd+T` for new tab.
- Drag tabs to reorder.

**Accessibility**  
- Screen reader support via xterm.js addons.

**API Requirements**  
- `WS /terminal`: PTY stream.

**State Management**  
- `terminalStore` tracks open tabs and active shell.

**Performance**  
- Low-latency input/output.

**Implementation Notes**  
- Use `node-pty` or Tauri-native PTY management.
- **UX Reasoning**: Stay in the app for build/test commands.

---

### 6.10 Developer Logs

**Purpose**  
Unified log viewer for Git, DB, API, and System events.

**Business Rules**  
- Log levels (Info, Warn, Error, Debug).
- Real-time tailing.

**Layout**  
- Console-like interface with level filtering.

**Components**  
- **Log Row**: Timestamp, Source, Level, Message.
- **Filter Bar**: Search and Level toggles.

**Interactions**  
- Click log entry to view full details/trace.
- "Clear" and "Export" buttons.

**Realtime Behavior**  
- Log stream from background processes.

**Performance**  
- Circular buffer for log storage (limit to 5000 rows).

**Implementation Notes**  
- **UX Reasoning**: Debug the workspace and the project in one place.

---

### 6.11 Container Manager

**Purpose**  
GUI for Docker containers, images, and volumes.

**Business Rules**  
- Basic CRUD for containers (Start, Stop, Restart, Delete).
- Support for Docker Compose.

**Layout**  
- List view with status indicators.

**Components**  
- **Container List**: Name, Image, Status, Ports.
- **Log Viewer**: Dedicated tab for container logs.

**Interactions**  
- Start/Stop buttons.
- "Execute Shell" in container.

**Validation**  
- Check if Docker daemon is running.

**API Requirements**  
- `GET /docker/containers`: List all.
- `POST /docker/action`: Execute command.

**State Management**  
- `dockerStore` for real-time status tracking.

**Implementation Notes**  
- Use Docker Engine API (via unix socket or named pipe).

---

### 6.12 Developer Settings

**Purpose**  
Comprehensive configuration for all developer tools.

**Business Rules**  
- Persist settings locally in `config.json`.
- Support for global and project-specific overrides via `.primordial/config.json`.

**Settings Categories**  
- **General**: Theme (Dark/System), Zoom Level, Language, Window Transparency.
- **IDE Preferences**:
    - **Default Editor**: Choice between internal Monaco or external (VS Code, Cursor).
    - **Auto-Save**: Delay in ms or "On Window Blur".
    - **Minimap**: Toggle visibility in editor.
- **Terminal**:
    - **Default Shell**: Zsh, Bash, PowerShell, Fish.
    - **Font Family**: Monospace font override.
    - **Cursor Style**: Block, Line, Underline.
- **Git**:
    - **Auto-Fetch**: Interval for checking remote changes.
    - **Default Branch**: Name for new repos (main/master).
    - **GPG Signing**: Toggle and key selection.
- **Database**:
    - **Query Timeout**: Max duration for SQL execution.
    - **Page Size**: Default rows per page in results.
    - **Format on Save**: Auto-format SQL queries.
- **API**:
    - **Request Timeout**: Global timeout for API calls.
    - **SSL Validation**: Toggle for self-signed certificates.
- **AI**:
    - **Preferred Model**: OpenAI, Anthropic, Gemini, Local.
    - **Auto-Suggestions**: Toggle inline code suggestions.
    - **Context Window**: Limit for RAG token usage.

**Interactions**  
- Searchable settings bar.
- "Reset to Default" for any section.
- "Danger Zone": Clear local cache, Reset all settings, Delete all connections.

**Validation**  
- Immediate feedback on invalid settings (e.g., path not found).

**Accessibility**  
- High contrast and font size options.

**Implementation Notes**  
- **UX Reasoning**: Customization is key for developer productivity.
- **Backend**: Settings managed via `tauri-plugin-store`.

---

## 7. AI Features

- **Commit Summary**: AI analyzes staged changes and writes a concise message.
- **SQL Generator**: Natural language to SQL based on active DB schema.
- **API Body Generator**: Generate JSON payloads from endpoint documentation.
- **Code Review**: AI scans changes for security vulnerabilities or performance issues.
- **Regex Generator**: Explain what you need, get a tested regex.
- **Documentation**: Generate READMEs or API specs from code.

---

## 8. Notifications

**Purpose**  
Inform the user of background events without interrupting the primary workflow.

**Notification Logic**  
- **Repository Updated**: New commits pulled from remote.
- **Database Connected**: Successful handshake with DB server.
- **API Failed**: Request timed out or returned 5xx.
- **Container Stopped**: Docker container exited unexpectedly.
- **Branch Conflict**: Merge conflict detected after pull.
- **AI Completed**: Long-running AI task (e.g., Repo Summary) is ready.
- **Environment Changed**: Remote profile updated by teammate.

**Interactions**  
- Click notification to jump to the relevant module.
- "Snooze" or "Dismiss" for non-critical alerts.

---

## 9. Import & Export

### Import
- **Git Repository**: Clone via URL or open local folder.
- **Postman Collection**: Import JSON/V2 collections.
- **OpenAPI/Swagger**: Generate API requests from YAML/JSON specs.
- **Database Schema**: Import `.sql` or `.dump` files.
- **Environment File**: Parse `.env` or `.json` profiles.
- **Snippet Collection**: Import from VS Code or Raycast.

### Export
- **API Collection**: Export to Postman-compatible JSON.
- **Snippets**: Export to Markdown or JSON.
- **Database Schema**: Generate SQL DDL for active tables.
- **Logs**: Export to `.log` or `.csv`.
- **Workspace Configuration**: Backup entire developer setup.

---

## 10. Automation

- **Repository Scan**: Auto-adds Git repos when a folder is scanned.
- **Dependency Detection**: Auto-configures framework-specific tools.
- **Log Rotation**: Automatically prune old logs to save disk space.
- **AI Recommendations**: Suggest snippets based on current code context.

---

## 9. System States

- **Empty States**: Premium "Getting Started" guides for each module (e.g., "Connect your first database").
- **Error States**: Clear recovery actions (e.g., "Docker Daemon not found. Start Docker?").
- **Loading States**: Skeleton screens for heavy data lists (Git Graph, DB Tables).

---

## 10. Responsiveness & Accessibility

- **Layout**: Fluid layout supporting multi-monitor setups.
- **Keyboard**: 100% keyboard-navigable. Global shortcuts for all major actions.
- **ARIA**: Detailed labels for technical data visualizations (Git Graph, ER Diagram).

---

## 11. Performance & Security

- **Performance**: Virtualization for all lists; background workers for heavy I/O.
- **Security**: Local-first architecture; encrypted storage for credentials; secure PTY isolation.

---

## 12. Database Relationships (SDS Internal)

- **Workspace** (1:N) **Project**
- **Project** (1:N) **GitRepo**, **DbConnection**, **ApiCollection**, **EnvProfile**
- **GitRepo** (1:N) **Branch**, **Commit**
- **DbConnection** (1:N) **QueryHistory**
- **ApiCollection** (1:N) **ApiRequest**
- **User** (1:N) **Snippet**

---

## 13. Technology Constraints

- **Tauri v2**: For cross-platform native performance and FS access.
- **React + TypeScript**: For type-safe UI logic.
- **Monaco Editor**: The industry standard for code editing.
- **Xterm.js**: For high-performance terminal rendering.
- **Tailwind CSS v4**: For modern, fast styling.
- **SQLite**: Local relational storage for metadata and history.

---

## 14. Business Rules

- **Local First**: All data is stored locally. Cloud sync is optional and encrypted.
- **Privacy**: No code or data sent to AI unless explicitly triggered by the user.
- **Permission**: Explicit user consent required for file system and network access.

---

## 15. Implementation Notes

### Frontend
- Use `shadcn/ui` for high-quality, accessible base components.
- Implement a `ModuleSwitch` system to preserve state across module transitions.
- Use `TanStack Query` for all data fetching and caching.

### Backend (Tauri Rust)
- Handle heavy Git and DB operations in Rust to keep the UI thread free.
- Use `tauri-plugin-store` for settings persistence.
- Implement secure credential storage using `keyring` or similar.

### DevOps
- Multi-platform CI/CD for Windows, macOS (Intel/Silicon), and Linux.
- Code signing for all platforms.

---

## 16. Quality Bar

The Developer Workspace is successful when a senior engineer can perform their entire daily workflow—from code to database to API testing—without leaving the application, feeling faster and more capable than they did with a suite of separate tools.
