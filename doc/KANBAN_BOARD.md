# Primordial Task Kanban Board Specification

Version: 1.0  
Phase: 07  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 05 Project Management](./PROJECT_MANAGEMENT.md), [Phase 06 Task Management](./TASK_MANAGEMENT.md)  

## 1. Product Intent

The Kanban Board provides a visual workflow for managing tasks inside Primordial Task. It is directly connected to projects, tasks, calendar, timeline, analytics, notifications, time tracking, AI assistant, Git integration, and cloud synchronization.

The board must feel fast, minimal, professional, organized, and focused. Every movement on the board should immediately update connected systems while preserving clarity, permissions, auditability, and realtime collaboration.

## 2. Design Principles

- Follow the Phase 01 dark monochrome design system.
- Prioritize speed and clarity over decoration.
- Make project workflow understandable at a glance.
- Use status color only for meaningful status, risk, or validation.
- Keep cards compact but informative.
- Make drag-and-drop precise, reversible, and accessible.
- Treat Kanban as a professional desktop workflow surface, not a casual web board.

## 3. Core User Goals

Users must be able to:

- Create, rename, delete, archive, reorder, collapse, and expand columns.
- Create, move, duplicate, archive, assign, prioritize, and complete tasks.
- Track progress, checklist state, subtasks, comments, attachments, dependencies, labels, and time.
- Search, filter, bulk edit, and use saved board views.
- Use keyboard shortcuts and command palette actions.
- Receive realtime updates across analytics, notifications, AI, and task history.

## 4. User Flow

```text
Workspace
  -> Project
  -> Kanban
  -> Select Column
  -> Create Task
  -> Move Task
  -> Update Status
  -> Realtime Synchronization
  -> Analytics Update
  -> Notification
  -> AI Analysis
```

Transitions:

- Workspace context determines accessible projects.
- Project context loads the board workflow and task set.
- Selecting a column scopes quick add and bulk moves.
- Creating a task inserts it into the selected column and updates task analytics.
- Moving a task updates status, order, activity history, notifications, and AI risk analysis.
- Realtime synchronization updates collaborators without stealing focus.

## 5. Kanban Board

### Purpose

Display project workflow visually and allow users to manage task movement with minimal friction.

### Layout

- Application shell with persistent sidebar and top navigation.
- Board header contains project name, board view, search, filters, saved views, statistics toggle, and quick add.
- Board body is horizontally scrollable columns.
- Right task detail drawer opens when a task card is selected.
- Optional board statistics strip sits below the header when enabled.

Recommended dimensions:

- Board header height: `56px` to `64px`.
- Column width: `300px` default, `280px` compact, `340px` comfortable.
- Column gap: `12px`.
- Card gap: `8px`.
- Board padding: `16px` to `24px`.
- Column header height: `44px`.

### Components

- Top Navigation
- Sidebar
- Search Bar
- Filter chips
- Saved Filter menu
- Board Header
- Board Statistics
- Column
- Task Card
- Quick Add
- Bulk Action Toolbar
- Context Menu
- Skeleton loading
- Alert
- Toast

### Interactions

- Click task card opens Task Detail.
- Drag task card moves task across columns or within a column.
- Click column header menu opens column actions.
- Collapse hides cards and shows count.
- Quick Add creates a task in a selected column.
- Bulk selection enables bulk toolbar.
- Right-click opens context menu for cards, columns, or board background.
- Command Palette exposes all board actions.

### Validation

- Board requires project access.
- Moving task requires permission to edit status and order.
- Status transition rules from Phase 06 apply.
- WIP and completion rules can prevent moves.
- Archived columns and tasks are read-only unless restored.

### Accessibility

- Board exposes navigation landmarks.
- Columns are labelled regions.
- Cards are focusable list items.
- Drag-and-drop has keyboard alternative.
- Status changes announce source column, destination column, and result.

### UX Reasoning

The board is a control surface. It must keep workflow, task state, and next actions visible without turning every card into a dense task detail.

### Developer Notes

- Board data should load as project workflow, columns, visible card windows, and metadata.
- Persist column order per board.
- Persist card order per column.
- Support realtime patches rather than full board reloads.

### Backend Notes

- Store status, column, and order independently enough to support custom workflows.
- Validate transitions server-side.
- Write activity history for every task move and column change.

### Frontend Notes

- Use virtualization for large columns.
- Preserve scroll position during realtime updates.
- Use optimistic movement with rollback on failure.

