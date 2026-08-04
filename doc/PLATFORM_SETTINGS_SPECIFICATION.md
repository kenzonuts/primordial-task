# Primordial Task Platform Settings & Preferences Specification

Version: 1.0  
Phase: 13  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 11 AI Workspace](./AI_WORKSPACE_SPECIFICATION.md), [Phase 12 Developer Workspace](./DEVELOPER_WORKSPACE_SPECIFICATION.md)

---

## 1. Product Overview

The **Platform Settings & Preferences** module is the centralized configuration engine of Primordial Task. It serves as the single source of truth for all application behaviors, user identities, workspace rules, and technical integrations. 

Designed for high-productivity environments, the module combines the elegance of Apple System Settings with the granular control of JetBrains IDEs. It ensures that every aspect of the Primordial Task experience—from typography density to AI model temperature—is customizable, searchable, and persistent.

---

## 2. Objectives

- **Centralize**: Every toggle, input, and configuration must live here.
- **Searchable**: Instant access to any setting via a global settings search.
- **Persistent**: Settings must sync across devices (where applicable) and persist across sessions.
- **Scoped**: Clear distinction between User, Workspace, Project, and Device settings.
- **Accessible**: 100% keyboard navigation and screen reader compatibility.
- **Safe**: Secure storage for secrets and clear "Danger Zones" for destructive actions.

---

## 3. Design Philosophy

- **Professional & Minimal**: No visual clutter. Information hierarchy over decoration.
- **Categorized Navigation**: Sidebar-driven navigation to avoid endless scrolling.
- **Live Preview**: Immediate visual feedback for changes (e.g., Theme, Density).
- **Fast**: Instant load times and zero-latency search.
- **Predictable**: Familiar patterns for anyone who uses macOS, Windows, or modern IDEs.

---

## 4. Design Language

Follows **Phase 01 Design System**:
- **Theme**: Dark Mode (Default).
- **Palette**: Monochrome base with semantic status colors (Success, Warning, Danger).
- **Typography**: Inter (UI), JetBrains Mono (Technical/Keybindings).
- **Components**: `shadcn/ui` foundation, rounded corners (`radius.md`), premium spacing.

---

## 5. Functional Requirements

### 5.1 Global Search
- Instant, fuzzy search across all setting labels, descriptions, and keywords.
- Support for "Command Palette" style navigation within settings.

### 5.2 Settings Categories
- Logical grouping of settings (Account, Appearance, AI, Developer, etc.).

### 5.3 Nested Settings
- Support for sub-categories (e.g., Developer > Git, Developer > Database).

### 5.4 Live Preview
- Appearance changes (Theme, Font Size, Layout Density) apply immediately without requiring a restart.

### 5.5 Import/Export Configuration
- Portability of settings via JSON/YAML files.

### 5.6 Settings Scoping
- **Global (User)**: Applies to the user across all workspaces (e.g., Theme, Account).
- **Workspace**: Applies to all members/projects within a specific workspace (e.g., AI Providers, Workflow Rules).
- **Project**: Overrides for specific local projects (e.g., Git identity, DB connections).
- **Device**: Machine-specific settings (e.g., File paths, Hardware acceleration).

---

## 6. Non-Functional Requirements

- **Performance**: Settings search results must appear in < 50ms.
- **Security**: Secrets (API Keys, Passwords) must be encrypted at rest and never shown in plain text after entry.
- **Accessibility**: Target WCAG 2.1 AA. Support screen readers and high-contrast modes.
- **Reliability**: Settings changes must be atomic. No "half-saved" states.
- **Offline Support**: Settings must be modifiable offline and synced when reconnected.
- **Cross-Platform**: Consistent behavior across Windows, Linux, and macOS.

---

## 7. User Stories

### General User
- **As a user**, I want to change my theme to "Midnight" so that the application matches my aesthetic preference.
- **As a user**, I want to search for "font" and find all typography-related settings instantly.
- **As a user**, I want to configure my notification quiet hours so that I am not disturbed during focused work.

