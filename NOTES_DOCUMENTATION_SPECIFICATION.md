# Primordial Task Notes & Documentation Specification

Version: 1.0  
Phase: 09  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 04 Workspace Management](./WORKSPACE_MANAGEMENT.md), [Phase 05 Project Management](./PROJECT_MANAGEMENT.md), [Phase 06 Task Management](./TASK_MANAGEMENT.md)

---

## 1. Product Intent

The Notes & Documentation module is the centralized knowledge system inside Primordial Task. It bridges the gap between lightweight personal brainstorming and structured technical documentation. Every Workspace and Project has its own documentation area, ensuring that project knowledge is searchable, versioned, and deeply integrated with tasks and calendars. It is designed to be the single source of truth for all project-related knowledge.

---

## 2. Design Philosophy

- **Focus First**: The editor should vanish when the user is writing. No unnecessary toolbars or distractions.
- **Readability**: Optimized line lengths (720px max-width for text), clear typography, and generous whitespace.
- **Speed**: Instant load, instant search, and lag-free typing.
- **Minimalism**: Use elevation and typography to create hierarchy instead of borders and colors.
- **Consistency**: Follow the Phase 01 Design System monochrome aesthetic strictly.

---

## 3. Design Language

Follows **Phase 01 Design System**:
- **Theme**: Dark Mode only.
- **Palette**: Monochrome (`gray.0` to `gray.950`).
- **Typography**: Inter for UI, JetBrains Mono for code/technical content.
- **Spacing**: 8pt grid system.
- **Components**: Rounded corners (`radius.md` for buttons, `radius.lg` for cards/modals).

---

## 4. User Flow

```text
Workspace / Project Selection
  ↓
Notes Explorer (Navigation & Discovery)
  ↓
Create Note / Open Note
  ↓
Note Editor (Writing & Editing)
  ↓
Auto Save (Instant Persistence)
  ↓
Realtime Sync (Collaboration)
  ↓
Version History (Tracking & Recovery)
  ↓
Documentation Publishing (Formalizing Knowledge)
  ↓
AI Analysis (Summary & Insights)
```

**Transitions**:
- **Explorer to Editor**: Clicking a note card or row opens the editor in the main content area.
- **Editor to History**: Accessing the history icon in the top header slides in the Version History panel.
- **Note to Document**: Promoting a note to a document adds it to the formal Documentation Explorer hierarchy.

---

## 5. Required Screens

### 5.1 Notes Explorer

- **Purpose**: Manage, discover, and organize every note and documentation page.
- **Business Rules**: 
  - Personal notes are private to the author.
  - Project/Workspace docs follow inherited permissions.
  - Users can toggle between Grid, List, and Tree views.
- **Layout**: 
  - **Left Sidebar**: Tree navigation (Folders, Favorites, Pinned, Recent, Trash).
  - **Main Content**: Header with view toggle, search, and "Quick Create"; body showing Note Cards (Grid) or Rows (List).
- **Components**: `TreeView`, `NoteCard`, `SearchInput`, `FilterMenu`, `SortSelect`, `FolderModal`, `EmptyState`.
- **Interactions**: 
  - Drag-and-drop notes into folders or the Trash.
  - Right-click for context menu (Pin, Favorite, Move, Archive, Delete).
- **Validation**: Folder names must be unique within their parent; no reserved characters.
- **Accessibility**: ARIA-tree for navigation; keyboard shortcuts (Arrows, Enter, Delete).
- **Database Relationships**: One-to-Many (Folder -> Notes); Many-to-Many (Notes <-> Tags).
- **API Requirements**: `GET /notes`, `POST /folders`, `PUT /notes/move`, `DELETE /notes/{id}`.
- **State Management**: Persist `expandedFolders`, `activeFilter`, and `viewPreference`.
- **Realtime Behavior**: Folder renames and moves reflect immediately for all workspace members.
- **Offline Strategy**: Cache tree structure and recently accessed note metadata in IndexedDB.
- **Security**: Strict server-side scope validation based on Workspace/Project ID.
- **Performance**: Virtualized list/tree for handling thousands of notes.
- **UX Reasoning**: Familiar "File Explorer" pattern combined with "Modern Grid" cards for quick scanning.
- **Developer Notes**: Use `react-window` for virtualization and `dnd-kit` for drag-and-drop.
- **Frontend Notes**: Implement optimistic UI for move/delete actions.
- **Backend Notes**: Use a closure table for efficient recursive folder queries.
- **QA Notes**: Verify deep nesting (>10 levels) rendering and breadcrumb accuracy.