### QA Notes

- Test drag, keyboard move, realtime conflicts, permission denial, WIP limits, offline retry, and large boards.

## 6. Task Card

### Purpose

Represent a task compactly while showing enough context to decide whether to open, move, or act on it.

### Layout

- Card surface: `surface.card`.
- Border: `border.subtle`.
- Radius: `radius.lg`.
- Padding: `12px`.
- Internal gap: `8px`.
- Minimum height: `96px`.
- Maximum default height: avoid exceeding `180px`; long descriptions are hidden.

### Components

- Card container
- Task title
- Priority badge
- Status/column metadata when useful
- Assignee Avatar
- Due date
- Progress indicator
- Checklist progress
- Subtask count
- Comment count
- Attachment count
- Time tracking indicator
- Labels/tags
- Dependency indicator
- AI indicator
- Quick menu

### Visual Hierarchy

1. Task title
2. Due date, priority, and blocked/dependency state
3. Assignee and project metadata
4. Progress, checklist, comments, attachments, time, AI indicators

### Interactions

- Click opens detail.
- Checkbox or quick complete marks done when visible.
- Hover reveals quick menu.
- Drag starts from card body or drag handle.
- Command/Ctrl-click supports multi-select.
- Right-click opens card context menu.

### Validation

- Completion can be blocked by required subtasks, checklist, dependencies, or fields.
- Priority and assignee changes require edit permission.

### Accessibility

- Card label includes title, status, priority, due date, assignee, and blocked state.
- Quick actions are keyboard reachable.
- Counts are announced as text, not only icons.

### UX Reasoning

Cards should show signals, not full task content. The detail drawer handles depth.

### Developer Notes

- Card data should be denormalized for board rendering.
- Use lazy detail fetch when opening task detail.

### Backend Notes

- Return card summary payload separately from full task payload.

### Frontend Notes

- Avoid layout shift when badges appear or disappear.
- Truncate long titles to 2 lines with tooltip.

### QA Notes

- Test card display for missing assignee, overdue due date, many labels, and long titles.

## 7. Column Management

### Purpose

Allow teams to shape the workflow around their project process.

### Layout

- Column header includes name, count, WIP state if enabled, collapse control, and menu.
- Column body contains task cards and quick add.
- Collapsed column shows vertical or compact header with count.

### Components

- Column header
- Count badge
- WIP indicator
- Menu
- Quick Add row
- Empty column state
- Confirmation modal

### Interactions

- Create Column from board menu or column area.
- Rename inline from column menu.
- Delete requires confirmation and task destination.
- Archive hides column from active workflow while preserving history.
- Move by drag or keyboard action.
- Collapse/expand via icon button.
- Optional color label is allowed only as metadata and should remain subtle.

### Validation

- Column name required.
- Duplicate column names are allowed only if backend workflow IDs remain unique; otherwise validate.
- Delete blocked when column contains tasks unless destination is chosen.
- Column limit can be workspace or project policy; default recommendation: 20 active columns.
- Required system columns can be locked.

### Accessibility

- Column header is focusable.
- Collapse state is announced.
- Move column has keyboard controls.

### UX Reasoning

Columns define workflow. Editing them must be easy, but destructive changes require clarity because they affect many tasks.

### Developer Notes

- Archive column rather than hard-delete when activity history depends on it.
- Column order and collapsed state persist per user where appropriate.

### Backend Notes

- Maintain workflow schema versioning.
- Validate task migration on delete/archive.

### Frontend Notes

- Use optimistic rename and collapse.
- Use guarded optimistic update for reorder.

### QA Notes

- Test delete with tasks, locked columns, duplicate names, WIP limits, and collapsed state persistence.

## 8. Board Filters

### Purpose

Help users focus the board without changing the underlying workflow.

### Layout

- Filter button in board header.
- Active filters render as chips below or inside header.
- Saved filters appear in a menu.

### Components

- Filter popover
- Filter chips
- Saved Filter menu
- Clear filters button

### Supported Filters

- Status
- Priority
- Assignee
- Tags
- Due Date
- Labels
- Project
- Recently Updated
- Blocked
- Favorites
- Saved Filters

### Interactions

- Filters apply immediately.
- Multiple values inside a category use OR.
- Different categories combine with AND.
- Saved filters can be personal or shared when permitted.

### Validation

- Project filter appears only in cross-project boards.
- Saved shared filters require permission.

