# Primordial Task Task Management Specification

Version: 1.0  
Phase: 06  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 04 Workspace Management](./WORKSPACE_MANAGEMENT.md), [Phase 05 Project Management](./PROJECT_MANAGEMENT.md)  

## 1. Product Intent

Task is the core entity of Primordial Task. Projects contain tasks, calendars display tasks, Kanban visualizes tasks, analytics measures tasks, notifications monitor tasks, AI analyzes tasks, time tracking records tasks, and Git commits can link to tasks.

Task management must require the fewest possible interactions while preserving rich context for professional developer workflows.

## 2. Design Principles

- Follow Phase 01 design language.
- Optimize for speed, focus, clarity, and context.
- Keep dense task surfaces scannable.
- Make creation lightweight and detail editing powerful.
- Treat comments, history, links, time, and AI as contextual layers around the task.
- Avoid visual noise, excessive status color, and gamified task patterns.

## 3. Core User Goals

Users must be able to:

- Create, edit, duplicate, delete, archive, and move tasks.
- Assign members.
- Set priority, status, due date, start date, estimates, reminders, repeat rules, and tags.
- Manage checklist, subtasks, dependencies, attachments, comments, and activity.
- Link documentation, notes, Git commits, calendar events, APIs, databases, snippets, and AI summaries.
- Track time and progress.
- Search, filter, sort, bulk edit, and automate task workflows.

## 4. User Flow

```text
Project
  -> Task List
  -> Open Task
  -> Task Detail
  -> Edit
  -> Save
  -> Realtime Update
  -> Notification
  -> Analytics Update
  -> AI Analysis
```

Transitions:

- Task Explorer opens from sidebar, project, dashboard, Kanban, calendar, or search.
- Task Detail opens in a right drawer or full detail view depending context.
- Edits save inline and broadcast realtime updates.
- Analytics and AI update asynchronously after changes.

## 5. Task Explorer

### Purpose

Display all accessible tasks and support fast planning, execution, and bulk management.

### Layout

- Application shell with sidebar and top navigation.
- Header includes title, scope, search, filters, sort, view switcher, and Quick Add.
- Views: List, Compact, Table, Grouped.
- Bulk toolbar appears when tasks are selected.

### Components

- Search Bar
- Filter chips
- Sort Select
- View switcher
- Task rows
- Table
- Checkbox
- Badge
- Avatar
- Quick Add input
- Context Menu
- Pagination or infinite scroll
- Skeleton rows
- Alert

### Displayed Information

- Task title
- Project
- Assignee
- Priority
- Status
- Due date
- Tags
- Progress
- Blocked state
- Estimate
- Last updated

### Interaction

- Click row opens Task Detail.
- Checkbox completes task.
- Inline status and priority can change when permitted.
- Drag reorders manual-order views.
- Bulk selection supports Shift-click and keyboard selection.
- Right-click opens context menu.
- Quick Add creates a task with title and inferred defaults.

### Validation

- Task visibility depends on workspace, project, membership, and task privacy.
- Inline edits require permission.
- Bulk actions validate every selected task and report partial failure.

### Empty State

No tasks:

- Title: "No tasks yet."
- Body: "Create a task to start tracking work."
- Action: "Create Task"

No search results:

- "No tasks match your search or filters."

### Loading State

- Skeleton rows matching active view.
- Header controls load independently.

### Error State

- Alert: "Tasks could not be loaded."
- Retry preserves filters and search query.

### Accessibility

- Table view uses table semantics.
- List views use list semantics.
- Bulk selection state is announced.
- Completion checkbox has task-specific accessible label.

### Developer Notes

- Virtualize lists over 100 rows.
- Use cursor pagination.
- Preserve filters in URL or route state.
- Support realtime updates without stealing focus.

### UX Reasoning

The explorer must support both individual focus and operational management. Multiple views let users choose density without changing task data.

## 6. Create Task

### Purpose

Capture work quickly while allowing rich task definition when needed.

### Layout

- Quick Add for lightweight creation.
- Full Create Task modal or drawer for detailed creation.
- Full form width: `560px` to `720px`.
- Sections: Core, Scheduling, Ownership, Structure, Links.

### Components

- Input: Task Title
- Textarea/Rich editor: Description
- Select: Project
- Member picker: Assignee
- Select: Priority
- Select: Status
- Date pickers: Start Date, Due Date
- Input: Estimated Time
- Tag picker
- Checklist editor
- Subtask editor
- Attachment upload
- Dependency picker
- Reminder selector
- Repeat rule selector
- Buttons: Create, Cancel
- Alert