### 5.2 Create Note

- **Purpose**: Fast creation of new content with minimal friction.
- **Business Rules**: Defaults to "Untitled" in the current folder/project context.
- **Layout**: Centered floating modal with Title input, Folder selector, and Template gallery.
- **Components**: `Input`, `Select`, `TemplateCard`, `Button`.
- **Interactions**: Pressing `Enter` in the title field creates the note and navigates to the Editor.
- **Validation**: Title is trimmed; template selection is optional.
- **Accessibility**: Focus automatically placed in the Title input; `Esc` closes modal.
- **Database Relationships**: New `Note` record created with `author_id` and `workspace_id`.
- **API Requirements**: `POST /notes` with `title`, `folder_id`, `template_id`.
- **State Management**: Local form state; reset on close.
- **Realtime Behavior**: No realtime sync needed during creation phase.
- **Offline Strategy**: Queue creation request if offline.
- **Security**: Validate that user has `create` permission in the target folder/project.
- **Performance**: Instant modal appearance via CSS transitions.
- **UX Reasoning**: Minimizing steps between "Idea" and "Writing" is critical for knowledge management.
- **Developer Notes**: Use a standard `Modal` component from Phase 01.
- **Frontend Notes**: Pre-fetch template content to avoid delay after creation.
- **Backend Notes**: Handle "Untitled" collision by appending a counter if necessary.
- **QA Notes**: Test creation with and without templates.

### 5.3 Note Editor

- **Purpose**: High-performance, distraction-free rich text editing.
- **Business Rules**: 
  - Autosave on every keystroke (local) and 1s debounce (server).
  - Support for Markdown shortcuts (e.g., `# ` for H1).
- **Layout**: Full-screen editor, centered 720px content area, floating "Slash Menu", right-side metadata drawer (optional).
- **Components**: `BlockEditor`, `SlashMenu`, `BubbleMenu` (for text formatting), `AIAssistantInline`.
- **Interactions**: `/` triggers block menu; `Cmd+K` for links; `Cmd+S` forced save.
- **Validation**: Sanitize block data to prevent XSS; validate image/file upload sizes.
- **Accessibility**: Screen reader support for every block type; keyboard-only formatting.
- **Database Relationships**: One-to-Many (Note -> Blocks); One-to-Many (Note -> Comments).
- **API Requirements**: `PATCH /notes/{id}/content` (Block-based updates), `GET /notes/{id}/presence`.
- **State Management**: Use `Yjs` or `Automerge` for CRDT-based multi-user synchronization.
- **Realtime Behavior**: Show remote cursors, active editor avatars, and "User is typing..." indicators.
- **Offline Strategy**: Save changes to local IndexedDB; sync with Conflict Resolution on reconnect.
- **Security**: Content-Security-Policy (CSP) for embedded media; token-based auth for file uploads.
- **Performance**: Debounce server sync; lazy-load heavy media blocks.
- **UX Reasoning**: Block-based architecture provides the best balance of flexibility (like Notion) and speed.
- **Developer Notes**: Recommended engine: `TipTap` (built on ProseMirror) or `Lexical`.
- **Frontend Notes**: Implement a "Saved/Syncing" indicator in the status bar.
- **Backend Notes**: Store blocks as a JSONB array for flexible querying and versioning.
- **QA Notes**: Stress test with large documents (>50k words) and multiple concurrent editors.