### Accessibility

- Active filter chips expose remove action.
- Result count updates are announced politely.

### UX Reasoning

Filtering should narrow attention without making the board feel like a query builder.

### Developer Notes

- Persist active filters in route state.
- Keep filter state compatible with global search and command palette.

### Backend Notes

- Validate filter access and avoid returning unauthorized tasks.

### Frontend Notes

- Debounce expensive filter changes.

### QA Notes

- Test filter combinations, saved filters, permission-restricted filters, and empty results.

## 9. Search

### Purpose

Find tasks quickly within the board context.

### Layout

- Search field in board header.
- Results can dim non-matching cards or show filtered board mode.
- Command Palette supports board search.

### Search Scope

- Task title
- Description
- Member
- Priority
- Status
- Labels
- Tags
- Recent

### Interactions

- Command/Ctrl + F focuses board search.
- Command/Ctrl + K opens global command palette.
- Escape clears query first, then returns focus to board.
- Search updates after `150ms` debounce.

### Validation

- Search respects permissions and current filters.

### Accessibility

- Search field has visible or programmatic label.
- Result count is announced.

### UX Reasoning

Search should preserve board orientation. Users should still understand where matches live in workflow.

### Developer Notes

- Use local card cache first, then server search for unloaded cards.

### Backend Notes

- Index task title, description, labels, tags, assignee, and recent activity.

### Frontend Notes

- Highlight matching text only when it does not create visual noise.

### QA Notes

- Test unloaded card search, filter interaction, keyboard clear, and permission boundaries.

## 10. Default Columns

Recommended workflow:

- Backlog: Captured work not yet committed for execution.
- To Do: Ready work selected for execution.
- In Progress: Work actively being implemented.
- Review: Work awaiting peer, product, or code review.
- Testing: Work being verified.
- Done: Completed work.
- Archived: Historical completed/cancelled work, hidden by default.
- Blocked: Work unable to progress because of a dependency or issue.
- Waiting: Work waiting on external response or event.

Transition rules:

- Follow Phase 06 task status transitions.
- Backlog can move to To Do or In Progress.
- In Progress can move to Review, Testing, Blocked, Waiting, or Done.
- Done can be reopened to In Progress by permitted users.
- Archived tasks are read-only until restored.
- Blocked should require blocker reason or dependency.

Validation:

- Projects may customize workflow if permissions allow.
- System status mapping must remain compatible with analytics.

Accessibility:

- Column descriptions should be available in tooltips or help text.

Developer Notes:

- Store workflow mapping from columns to task statuses.

Backend Notes:

- Analytics must use canonical task status, not only column label.

Frontend Notes:

- Show locked indicators for system-required columns.

QA Notes:

- Test custom columns mapped to canonical statuses.

## 11. Drag And Drop

### Purpose

Make task movement immediate, clear, reversible, and accessible.

### Interactions

Dragging:

- Lift card with subtle elevation and opacity.
- Original space remains as placeholder.
- Cursor movement should feel direct with no lag.

Hover:

- Destination column uses subtle highlight.
- Drop position appears between cards.

Drop Preview:

- Show precise insertion location.
- If move is invalid, show disabled preview and reason tooltip.

Animation:

- Use Phase 01 motion durations.
- Respect reduced motion.

Auto Scroll:

- Horizontal auto-scroll near board edges.
- Vertical auto-scroll inside long columns.

Column Highlight:

- Highlight only valid destination columns.

Undo:

- After successful move, toast offers Undo.

Multi-select Drag:

- Dragging selected tasks moves the entire selection.
- Show count badge on drag preview.

Keyboard Drag:

- Space picks up focused card.
- Arrow keys choose destination.
- Enter drops.
- Escape cancels.

### Validation

- Validate status transition, permission, WIP limit, dependency constraints, and completion rules.
- Invalid drop leaves card in original position.

### Accessibility

- Announce "Picked up [task]."
- Announce valid destinations.
- Announce successful move or failure reason.

### UX Reasoning

Drag is high-frequency and high-risk. It must feel instant but always recoverable.

### Developer Notes

- Use optimistic UI and rollback.
- Keep stable card IDs and order keys.

### Backend Notes

- Move API should accept source, destination, order key, expected version, and bulk selection IDs.

### Frontend Notes

- Avoid re-rendering entire board during drag.

### QA Notes

- Test edge auto-scroll, invalid drops, multi-select, keyboard drag, realtime conflict, and undo.