### Fields

- Task Title: required, 1 to 160 characters.
- Description: optional rich text or markdown.
- Project: required unless created in a project context.
- Assignee: optional.
- Priority: defaults to Medium.
- Status: defaults to To Do or project default.
- Due Date: optional.
- Start Date: optional.
- Estimated Time: optional, must be positive.
- Tags: optional.
- Checklist/Subtasks/Attachments/Dependencies/Reminder/Repeat: optional.

### Interaction

- Enter creates task in Quick Add.
- Command/Ctrl + Enter submits full form.
- Escape closes when clean or asks to discard when dirty.
- Project selection loads project-specific statuses and tags.
- Repeat rule reveals schedule details.

### Validation

- Title required.
- Due date cannot be before start date.
- Dependencies cannot create cycles.
- Repeat tasks require due date or schedule anchor.
- Attachments must satisfy file policy.

### Success State

- Toast: "Task created."
- Option to open created task if not already open.

### Cancel Flow

- Clean form closes immediately.
- Dirty form opens discard confirmation.

### Accessibility

- Visible labels for all fields.
- Rich editor supports keyboard and screen reader basics.
- Attachment upload has non-drag alternative.

### Developer Notes

- Create task atomically with initial activity event.
- Apply defaults from project and user preferences.
- Return created task ID for navigation and optimistic insertion.

### Backend Notes

- Validate permissions, required fields, dependency cycles, attachment limits, and repeat rules server-side.

### Frontend Notes

- Keep Quick Add low-latency.
- Do not block basic task creation on optional metadata loading.

### QA Notes

- Test creation from dashboard, project, Kanban, calendar, and command palette.

### UX Reasoning

Task creation must be fast by default and expandable only when users need detail.

## 7. Task Detail

### Purpose

Provide the complete task workspace: description, status, progress, discussion, structure, files, time, links, history, and AI context.

### Layout

- Opens as right drawer from lists or full page from direct routes.
- Header: title, status, priority, actions.
- Main column: description, checklist, subtasks, comments.
- Side panel: metadata, assignees, dates, progress, links, time tracking, AI summary.
- Activity timeline lower or tabbed.

### Components

- Rich title editor
- Rich description editor
- Select controls
- Progress Bar
- Checklist
- Subtask list
- Attachment list
- Comment thread
- Activity timeline
- Time tracker
- Avatar group
- Link sections
- AI summary card
- Quick Actions

### Displayed Information

- Task title
- Rich description
- Priority
- Status
- Progress
- Checklist
- Subtasks
- Attachments
- Comments
- Activity timeline
- Time tracking
- Assignees
- Linked documentation, notes, Git commits, calendar events, API, database
- AI summary

### Interaction

- Inline edit fields save on blur or explicit save depending risk.
- Status changes update task workflow.
- Comments support mentions and markdown.
- Attachments upload via button or drag-and-drop.
- Links open source object.
- Quick actions: Complete, Assign, Duplicate, Archive, Start Timer, Generate AI Summary.

### Validation

- Status transitions follow workflow.
- Required custom fields validate before completion if configured.
- Dependencies can block completion when policy requires.

### Accessibility

- Drawer has accessible heading.
- Metadata sections have labels.
- Timeline is navigable and readable.
- Focus returns to source row on close.

### Developer Notes

- Use realtime subscriptions for comments, status, and assignments.
- Handle edit conflicts with field-level conflict UI.

### Backend Notes

- Store immutable audit history for changes.
- Enforce link visibility across modules.

### Frontend Notes

- Avoid full task reload after every inline edit.
- Preserve cursor position during realtime updates.

### QA Notes

- Test concurrent edits, offline retry, permission changes, and drawer route restore.

### UX Reasoning

Task Detail is where work becomes explicit. It must support depth without overwhelming the primary execution path.

## 8. Task Comments

### Purpose

Support discussion, decisions, mentions, review, and resolution around a task.

### Layout

- Threaded comment area below description or in a Comments tab.
- Composer fixed near bottom within detail view.

### Components

- Comment composer
- Markdown/code editor
- Mention picker
- Attachment control
- Comment thread
- Reply thread
- Pin and resolve controls

### Interaction

- Create, edit, delete comments.
- Reply to comments.
- Mention members.
- Add emoji reactions.
- Attach files.
- Pin important comments.
- Resolve threads.
- Search comments.
- Paginate older comments.

### Validation

- Empty comments cannot be submitted.
- Mentions require member visibility.
- Delete permissions depend on author or moderator role.