### 5.4 Documentation Explorer

- **Purpose**: Navigate structured, multi-page project documentation.
- **Business Rules**: Order is manually adjustable; permissions are project-wide.
- **Layout**: Left-side hierarchical navigation rail; main content area for the current page.
- **Components**: `DocRail`, `Breadcrumbs`, `DocSearch`, `ReorderHandle`.
- **Interactions**: Click to navigate; drag handles to reorder pages; toggle "Publish" status.
- **Validation**: Prevents circular references in parent-child relationships.
- **Accessibility**: Logical landmark navigation; `Tab` order for sequential reading.
- **Database Relationships**: One-to-Many (Project -> Docs); recursive self-relation for sub-pages.
- **API Requirements**: `GET /docs/hierarchy`, `PATCH /docs/reorder`.
- **State Management**: Cache hierarchy state; track "Active Page".
- **Realtime Behavior**: Hierarchy updates (reordering) sync across all viewers instantly.
- **Offline Strategy**: Pre-fetch entire hierarchy and top 5 most viewed pages.
- **Security**: Only "Editor" role can reorder or publish docs.
- **Performance**: Optimized tree rendering using `react-virtuoso`.
- **UX Reasoning**: Documentation requires a more rigid, book-like structure than random notes.
- **Developer Notes**: Reuse `TreeView` logic from Notes Explorer with modified actions.
- **Frontend Notes**: Ensure breadcrumbs update dynamically on scroll/navigation.
- **Backend Notes**: Use `position` or `sort_order` floating-point values for reordering.
- **QA Notes**: Test deep nesting and "Publish" visibility toggles.

### 5.5 Documentation Detail

- **Purpose**: Focused reading experience for published documentation.
- **Business Rules**: Read-only by default; "Edit" mode required for changes.
- **Layout**: Centered text block with "Next/Previous" navigation footer and "Table of Contents" sidebar.
- **Components**: `ReaderView`, `TableOfContents`, `DocFooterNav`, `AuthorBadge`.
- **Interactions**: Clicking TOC items scrolls smoothly to the header; copy "Deep Link" on hover.
- **Validation**: Check for broken internal links on load.
- **Accessibility**: High contrast for reading; semantic `H1-H6` structure.
- **Database Relationships**: Links to `Tasks` or `GitCommits` referenced in text.
- **API Requirements**: `GET /docs/{id}` with full block content and metadata.
- **State Management**: Track "Reading Progress" for large documents.
- **Realtime Behavior**: Comments and mentions appear in realtime.
- **Offline Strategy**: Full document content cached on first open.
- **Security**: View-only permissions enforced for external guests.
- **Performance**: Prefetch "Next" document in the sequence.
- **UX Reasoning**: Reading requires maximum focus; TOC helps with navigation in long technical specs.
- **Developer Notes**: Implement smooth scroll via `scroll-behavior: smooth`.
- **Frontend Notes**: Generate TOC dynamically from `H1-H3` blocks in the editor.
- **Backend Notes**: Track "View Count" and "Last Read" metrics.
- **QA Notes**: Verify responsive layout on smaller laptop screens.

### 5.6 Version History

- **Purpose**: Track changes, compare versions, and restore previous states.
- **Business Rules**: Snapshots created on significant changes or manually.
- **Layout**: Right-side sliding panel with a vertical timeline of versions.
- **Components**: `TimelineList`, `VersionItem`, `DiffViewer`, `RestoreButton`.
- **Interactions**: Clicking a version shows a "Diff" (Additions/Deletions) in the main editor.
- **Validation**: Restoration requires confirmation; cannot restore to a deleted parent folder.
- **Accessibility**: Screen reader announcement of "Changes detected"; keyboard-navigable timeline.
- **Database Relationships**: One-to-Many (Note -> Versions).
- **API Requirements**: `GET /notes/{id}/history`, `POST /notes/{id}/restore/{version_id}`.
- **State Management**: Store `selectedVersion` for comparison.
- **Realtime Behavior**: New versions appear in the timeline as they are created.
- **Offline Strategy**: Not available offline (requires server history).
- **Security**: History access follows Note `read` permission.
- **Performance**: Incremental diffs to minimize data transfer.
- **UX Reasoning**: Users need safety; the ability to "Go Back" reduces editing anxiety.
- **Developer Notes**: Use `diff-match-patch` for calculating text differences.
- **Frontend Notes**: Highlight additions in green (subtle) and deletions in red (subtle).
- **Backend Notes**: Store versions as compressed block snapshots.
- **QA Notes**: Verify that restoring a version doesn't lose current unsaved changes (create a new version first).