### Developer
- **As a developer**, I want to customize my keyboard shortcuts so that they match my VS Code keybindings.
- **As a developer**, I want to configure a local LLM via Ollama so that I can use AI features without an internet connection.
- **As a developer**, I want to export my snippets and settings as a JSON file so that I can back them up.

### Workspace Owner
- **As a workspace owner**, I want to set the default AI provider for my entire team to ensure consistency and cost control.
- **As a workspace owner**, I want to enforce 2FA for all members of my workspace to enhance security.

---

## 8. Required Screens

### 8.1 Settings Home
- **Display**: Search bar (Top), Categories Sidebar (Left), Content Area (Center).
- **Features**: "Favorites" section, "Recently Changed" list, "Recommended for You" cards.
- **Interactions**: Clicking a category updates the Center pane. `Cmd+/` to focus search.

### 8.2 Account
- **Profile**: Edit Display Name, Username, Avatar.
- **Identity**: Email management (Primary, Secondary), Password reset.
- **Sessions**: List of active devices/browsers with "Revoke All" option.
- **Integrations**: Connected accounts (GitHub, Google, Slack).
- **Danger Zone**: "Delete Account" (requires password confirmation).

### 8.3 Appearance
- **Theme**: Dark, Light, System, High Contrast, Custom Accent.
- **Typography**: Select UI Font, Monospace Font, Font Size (12px to 18px).
- **Density**: Compact, Standard, Spacious (adjusts padding and line heights).
- **Animations**: Toggle UI transitions (Standard, Reduced Motion).
- **Localization**: Language selection, Date/Time format (12h/24h), Timezone.

### 8.4 Workspace Preferences
- **Defaults**: Set default workspace and project on launch.
- **Workflow**: Working hours, Business days, Start of week.
- **Member Management**: Invite links, Role management (Admin, Member, Observer).
- **Cloud Sync**: Toggle auto-sync, show last sync timestamp.

### 8.5 Notifications
- **Channels**: Desktop (OS native), Email, In-app badges.
- **Triggers**: Mentions, Assignments, Project updates, AI completed, System alerts.
- **Sound**: Enable/Disable, select sound profile.
- **Quiet Hours**: Schedule "Do Not Disturb" periods.

### 8.6 Keyboard Shortcuts
- **Registry**: Searchable list of all app commands.
- **Overrides**: Click a shortcut to rebind. Conflict detection warning.
- **Presets**: Import "VS Code", "JetBrains", or "Custom" profiles.
- **Reset**: Restore defaults for individual commands or the entire set.

### 8.7 AI Configuration
- **Providers**: OpenAI, Anthropic, Google Gemini, Local (Ollama/LM Studio).
- **Global Settings**: Default model, Temperature, Max tokens, Context window limit.
- **Streaming**: Toggle real-time character output.
- **Usage**: Token counters, cost estimation, rate limit status.
- **Secrets**: API Key entry fields with "Validate" button and encrypted storage.

### 8.8 Developer Workspace
- **Git**: Global `.gitconfig` management, Auto-fetch interval, GPG signing.
- **Database**: Default drivers, Query timeouts, Page size.
- **Terminal**: Shell selection (Zsh, Bash, PowerShell), Font, Cursor style.
- **API Workspace**: Default headers, SSL validation toggle, History limit.
- **Containers**: Docker path, Auto-start containers on project load.

### 8.9 Security & Privacy
- **Auth**: 2FA Setup (TOTP), Recovery codes.
- **Encryption**: Local database encryption toggle, Master password management.
- **Telemetry**: Opt-in/out of crash reports and anonymous usage data.
- **Audit Logs**: View history of sensitive actions (login, settings change, export).
- **Permissions**: Manage app-level permissions (FS access, Network, Notifications).

### 8.10 Backup & Sync
- **Cloud**: Manual "Sync Now" button, conflict resolution history.
- **Local**: Scheduled automatic backups to local disk.
- **Restore**: Browse and restore from previous backup versions.
- **Data Portability**: Export all user data as a compressed archive.