## 12. Task Preview And Quick Edit

### Purpose

Let users inspect or act on a task without fully opening detail.

### Components

- Hover card
- Quick edit menu
- Assignee picker
- Complete action
- Duplicate action
- Archive action
- Delete action

### Interactions

- Hover card appears after delay for rich metadata.
- Quick assign opens member picker.
- Quick complete validates completion rules.
- Open Detail opens drawer.
- Duplicate creates copy in same column.
- Archive removes from active board.
- Delete requires confirmation when irreversible.

### Validation

- Hide or disable actions based on permission and task state.

### Accessibility

- Hover preview content must also be reachable by keyboard.
- Quick menu has menu semantics.

### UX Reasoning

Preview reduces navigation but should not become a cramped detail editor.

### Developer Notes

- Fetch preview data lazily.

### Backend Notes

- Duplicate preserves configurable fields and excludes history/comments by default unless selected.

### Frontend Notes

- Keep preview pinned while pointer is inside preview.

### QA Notes

- Test preview delay, keyboard access, duplicate rules, and archive rollback.

## 13. Bulk Actions

### Purpose

Support efficient management of multiple tasks.

### Actions

- Move
- Assign
- Delete
- Archive
- Duplicate
- Change Priority
- Change Status
- Export

### Interactions

- Bulk toolbar appears after selecting cards.
- Selection count is visible.
- Bulk move can target column.
- Destructive actions require confirmation.
- Partial success report appears when some tasks fail.

### Validation

- Validate every selected task separately.
- Explain permission failures and invalid transitions.

### Accessibility

- Bulk toolbar receives focus when selection begins via keyboard.
- Selection state is announced.

### UX Reasoning

Bulk action must feel powerful but transparent, especially when permissions differ across tasks.

### Developer Notes

- Use async job for large bulk operations.

### Backend Notes

- Return per-task result.

### Frontend Notes

- Keep selected task IDs stable across filter changes when possible.

### QA Notes

- Test mixed permissions, large selection, partial failure, and undo where supported.

## 14. Board Statistics

### Purpose

Show operational health without leaving the board.

### Displayed Metrics

- Tasks per column
- Completion rate
- Average cycle time
- Blocked tasks
- Overdue tasks
- Workload
- Velocity
- Project health

### Calculation

- Tasks per column: visible non-archived cards by column.
- Completion rate: done tasks divided by total active tasks in selected range.
- Average cycle time: time from In Progress to Done.
- Blocked tasks: tasks in Blocked or with blocking dependency.
- Overdue tasks: incomplete tasks past due date.
- Workload: open tasks weighted by priority and estimate per assignee.
- Velocity: completed tasks or effort over selected period.
- Project health: uses Phase 05 project health model.

### Interactions

- Click metric filters board or opens Analytics.
- Hover shows calculation explanation.

### Validation

- Metrics must respect current filters and permissions.

### Accessibility

- Metrics include text labels and values.

### UX Reasoning

Statistics are decision support, not decoration. Keep them compact and explainable.

### Developer Notes

- Load after board essentials.

### Backend Notes

- Provide metric timestamps and filter basis.

### Frontend Notes

- Show stale timestamp if metric refresh fails.

### QA Notes

- Verify metrics with filters, archived tasks, and permission-limited boards.

## 15. AI Features

### Purpose

Use AI as a productivity assistant for workflow analysis, not as a default chatbot.

### Capabilities

AI Column Summary:

- Summarizes work, blockers, and risk in a column.

Detect Blockers:

- Finds tasks blocked by dependencies, stale comments, missing assignees, or unclear next steps.

Suggest Priority:

- Recommends priority based on due dates, dependencies, project health, and workload.

Suggest Assignee:

- Recommends assignee based on expertise, ownership, and workload.

Detect Bottlenecks:

- Identifies columns where tasks accumulate or cycle time increases.

Generate Sprint:

- Suggests a sprint selection from backlog and priorities.

Optimize Workflow:

- Suggests column changes, WIP limits, or automation based on board behavior.

Predict Delays:

- Predicts tasks likely to miss deadlines.

Daily Board Review:

- Summarizes progress, carryover, blockers, and recommended actions.

### Interactions

- AI actions appear in board AI panel, column menu, or command palette.
- Outputs are drafts or recommendations until accepted.
- Source references are available for every recommendation.

### Validation