### 5.7 Templates

- **Purpose**: Standardize common documentation and note types.
- **Business Rules**: Global (Workspace) and Local (Project) templates supported.
- **Layout**: Grid gallery with previews of template structure.
- **Components**: `TemplateGallery`, `TemplatePreview`, `CreateTemplateButton`.
- **Interactions**: "Use Template" populates a new note with pre-defined blocks.
- **Validation**: Template names must be unique.
- **Accessibility**: Grid items are focusable; include descriptions.
- **Database Relationships**: One-to-Many (Workspace -> Templates).
- **API Requirements**: `GET /templates`, `POST /templates`, `PUT /templates/{id}`.
- **State Management**: Cache templates globally.
- **Realtime Behavior**: Template updates reflect for all workspace users.
- **Offline Strategy**: Basic templates cached locally.
- **Security**: Only Admins can create Workspace templates.
- **Performance**: Pre-render template previews to images or static HTML.
- **UX Reasoning**: Standardized formats (Meeting Notes, API Specs) save time and improve team consistency.
- **Developer Notes**: Templates are essentially just a Note with a `is_template` flag and placeholder blocks.
- **QA Notes**: Test "Variable Substitution" (e.g., auto-filling current date).

---

## 6. Note Types

- **Personal Note**: Private by default; for brainstorming and drafts.
- **Workspace Note**: Shared with the entire workspace; for team policies or handbooks.
- **Project Note**: Scoped to a project; for planning and internal logs.
- **Meeting Note**: Structured for agendas, attendees, and action items.
- **Documentation**: Formal, public-facing project knowledge.
- **Technical Specification**: Deep technical details, architecture, and logic.
- **Release Note**: Change logs for specific versions or sprints.
- **Architecture Document (ADR)**: Tracking architectural decisions and their rationale.
- **API Documentation**: Endpoints, payloads, and authentication guides.
- **Checklist**: Procedural notes for repetitive tasks (e.g., "Deployment Checklist").
- **Knowledge Base**: Curated, searchable library of reusable information.

---

## 7. Rich Text Features

- **Standard**: Bold, Italic, Underline, Strikethrough, Heading (H1-H3), Subscript, Superscript.
- **Lists**: Bulleted, Numbered, Checklist (Interactive), Toggle Lists (Accordion).
- **Media**: Images (drag & drop), Videos (YouTube/Vimeo/Local), File Attachments.
- **Technical**: 
  - **Code Blocks**: Syntax highlighting for 100+ languages, line numbers, and "Copy" action.
  - **Mermaid Diagrams**: Live rendering of flowcharts, sequence diagrams, and Gantt charts.
  - **LaTeX / Math**: KaTeX integration for professional formula rendering.