### Accessibility

- Comments are list items.
- Composer label is visible.
- Mentions are inserted with accessible text.

### Developer Notes

- Use pagination for large threads.
- Store edited state and timestamps.
- Notify mentioned users.

### Backend Notes

- Sanitize markdown and code blocks.
- Maintain comment version metadata when required.

### Frontend Notes

- Preserve draft comments locally.

### QA Notes

- Test mentions, replies, markdown, code blocks, edit/delete permissions, and notifications.

### UX Reasoning

Comments should feel like focused work discussion, not social media.

## 9. Checklist

### Purpose

Break a task into lightweight completion steps.

### Layout

- Checklist section in Task Detail main column.
- Progress indicator in section header.

### Components

- Checkbox rows
- Inline text editor
- Drag handle
- Progress Bar
- Add item input

### Interaction

- Create, edit, delete, reorder, complete items.
- Enter adds next item.
- Drag or keyboard reorder.

### Validation

- Empty items are not saved.
- Completion updates task progress when progress source includes checklist.

### Accessibility

- Checklist rows are keyboard reachable.
- Reorder has keyboard controls.

### Developer Notes

- Optimistic updates are safe with rollback.

### Backend Notes

- Store checklist item order.

### Frontend Notes

- Prevent layout jump during inline editing.

### QA Notes

- Test reorder, completion progress, concurrent edits.

### UX Reasoning

Checklists should be faster than subtasks and used for simple steps.

## 10. Subtasks

### Purpose

Represent work items that need ownership, status, priority, progress, and dependencies.

### Layout

- Nested task list inside Task Detail.
- Can expand into full child task details.

### Components

- Subtask row
- Status selector
- Priority selector
- Assignee avatar
- Progress indicator
- Dependency indicator

### Interaction

- Create child task.
- Edit status, priority, assignment.
- Open child detail.
- Reorder when manual order is active.

### Validation

- Parent-child cycles are forbidden.
- Completion rules depend on project policy.
- Parent completion may require all required subtasks complete.

### Accessibility

- Nested hierarchy is announced.
- Expand/collapse has clear state.

### Developer Notes

- Subtasks are tasks with parent relationship.

### Backend Notes

- Enforce hierarchy depth limit if needed for performance.

### Frontend Notes

- Lazy-load nested children beyond first level.

### QA Notes

- Test completion rules and dependency cycles.

### UX Reasoning

Subtasks are for real delegated work, not simple checklist steps.

## 11. Attachments

### Purpose

Attach files, screenshots, logs, specs, exports, and supporting assets to tasks.

### Layout

- Attachment section with upload area and file list.

### Components

- Upload button
- File rows
- Preview modal
- Download action
- Version history
- Storage usage indicator

### Interaction

- Upload, preview, download, delete.
- Replace file creates new version when versioning is enabled.

### Validation

- Enforce supported file types, size limits, storage limits, and permissions.

### Accessibility

- Upload supports keyboard and file picker.
- File actions have labels.

### Developer Notes

- Use resumable upload for large files.

### Backend Notes

- Scan files according to security policy.
- Track storage usage and version history.

### Frontend Notes

- Show upload progress and retry.

### QA Notes

- Test upload failure, large files, delete, preview, permissions.

### UX Reasoning

Attachments must be reliable and transparent because developers often attach evidence, logs, and specs.

## 12. Task History

### Purpose

Provide an auditable timeline of task changes.

### Layout

- Timeline view with filters and search.

### Components

- Timeline
- Filter controls
- Search
- Export action

### Tracked Events

- Creation
- Updates
- Status changes
- Assignments
- Comments
- Attachments
- Checklist updates
- Subtask updates
- Time tracking
- AI activity
- System events

### Interaction

- Filter by event type, actor, date.
- Search timeline.
- Export history when permitted.

### Validation

- History visibility follows permission policy.

### Accessibility

- Timeline is readable as chronological list.

### Developer Notes

- History is append-only.

### Backend Notes

- Store actor, timestamp, previous value, new value, source.

### QA Notes

- Verify every mutation writes correct history.

### UX Reasoning

History builds trust in collaborative work and helps resolve conflicts.

## 13. Task Settings

### Purpose

Configure task-level notifications, automation, permissions, and lifecycle actions.

### Layout

- Settings section or modal from Task Detail.

### Components

- Switches
- Selects
- Buttons
- Confirmation Modal

### Settings

- General
- Notifications
- Automation
- Permissions
- Archive
- Duplicate
- Delete
- Danger Zone

### Validation