### 8.11 Experimental Features (Labs)
- **Feature Flags**: Toggle beta features (e.g., "AI Auto-Commit", "3D Workspace View").
- **Diagnostics**: View system resource usage, open logs folder.
- **Early Access**: Enroll in the beta channel for updates.

---

## 9. Search Experience

- **Ranking Algorithm**:
    1. Exact Label Match (Highest)
    2. Category Match
    3. Keyword/Description Match
    4. Related Command Match
- **UI**: Instant dropdown results with "Jump to" links. Results categorized by module icon.

---

## 10. Import / Export Behavior

- **Format**: JSON (Primary), YAML (Secondary).
- **Granularity**: Choose what to export (Appearance only, Shortcuts only, Full Profile).
- **Validation**: Schema validation on import. Version check (prevents importing incompatible settings).

---

## 11. Accessibility Strategy

- **Focus Order**: Sequential `Tab` navigation through categories then settings items.
- **ARIA**: `aria-expanded` for nested groups, `aria-describedby` for helper text.
- **Contrast**: Strict adherence to WCAG contrast ratios in settings inputs and labels.
- **Motion**: No layout shifts; transitions respect OS "Reduced Motion" setting.

---

## 12. Performance Expectations

- **Indexing**: Settings indexed on application load for instant search.
- **Caching**: Settings read from local SQLite on startup (< 20ms).
- **Sync**: Delta-sync for cloud settings to minimize bandwidth.

---

## 13. Security Expectations

- **Secret Storage**: Use OS-level secure storage (Keychain, Credential Manager, Secret Service).
- **Isolation**: Workspace-specific settings must not leak between workspaces.
- **Audit Trail**: Every change to a security or secret setting must be logged with a timestamp.

---

## 14. Database Relationships

- **UserSetting**: `id`, `user_id`, `key`, `value`, `scope` (Global/Device).
- **WorkspaceSetting**: `id`, `workspace_id`, `key`, `value`.
- **ProjectSetting**: `id`, `project_id`, `key`, `value`.
- **Keybinding**: `id`, `user_id`, `command_id`, `keys`, `is_custom`.
- **AiProviderConfig**: `id`, `workspace_id`, `provider_type`, `api_key_encrypted`, `model_id`.

---

## 15. API Requirements

### Settings API
- `GET /settings`: Fetch all scoped settings for the current context.
- `PATCH /settings`: Update specific keys (Optimistic update).
- `POST /settings/reset`: Restore defaults for a category.

### Sync API
- `POST /settings/sync`: Push local changes to cloud.
- `GET /settings/sync/conflicts`: Retrieve list of sync conflicts.

---

## 16. State Management (Zustand)

- `settingsStore`: Centralized reactive state for UI rendering.
- `persistenceLayer`: Syncs `settingsStore` to SQLite and Secure Storage.
- `themeEngine`: Watches `settingsStore.appearance` and updates CSS variables in real-time.

---

## 17. Business Rules

- **Inheritance**: Project Settings > Workspace Settings > Global User Settings.
- **Privacy**: Secrets are never synced to the cloud in plain text; they require device-level re-authentication.
- **Validation**: Every setting has a defined type (boolean, string, enum, range) and validation function.

---

## 18. Acceptance Criteria

### 18.1 Account
- **AC 1**: Given an active session, when the user clicks "Revoke All Sessions", then all other devices must be logged out immediately.
- **AC 2**: Given a password reset request, when the user enters a weak password, then the system must reject it with specific complexity requirements.

### 18.2 Appearance
- **AC 3**: Given the Theme selector, when the user selects "High Contrast", then the UI must update instantly without a page reload.
- **AC 4**: Given the Density toggle, when the user switches to "Compact", then all component padding must reduce according to Phase 01 tokens.

### 18.3 Workspace
- **AC 5**: Given a workspace invite link, when the link is expired, then the system must show a "Link Expired" error and offer to contact the admin.

### 18.4 Notifications
- **AC 6**: Given "Quiet Hours" are enabled, when a mention occurs, then no desktop notification should trigger.