- **Organization**: Callouts (Info, Warning, Error), Quotes, Dividers, Table of Contents.
- **Interactive**: Mentions (@user), Task Links (#task), Date Pickers, Emoji Picker.

---

## 8. Document Organization

- **Nested Folders**: Unlimited hierarchy depth.
- **Tags**: Multi-select tags for cross-cutting organization (e.g., `#draft`, `#engineering`).
- **Favorites & Pinning**: Per-user shortcuts for high-frequency notes.
- **Collections**: Virtual folders that aggregate notes based on tags or properties.
- **Archive**: Move stale content out of the primary view without deleting.
- **Trash**: Soft-delete with a 30-day recovery window and "Empty Trash" capability.

---

## 9. Search Experience

- **Global Search (Cmd+K)**: Search titles and content across all notes.
- **Local Filter**: Quick search within the active folder or project.
- **Advanced Filters**: Search by Author, Date Range, Tag, and Note Type.
- **AI-Powered Search**: Semantic search that understands intent (e.g., "find the deploy steps").
- **Recent Results**: Show last 5 viewed notes for instant access.

---

## 10. Filter System

- **Workspace/Project**: Filter notes by their parent container.
- **Temporal**: Created Date, Last Modified, Last Viewed.
- **Membership**: Created by Me, Shared with Me, Mentioned In.
- **Status**: Archived, Draft, Published, Pinned, Favorite.
- **Content**: Has Images, Has Code, Has Tasks.

---

## 11. Collaboration

- **Realtime Multi-Player**: Google Docs style co-editing with zero lag.
- **Presence Indicators**: Avatar list in header showing who is currently viewing/editing.
- **Inline Comments**: Threaded discussions tied to specific text blocks.
- **Mentions & Notifications**: Notifying team members via `@name` in text or comments.
- **Suggestion Mode**: Propose changes that can be accepted or rejected by the owner.

---

## 12. Versioning

- **Automatic Snapshots**: Saved every 10 minutes of active editing.
- **Named Versions**: Manual "Save Point" with custom labels (e.g., "v1.0 Final").
- **Diff Comparison**: Side-by-side or inline view of changes between any two versions.
- **One-Click Restore**: Revert to any previous state instantly.
- **Timeline View**: Visual history of the document's evolution.

---

## 13. AI Features

- **Generate Draft**: Create a full note from a single prompt (e.g., "Draft a meeting agenda for tomorrow's sprint planning").
- **Summarize**: Turn a long document into a 3-bullet point summary.
- **Rewrite**: Change tone (Professional, Casual), simplify language, or expand/shorten text.
- **AI Insights**: Automatically identify action items and tasks from meeting notes and link them to the Task module.
- **Smart Formatting**: Clean up messy notes into structured blocks.
- **Grammar & Style**: Realtime suggestions for clarity and correctness.
- **Chat with Note**: Ask questions directly to the document context.

---

## 14. Automation

- **Auto-Sync**: Background persistence ensures data is never lost.
- **Auto-Archive**: Move notes to Archive if not opened for 6 months (configurable).
- **Task Extraction**: AI automatically creates tasks in the project when action items are detected.
- **Meeting Reminders**: Generate a "Daily Standup" note template 15 minutes before the meeting.
- **Backup**: Daily encrypted backups to cloud storage.

---

## 15. Notifications

- **Mentions**: When you are tagged in a note or comment.
- **Replies**: When someone responds to your comment thread.
- **Approval**: When a suggestion you made is accepted.
- **Restoration**: When a document you follow is reverted to an older version.
- **Sharing**: When a private note is shared with you.

---

## 16. Import / Export

- **Import**: Markdown (`.md`), HTML, DOCX, TXT, JSON.
- **Export**: 
  - **PDF**: Professional layout for sharing.
  - **Markdown**: For developer portability.
  - **HTML**: For web publishing.
  - **DOCX**: For traditional enterprise workflows.
  - **JSON**: For full data backup/portability.
- **Bulk Export**: Download entire folders or projects as a ZIP of Markdown files.

---

## 17. Empty, Error, and Loading States

- **Empty States**: Premium illustrations with "Call to Action" buttons (e.g., "Create your first note").
- **Error States**: 
  - **Offline**: Banner indicating "Editing Offline - Changes will sync later".
  - **Conflict**: Modal to choose between "Your Version" and "Server Version".
  - **404**: "Note Not Found" with a "Return to Explorer" link.
- **Loading States**: 
  - **Skeleton Screens**: Shimmering placeholders for the sidebar and editor blocks.
  - **Inline Spinners**: For image uploads and AI generation.

---

## 18. Responsiveness

- **Wide Desktop (>1600px)**: Expanded Sidebar + Main Editor + Permanent TOC/Metadata Inspector.
- **Standard Desktop (1280px - 1600px)**: Sidebar + Main Editor; TOC becomes a floating menu.
- **Laptop (1024px - 1280px)**: Sidebar collapses to icons; Main Editor takes focus.
- **Layout Rule**: Minimum editor width of 640px; text always centered.

---

## 19. Accessibility

- **Keyboard Navigation**: `Tab` for focus; `Cmd+Option+H` for header navigation; `Slash` for menus.
- **Screen Readers**: All components use semantic HTML and ARIA labels (e.g., `role="treeitem"`, `aria-expanded`).
- **Contrast**: Target WCAG 2.1 AA (4.5:1 ratio) for all text and icons.
- **Reduced Motion**: Respect system settings by disabling non-essential transitions.
- **Focus Indicators**: Highly visible `state.focus` ring on all interactive elements.

---

## 20. Performance

- **Typing Latency**: Target <10ms for local character echo.
- **Load Time**: <300ms for document metadata; <800ms for full block rendering.
- **Memory**: Virtualize long documents and large folder trees to maintain low memory footprint.
- **Sync**: Realtime cursor updates in <50ms.

---

## 21. Security

- **Encryption**: AES-256 for data at rest; TLS 1.3 for data in transit.
- **Isolation**: strict Workspace-level and Project-level data partitioning.
- **Permissions**: RBAC (Role-Based Access Control) enforced at the block API level.
- **Audit Log**: Track every view, edit, and export for sensitive documents.
- **Recovery**: Ability for Workspace Owners to recover deleted items from the Trash within 30 days.

---

## 22. Database Relationships

- **Workspace** (1) -> (N) **Notes**
- **Project** (1) -> (N) **Notes**
- **Folder** (1) -> (N) **Notes** / (N) **Sub-Folders**
- **Note** (1) -> (N) **Blocks** (JSONB store)
- **Note** (1) -> (N) **Versions**
- **Note** (1) -> (N) **Comments**
- **Note** (M) <-> (N) **Tags**
- **Note** (1) -> (N) **Tasks** (referenced/linked)

---

## 23. API Requirements

- `GET /notes`: List notes with filters and pagination.
- `GET /notes/{id}`: Fetch full note content and blocks.
- `POST /notes`: Create new note.
- `PATCH /notes/{id}/blocks`: Partial block updates (for sync).
- `POST /notes/{id}/versions`: Create manual snapshot.
- `GET /notes/{id}/history`: List version history.
- `POST /notes/{id}/comments`: Add new comment.
- `GET /templates`: List available templates.
- `POST /import`: Handle multipart file uploads.

---

## 24. State Management

- **Global**: Current `activeWorkspace`, `activeProject`, `userProfile`.
- **Note-Level**: `isDirty`, `isSyncing`, `activeUsers` (Presence), `undoStack`, `redoStack`.
- **UI State**: `sidebarCollapsed`, `activeTheme`, `searchQuery`.
- **Sync Queue**: Local-first queue for processing changes when connectivity is intermittent.

---

## 25. Business Rules

- **Ownership**: The creator of a Personal Note is the sole owner until shared.
- **Persistence**: Content is saved automatically; "Manual Save" is redundant but provided for psychological comfort.
- **Permissions**: A user cannot see a note in a project they don't have access to.
- **Archival**: Archived notes are excluded from global search by default but can be included via toggle.
- **Deletion**: Trash is purged every 30 days automatically.

---

## 26. Output Summary

The Notes & Documentation module for Primordial Task is a world-class knowledge system designed for speed, collaboration, and technical precision. By combining the flexibility of block-based editing with the power of AI and the structure of formal documentation, it provides developers with an unparalleled environment for capturing and organizing knowledge.