- Delete and archive require permission.
- Automation rules must be valid and non-conflicting.

### Accessibility

- Dangerous actions are clearly labelled and confirmed.

### Developer Notes

- Task settings inherit project defaults unless overridden.

### QA Notes

- Test inheritance, overrides, and destructive confirmations.

### UX Reasoning

Task settings should not distract from doing work, but they must be complete for advanced workflows.

## 14. Task Status System

Statuses:

- Backlog
- To Do
- In Progress
- Review
- Testing
- Done
- Archived
- Cancelled
- Blocked
- Waiting

Allowed transitions:

- Backlog -> To Do, In Progress, Cancelled
- To Do -> In Progress, Blocked, Waiting, Cancelled
- In Progress -> Review, Testing, Blocked, Waiting, Done
- Review -> In Progress, Testing, Done
- Testing -> In Progress, Review, Done
- Blocked -> To Do, In Progress, Waiting, Cancelled
- Waiting -> To Do, In Progress, Blocked, Cancelled
- Done -> Archived, In Progress if reopened
- Cancelled -> Archived, To Do if reopened
- Archived -> To Do only after restore

Rules:

- Done can require checklist, subtasks, or required fields.
- Archived tasks are read-only by default.
- Blocked tasks require blocker reason or dependency.

## 15. Priority System

Priorities:

- Lowest
- Low
- Medium
- High
- Urgent
- Critical

Behavior:

- Medium is default.
- Critical should be rare and may trigger stronger notifications.
- Priority affects sorting, AI risk analysis, and dashboard surfacing.

Visual hierarchy:

- Use text labels and neutral badges.
- Use status color only for Urgent/Critical when needed.

## 16. Task Dependencies

Types:

- Blocks
- Blocked By
- Related
- Duplicate
- Parent
- Child
- Waiting For

Logic:

- Blocking relationships can prevent completion when policy requires.
- Duplicate tasks should point to canonical task.
- Parent-child relationships power subtasks.
- Cycles are forbidden.

## 17. Task Progress

Sources:

- Checklist
- Subtasks
- Time Tracking
- Manual Progress
- Automatic Progress
- AI Prediction

Calculation:

- Default: completed checklist items and completed subtasks weighted equally.
- If estimates exist, weight by estimated time.
- Manual progress overrides require audit history.
- AI prediction is advisory and never the stored completion value unless accepted.

## 18. Search Experience

Search by:

- Title
- Description
- Tags
- Members
- Priority
- Status
- Due Date
- Project
- Recent
- Favorites

Shortcut:

- Command/Ctrl + K for global search.

Behavior:

- Result ranking prioritizes exact title, assigned tasks, recent tasks, active project, due soon.
- Filters can be applied after search.

Accessibility:

- Announce result count and active result.

## 19. Filter System

Filters:

- Status
- Priority
- Tags
- Members
- Projects
- Date
- Due Date
- Created Date
- Updated Date
- Estimated Time
- Completed
- Archived
- Favorites
- Blocked
- Saved Filters

Behavior:

- Filters combine with AND across categories.
- Multiple values inside one category use OR.
- Active filters appear as removable chips.
- Saved filters can be personal or shared.

## 20. Sorting

Sort options:

- Due Date
- Priority
- Status
- Recently Updated
- Recently Created
- Alphabetical
- Estimated Time
- Progress
- Manual Order

Behavior:

- Manual order is available in scoped lists.
- Sorting must be stable.
- Secondary sort defaults to recently updated.

## 21. Bulk Actions

Actions:

- Assign
- Delete
- Archive
- Duplicate
- Change Status
- Change Priority
- Move Project
- Add Tags
- Remove Tags
- Export

Validation:

- Validate permissions per task.
- Show partial success report.
- Destructive bulk actions require confirmation.

## 22. Quick Actions

Actions:

- Create Task
- Duplicate
- Assign
- Complete
- Archive
- Start Timer
- Open Calendar
- Generate AI Summary

Visibility:

- Permission-aware.
- Context-aware based on selected task state.

## 23. Automation

Triggers:

- When Task Created
- When Task Completed
- When Due Date Changed
- When Assigned
- When Status Changed
- When Overdue
- Reminder Rules
- Recurring Tasks
- AI Suggestions

Behavior:

- Automation rules are project-scoped by default.
- AI suggestions create drafts requiring approval unless explicitly configured.
- Recurring tasks generate future instances according to schedule.

## 24. Notifications

Events:

- Task Assigned
- Task Updated
- Comment Mention
- Due Soon
- Overdue
- Checklist Completed
- Dependency Blocked