- AI respects workspace, project, task, and role permissions.
- AI cannot move, assign, or create tasks without user confirmation unless explicit automation policy allows it.

### Accessibility

- AI summaries are structured text.
- Generated updates use polite live regions.

### UX Reasoning

AI should reduce review work and expose risk. It should not interrupt board manipulation.

### Developer Notes

- Cache daily board review.
- Debounce AI recalculation after frequent moves.

### Backend Notes

- Store AI recommendation metadata, source IDs, confidence, and accepted/rejected state.

### Frontend Notes

- Present AI actions as reviewable cards, not chat bubbles.

### QA Notes

- Test permission boundaries, stale AI summaries, accepted/rejected recommendations, and source linking.

## 16. Automation

### Purpose

Reduce repetitive task movement and status maintenance.

### Supported Automation

- Move Task Automatically
- Recurring Tasks
- Automatic Assignment
- Reminder
- Status Rules
- Column Rules
- Completion Rules
- AI Suggestions

### Behavior

- Automation can trigger when status, assignment, due date, completion, dependency, or recurrence changes.
- Column rules can require fields before entry or exit.
- Completion rules can require checklist, subtasks, review, or testing.
- AI suggestions create draft automation recommendations unless workspace policy allows direct automation.

### Validation

- Prevent loops.
- Validate permissions of automation owner.
- Log automation source on every mutation.

### Accessibility

- Automation effects must be visible in task history.

### UX Reasoning

Automation should make the board feel faster without making it unpredictable.

### Developer Notes

- Automation execution should be idempotent.

### Backend Notes

- Store rule version, actor, trigger, condition, action, and last run.

### Frontend Notes

- Show automation badges only when useful.

### QA Notes

- Test rule loops, disabled rules, permission changes, and concurrent triggers.

## 17. Notifications

### Purpose

Notify users about meaningful Kanban events without creating noise.

### Events

- Task Moved
- Task Assigned
- Task Completed
- Task Overdue
- Blocked
- Dependency Updated
- Column Updated
- Mention

### Logic

- Notify assignees, watchers, mentioned members, and project owners where relevant.
- Suppress duplicate notifications from bulk operations.
- Escalate overdue or blocked notifications based on priority.

### Accessibility

- Notification content includes task, action, actor, and project.

### Developer Notes

- Notifications should reference immutable task/activity IDs.

### QA Notes

- Test muted tasks, bulk moves, mentions, and dependency updates.

## 18. Empty States

No Tasks:

- "No tasks on this board."
- Action: "Create Task"

No Columns:

- "Create a column to define this workflow."
- Action: "Create Column"

No Search Results:

- "No tasks match your search."
- Action: "Clear Search"

No Assigned Tasks:

- "No tasks assigned to this member."

No Favorites:

- "Favorite tasks to keep them close."

No Activity:

- "Board activity appears after tasks move or update."

UX Reasoning:

- Empty states should guide next action without decorative illustration.

## 19. Error States

Board Not Found:

- Route to Project Overview or Project Explorer.

Task Not Found:

- Remove stale card and show toast.

Permission Denied:

- Revert action and explain missing permission.

Sync Failed:

- Preserve local state and offer retry.

Drag Failed:

- Roll back card and show reason.

Validation Error:

- Show inline or toast depending context.

Conflict:

- Show latest server state and optional review dialog.

Recovery:

- Retry, undo, reload board, or contact admin depending failure.

## 20. Loading States

Board Loading:

- Skeleton columns and header controls.

Task Loading:

- Card skeletons inside loaded columns.

Column Loading:

- Column header and body skeleton.

Filter Loading:

- Preserve current board and show filter control loading.

Search Loading:

- Show compact spinner in search field.

Skeleton Loading:

- Match final card and column dimensions.

Optimistic Updates:

- Move, assign, priority, and completion update immediately with rollback.

Realtime Refresh:

- Apply quiet updates and show non-intrusive changed indicator when needed.

## 21. Responsiveness

Desktop:

- Full sidebar, top navigation, horizontal board, optional detail drawer.

Small Desktop:

- Collapse AI/statistics panels first.
- Keep board horizontally scrollable.
- Task detail opens as wider overlay.

Large Desktop:

- Allow more visible columns while preserving column width.

Ultra-wide Monitor:

- Keep columns fixed width.
- Use extra space for task detail, AI board review, or statistics panel.
- Do not stretch cards to fill width.

## 22. Accessibility

Keyboard Navigation:

- Tab moves through header controls, columns, and cards.
- Arrow keys move card focus within board.

Focus Order:

- Sidebar, top navigation, board header, columns left to right, detail drawer.

Screen Reader:

- Announce column, card position, status, priority, and move result.

Reduced Motion:

- Disable drag animation, shimmer, and slide transitions.

High Contrast:

- Strengthen borders, focus rings, and state indicators.

Drag Accessibility:

- Provide keyboard drag mode and move menu.

ARIA:

- Use labelled regions for board and columns.
- Use list/listitem or grid semantics depending implementation.
- Use live regions for move results and realtime updates.

## 23. Performance

Virtualized Columns:

- Virtualize horizontally when column count is high.

Virtualized Cards:

- Virtualize cards in columns over 50 visible cards.

Realtime Updates:

- Patch changed cards and columns only.

Optimistic UI:

- Used for move, reorder, assign, priority, and completion.

Lazy Loading:

- Load full task detail, previews, activity, AI, and statistics on demand.

Caching:

- Cache board schema, visible cards, filters, and last opened project.

Background Sync:

- Refresh board in background with conflict detection.

Offline Support:

- Queue safe edits when policy allows.
- Disable unsafe destructive actions offline.

## 24. Security

- Workspace isolation is mandatory.
- Project isolation is mandatory.
- Permission validation occurs client-side for affordance and server-side for authority.
- Role validation required for column, task, bulk, automation, export, and AI actions.
- Audit log records task movement, column changes, workflow edits, automation, and destructive actions.
- History tracking preserves before/after values.
- AI cannot access tasks outside authorized scope.

## 25. Integrations

Workspace:

- Board permissions and policies inherit from workspace.

Projects:

- Boards belong to projects or project collections.

Tasks:

- Cards are task summaries; detail opens full task.

Calendar:

- Due dates, reminders, and scheduling update calendar.

Timeline:

- Task moves and status changes appear in timeline.

Analytics:

- Board movement powers cycle time, throughput, velocity, and health.

Time Tracking:

- In-progress and timer actions connect to task time entries.

Notes and Documentation:

- Linked notes and docs appear on task cards or detail.

Git Integration:

- Commits and pull requests can update task state or appear as linked activity.

Database Manager:

- Database records can be linked to tasks.

API Collection:

- API requests can be linked to implementation tasks.

Snippet Manager:

- Snippets can attach to development tasks.

AI Assistant:

- Board summaries, blockers, predictions, and optimization recommendations.

Notifications:

- Board events generate relevant notifications.

Cloud Sync:

- Board state synchronizes across users and devices.

## 26. Keyboard Shortcuts

Create:

- `C`: Create task in focused column.
- `Shift + C`: Create column when board header is focused.

Open:

- `Enter`: Open focused task.

Move:

- `M`: Open move menu.
- `Space`: Pick up card in keyboard drag mode.
- Arrow keys: Choose destination.
- `Enter`: Drop.
- `Escape`: Cancel.

Search:

- `Command/Ctrl + F`: Focus board search.

Assign:

- `A`: Open assignee picker for focused task.

Archive:

- `E`: Archive focused task after confirmation or policy.

Delete:

- `Delete` or `Backspace`: Delete focused task with confirmation.

Quick Add:

- `N`: Quick add task.

Command Palette:

- `Command/Ctrl + K`: Open command palette.

Navigation:

- Arrow keys navigate cards.
- `Home` moves to first card in column.
- `End` moves to last card in column.
- `Command/Ctrl + ArrowLeft/ArrowRight`: Move between columns.

Validation:

- Shortcuts do not fire while typing in input fields.
- Destructive shortcuts require confirmation.

Accessibility:

- Shortcuts are discoverable in command palette and help menu.

## 27. Quality Bar

The Kanban module is complete when:

- Users can create, manage, reorder, collapse, and archive columns.
- Users can create, move, edit, duplicate, archive, assign, prioritize, and complete tasks.
- Drag-and-drop is precise, reversible, realtime, and accessible by keyboard.
- Search, filters, saved filters, bulk actions, statistics, AI, automation, and notifications are specified.
- Board state updates tasks, analytics, timeline, notifications, and AI analysis.
- Loading, empty, error, permission, conflict, offline, and realtime states are handled.
- Desktop, small desktop, large desktop, and ultra-wide behavior are defined.
- Frontend, backend, and QA teams have enough detail to implement without additional clarification.