### 18.5 Keyboard Shortcuts
- **AC 7**: Given the shortcut editor, when the user attempts to bind a shortcut already in use, then a conflict warning must appear showing the conflicting command.
- **AC 8**: Given a shortcut profile import, when the JSON is malformed, then the system must reject the import and preserve existing shortcuts.

### 18.6 AI Configuration
- **AC 9**: Given the API Key field, when the user enters a key and clicks "Validate", then the system must call the provider's health check endpoint and show a success/failure badge.
- **AC 10**: Given a context window limit, when the AI Workspace exceeds this limit, then the system must prune old messages or warn the user.

### 18.7 Developer Workspace
- **AC 11**: Given the Terminal shell setting, when the user changes it to "Fish", then all new terminal tabs must launch with the Fish shell.

### 18.8 Security & Privacy
- **AC 12**: Given 2FA is enabled, when the user logs in, then they must be prompted for a TOTP code after their password.

### 18.9 Backup & Sync
- **AC 13**: Given a sync conflict, when the user selects "Keep Local", then the remote settings must be overwritten with local values.

### 18.10 Experimental Features
- **AC 14**: Given a feature flag toggle, when the user enables a "Beta" feature, then the corresponding UI elements must appear immediately or after a prompt to reload.

---

## 19. Testing Strategy

### 19.1 Unit Tests
- **Settings Store**: Test atomic updates, reset logic, and inheritance (Project > Workspace > Global).
- **Validation Rules**: Verify regex and type checking for every setting input.
- **Encryption**: Verify secrets are encrypted/decrypted correctly using mock OS keyrings.

### 19.2 Integration Tests
- **SQLite Persistence**: Ensure settings persist across app restarts.
- **Sync Engine**: Mock network failures and verify offline queuing/recovery.
- **FS Watcher**: Ensure project-specific settings files (`.primordial/config.json`) are detected and applied.

### 19.3 UI / E2E Tests
- **Search Experience**: Verify search results and ranking for common queries.
- **Keyboard Navigation**: Use `Tab` and `Enter` to navigate the entire settings tree.
- **Live Preview**: Assert CSS variables change when theme/typography settings are updated.

### 19.4 Accessibility Tests
- **Screen Reader**: Verify all labels and ARIA states using VoiceOver/NVDA.
- **Color Contrast**: Automated checks using Axe-core for all settings screens.

### 19.5 Performance Tests
- **Search Latency**: Measure time to display results for a 100-item settings index (Target: < 50ms).
- **Startup Time**: Measure time to load settings from SQLite (Target: < 20ms).

### 19.6 Security Tests
- **Secret Leakage**: Ensure API keys are never logged or stored in plain text.
- **Workspace Isolation**: Verify settings from Workspace A cannot be accessed from Workspace B.

---

## 20. Edge Cases & Failure Scenarios

- **No Internet**: Disable "Cloud Sync" actions; allow local changes.
- **Corrupted Settings**: If JSON is unparseable, fallback to default and alert the user.
- **Deleted Workspace**: Project-level settings for that workspace are purged.
- **Sync Conflict**: Present a "Diff" view showing Local vs. Remote values; user must choose.

---

## 20. Technology Constraints

- **Tauri v2**: For native OS integration (Keyring, FS).
- **React + Tailwind CSS v4**: For the UI layer.
- **SQLite**: Local persistence for non-sensitive settings.
- **TanStack Query**: For handling Sync API and data fetching.

---

## 21. Stakeholder Notes

- **UX**: Ensure settings don't feel "overwhelming". Use progressive disclosure for advanced settings.
- **Frontend**: Implement "Search Highlighting" to show matches within the settings page.
- **Backend**: Implement robust schema versioning for settings JSON.
- **QA**: Verify all "Reset to Default" actions work as expected across all categories.
- **DevOps**: Ensure CI/CD tests settings migrations across app versions.

---

## 22. Quality Bar

The Settings module is successful when a user can navigate to any configuration point in under 3 seconds, understands the impact of every toggle via clear descriptions, and feels confident that their configuration is safe, persistent, and portable.