Logic:

- Notify directly affected users.
- Avoid duplicate notifications for bulk edits.
- Mentions override mute settings unless policy prevents it.

## 25. Empty States

- No Tasks: create first task.
- No Search Results: clear filters.
- No Checklist: add first checklist item.
- No Subtasks: create a subtask when work needs ownership.
- No Attachments: upload supporting files.
- No Comments: start discussion.
- No Activity: history appears after updates.

## 26. Error States

- Task Not Found: return to previous list.
- Permission Denied: explain access limitation.
- Sync Failed: keep local edits and retry.
- Upload Failed: show file-level retry.
- Conflict: compare local and server values.
- Validation Error: inline field errors.
- Dependency Conflict: explain cycle or blocking rule.

## 27. Loading States

- Task Loading: detail skeleton.
- Comment Loading: thread skeleton.
- Attachment Loading: file row skeleton.
- History Loading: timeline skeleton.
- Checklist Loading: row skeleton.
- Optimistic Updates: immediate UI with rollback on failure.

## 28. Responsiveness

Desktop:

- Explorer plus detail drawer.

Small Desktop:

- Detail opens full width over list.

Large Desktop:

- Keep drawer and list visible.

Ultra-wide:

- Allow secondary context panel for history or AI.

## 29. Accessibility

- Full keyboard navigation.
- Focus order follows shell, explorer, detail, side metadata.
- Screen readers receive labels for status, priority, dates, progress, and dependencies.
- ARIA roles for dialogs, menus, lists, tables, alerts, status, and progress.
- High contrast mode strengthens borders and focus.
- Reduced motion disables transitions and shimmer.
- Forms use visible labels and associated errors.

## 30. Performance

- Realtime synchronization for visible tasks and comments.
- Virtualize large lists.
- Optimistic updates for safe changes.
- Background refresh for counts, analytics, and AI.
- Cache task list queries and recent tasks.
- Paginate comments, history, and attachments.
- Lazy-load heavy panels such as history and AI.
- Offline support queues edits where product policy permits.

## 31. Security

- Enforce workspace and project isolation.
- Validate permissions and roles server-side.
- Maintain audit trail.
- Encrypt sensitive attachment storage in accordance with platform policy.
- Preserve version history where required.
- Prevent AI from accessing tasks outside allowed scope.

## 32. Integrations

Workspace:

- Tasks inherit workspace policies.

Projects:

- Tasks belong to projects by default.

Kanban:

- Status and grouping power boards.

Calendar:

- Start dates, due dates, reminders, and repeats appear in calendar.

Timeline:

- History and scheduling events feed timeline views.

Analytics:

- Completion, velocity, workload, and health derive from tasks.

Time Tracking:

- Time entries link to tasks.

Documentation and Notes:

- Tasks can link to knowledge and planning documents.

Git Integration:

- Commits, branches, and pull requests can link to tasks.

Database Manager:

- Database records or queries can link to tasks.

API Collection:

- API requests and test cases can link to tasks.

Snippet Manager:

- Snippets can support implementation tasks.

AI Assistant:

- AI summarizes, breaks down, estimates, detects risks, suggests priority, suggests assignee, generates documentation, generates commit messages, and supports daily review.

Notifications:

- Task events produce notifications.

Cloud Sync:

- Task changes synchronize across devices and collaborators.

## 33. AI Features

AI Task Summary:

- Summarizes task status, comments, links, and next steps.

Task Breakdown:

- Converts a task into checklist items or subtasks.

Generate Subtasks:

- Creates draft subtasks for review.

Estimate Time:

- Suggests effort based on description, history, and project patterns.

Suggest Priority:

- Suggests priority from due date, dependencies, project health, and business context.

Detect Risks:

- Finds overdue, blocked, vague, under-assigned, or high-dependency tasks.

Detect Blockers:

- Identifies missing dependencies, waiting states, and blocked chains.

Suggest Assignee:

- Suggests members based on workload, role, past activity, and ownership.

Generate Documentation:

- Creates draft docs from task context.

Generate Commit Message:

- Drafts commit message from linked task and Git changes.

Daily Review:

- Summarizes completed, carried over, blocked, and recommended tasks.

Rules:

- AI outputs are drafts unless user confirms.
- AI must show source context in detail views.
- AI cannot bypass permissions.

## 34. Quality Bar

Task management is complete when users can create, organize, execute, discuss, link, automate, analyze, and audit tasks with fast interactions, accessible controls, robust permissions, realtime updates, and consistent Phase 01 visual language.

