# Primordial Task Calendar & Timeline Specification

Version: 1.0  
Phase: 08  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 05 Project Management](./PROJECT_MANAGEMENT.md), [Phase 06 Task Management](./TASK_MANAGEMENT.md)

---

## 1. Product Intent

The Calendar and Timeline module is the centralized chronological planning engine for Primordial Task. It visualizes tasks, deadlines, milestones, meetings, and team workload. It is designed to be a high-performance productivity system, not just a viewing tool, enabling strategic resource allocation and individual focus management through AI-assisted scheduling.

---

## 2. Design Philosophy

- **Extreme Clarity**: Prioritize readability of dense data over visual flair.
- **Precision**: 8pt grid alignment for all calendar cells and event blocks.
- **Monochrome Elegance**: Use `gray` scale for structure; reserve semantic colors (`success`, `warning`, `danger`, `info`) for status only.
- **Contextual Power**: Every calendar event is a gateway to the full task/project context.

---

## 3. Screen Specifications

### 3.1 Calendar Dashboard (The Shell)

- **Purpose**: Unified entry point for all time-based workflows.
- **Layout**:
  - Left Sidebar (264px): Mini-calendar, filter categories, upcoming list.
  - Top Toolbar (48px): View navigation, today, search, quick create.
  - Center: Fluid calendar grid.
  - Right Inspector (360px): Event details or AI Workload drawer.
- **Components**: `Sidebar`, `MiniCalendar`, `ViewSwitcher`, `FilterPanel`, `GlobalSearch`, `AddEventButton`, `NotificationBadge`.
- **Interactions**:
  - View switching (Instant transition).
  - Search (Filtering in-view items).
  - Quick Create (Clicking empty space).
- **Validation**: Ensure date ranges are valid; prevent overlapping of non-concurrent event types.
- **Accessibility**: ARIA live regions for date changes; keyboard-accessible view switching.
- **Business Rules**: Users only see calendars they have permissions for in the workspace.
- **State Management**: Persist last viewed mode (e.g., "Week") and active filters in local storage.
- **Realtime Behavior**: Immediate UI updates when others add events to shared project calendars.
- **Offline Behavior**: Allow viewing of cached range; queue new event creations.
- **API Requirements**: `GET /calendar/events?start=...&end=...&filters=...`.
- **Database Relationships**: One-to-many relationship between `Workspace` and `CalendarEvents`.
- **UX Reasoning**: Keeps navigation stable while allowing main content to breathe.
- **Developer Notes**: Use `React.memo` for grid cells to prevent unnecessary re-renders.
- **Backend Notes**: Optimize range queries using spatial or B-Tree indexing on `start_time`.
- **Frontend Notes**: Implement `CSS Container Queries` for responsive dashboard layout.
- **QA Notes**: Verify view persistence after page refresh.

### 3.2 Month View

- **Purpose**: Monthly planning and milestone tracking.
- **Layout**: 7-column grid with dynamic row height.
- **Components**: `DayCell`, `EventIndicator`, `OverflowPopover`, `MilestoneBadge`.
- **Interactions**:
  - Drag event to change date.
  - Click "+n more" to see all events for a busy day.
- **Validation**: Limit event titles to single line; show full title on hover.
- **Accessibility**: Screen reader announces "15 events on August 4th".
- **Business Rules**: Holidays and non-working days (from workspace settings) are visually dimmed.
- **State Management**: Track `hoveredDate` for subtle cell highlighting.
- **Realtime Behavior**: Optimistic UI update for drag-and-drop moves.
- **Offline Behavior**: Show "Out of sync" icon if move fails while offline.
- **API Requirements**: `PATCH /events/{id}/date`.
- **Database Relationships**: Events linked to `Task` or `Meeting` entities.
- **UX Reasoning**: Provides the "Big Picture" view essential for long-term project health.
- **Frontend Notes**: Use a 100% height grid to avoid vertical scroll within cells.
- **QA Notes**: Test drag-and-drop across different months.

### 3.3 Week View

- **Purpose**: Detailed weekly execution and time blocking.
- **Layout**: 7 columns with vertical hourly axis (00:00 - 23:00).
- **Components**: `HourLine`, `TimeIndicator`, `CurrentTimeMarker`, `EventBlock`.
- **Interactions**:
  - Drag-to-create (Select time range).
  - Resize (Bottom handle).
  - Drag-to-move (Shift time/date).
- **Validation**: Minimum event duration: 15 minutes.
- **Accessibility**: Arrow keys move focus by 15-minute intervals.
- **Business Rules**: Prevent moving "ReadOnly" events (e.g., locked meetings).
- **State Management**: Current scroll position should default to `currentTime - 2 hours`.
- **Realtime Behavior**: Collision detection updates in realtime if two users move events to the same slot.
- **UX Reasoning**: The most used view for active developers managing meetings and deep work.
- **Frontend Notes**: Implement "Z-index" stacking logic for overlapping events.
- **QA Notes**: Verify accurate "Current Time" line position across timezones.

### 3.4 Timeline View (Gantt)

- **Purpose**: Project roadmap and dependency management.
- **Layout**: Horizontal timeline with vertical grouping by Project or Member.
- **Components**: `DurationBar`, `DependencyLink`, `MilestoneDiamond`, `TodayLine`.
- **Interactions**:
  - Zoom (Day/Week/Month).
  - Dependency drag (Connect bars).
  - Scroll (Horizontal).
- **Validation**: Prevent circular dependencies.
- **Accessibility**: High contrast for dependency lines; list-view alternative for screen readers.
- **Business Rules**: Dependencies can be "Soft" (warning only) or "Hard" (blocks move).
- **State Management**: Zoom level persisted.
- **Realtime Behavior**: Cascading updates (moving a blocker moves all blocked tasks).
- **API Requirements**: `GET /calendar/dependencies`.
- **Database Relationships**: Self-referencing `TaskDependency` table.
- **UX Reasoning**: Essential for PMs to identify the "Critical Path".
- **Developer Notes**: Use `SVG` or `Canvas` for drawing dependency lines for performance.
- **QA Notes**: Test horizontal scroll performance with 500+ tasks.

---

## 4. Event Detail & Management

### 4.1 Event Detail Drawer

- **Purpose**: Deep edit for calendar entries.
- **Layout**: Right-aligned drawer (360px - 480px).
- **Components**: `RichEditor`, `AssigneeSelector`, `ProjectLink`, `PriorityBadge`, `DateTimeInput`.
- **Interactions**: Inline edits with auto-save.
- **Validation**: End date must be >= Start date.
- **Accessibility**: Focus trapping in drawer.
- **Business Rules**: Only event owners or workspace admins can edit Meeting details.
- **Realtime Behavior**: Show "User is typing..." in description for collaborative edits.
- **UX Reasoning**: Preserves calendar context while editing.
- **QA Notes**: Test concurrent edits on the same event.

---

## 5. Core Systems

### 5.1 Recurring Events Logic

- **Rules**: Supports Daily, Weekly, Monthly, Yearly, and Custom (e.g., "Every 2 weeks").
- **Exceptions**: "Delete this occurrence" vs "Delete all following" vs "Delete series".
- **Database**: Store a `RecurrenceRule` (RRULE) string and expanded instances.
- **UX Reasoning**: Automates routine planning.

### 5.2 Reminders & Notifications

- **Types**: Desktop Toast, Email, Mobile Push, Slack/Discord (Integrations).
- **Logic**: Triggered via `EventTime - ReminderOffset`.
- **Smart Reminders**: AI suggests a reminder 5 mins before a meeting if the user is currently "In Code" (active Git/Editor activity).

### 5.3 Workload Analysis (AI)

- **Calculations**: Sum of `EstimatedTime` vs `AvailableCapacity`.
- **Visuals**: Heatmap indicators in column headers (Month/Week).
- **AI Action**: Suggests moving 3 low-priority tasks if today is >120% capacity.
- **UX Reasoning**: Prevents burnout and ensures realistic planning.

---

## 6. AI Features

- **Daily Briefing**: Generated 08:00 AM summary of "What's on your plate today".
- **Schedule Suggestor**: "Find 4 hours for Task X" -> AI finds and reserves the best slot.
- **Missed Deadline Predictor**: Analyzes historical velocity and warns of likely milestone misses.

---

## 7. Performance & Security

- **Performance**:
  - Virtualize all lists and grids.
  - Use `IndexedDB` for local cache of the last 3 months of data.
  - Debounce all "Move" API calls by 500ms.
- **Security**:
  - Workspace-level multi-tenancy.
  - End-to-end encryption for "Private" event descriptions.
  - Strict CORS and JWT validation on all calendar endpoints.

---

## 8. Keyboard Shortcuts

- `T`: Today
- `M`/`W`/`D`/`A`/`L`: Switch Views (Month, Week, Day, Agenda, Timeline)
- `C`: Create Event
- `Backspace`: Delete Selected
- `Cmd + K`: Command Palette (Calendar Actions)
- `Left/Right Arrow`: Navigate time periods.

### 3.4 Day View

- **Purpose**: Micro-planning and hourly focus for a single date.
- **Layout**: Single vertical column with high-density hourly grid.
- **Components**: `FocusBlock`, `TaskItem`, `MeetingJoinButton`, `TimeScrub`.
- **Interactions**:
  - Click-and-drag to block time.
  - One-click "Join Meeting" (Integration with external links).
- **Validation**: Ensure no overlapping meetings are marked as "Going" simultaneously.
- **Accessibility**: Screen reader focus on "Next Event" on load.
- **Business Rules**: Current time is always anchored in the viewport during the working day.
- **State Management**: Persist "Scroll to start of workday" preference.
- **Realtime Behavior**: Immediate notification if a meeting in the next hour is rescheduled.
- **Offline Behavior**: Cache meeting links for offline reference.
- **API Requirements**: `GET /calendar/day?date=...`.
- **UX Reasoning**: Reduces cognitive load by filtering out non-today noise.
- **QA Notes**: Verify accurate "Current Time" rendering at midnight transition.

### 3.5 Agenda View

- **Purpose**: Chronological list of events for rapid scanning.
- **Layout**: Vertical list with sticky date headers.
- **Components**: `AgendaRow`, `DateHeader`, `EmptyAgendaState`.
- **Interactions**:
  - Click row to open Detail Drawer.
  - Search/Filter within the list.
- **Validation**: Sort strictly by `start_time` within each date group.
- **Accessibility**: List semantics; ARIA labels for group headers.
- **Business Rules**: Past events can be dimmed or hidden via toggle.
- **State Management**: Infinite scroll position persistence.
- **Realtime Behavior**: New items appear at the top/bottom of their respective date group.
- **UX Reasoning**: Best for mobile-like scanning or keyboard-heavy workflows.
- **Frontend Notes**: Use virtualization for the list to handle long histories.
- **QA Notes**: Test "Jump to Today" behavior from deep in the past.

### 3.6 Reminder Manager

- **Purpose**: System-wide control over time-based notifications.
- **Layout**: Modal or Drawer listing all upcoming/snoozed reminders.
- **Components**: `ReminderCard`, `SnoozeButton`, `DismissAction`, `RecurringReminderToggle`.
- **Interactions**:
  - Snooze for X minutes.
  - Edit notification sound/priority.
- **Validation**: Prevent snoozing past the event end time.
- **Accessibility**: High-contrast dismiss buttons; screen reader alerts for expiring reminders.
- **Business Rules**: Reminders inherit workspace notification policies.
- **State Management**: Local notification queue managed via `ServiceWorker`.
- **Realtime Behavior**: Sync snooze state across all devices.
- **API Requirements**: `PATCH /reminders/{id}/snooze`.
- **UX Reasoning**: Prevents "Notification Fatigue" by centralizing controls.
- **QA Notes**: Verify reminders trigger while the app is in background.

---

## 4. UI States & Responsiveness

### 4.1 Empty States
- **Purpose**: Provide guidance when no data exists.
- **Layout**: Centered illustration (monochrome) with clear CTA.
- **Components**: `EmptyIllustration`, `TitleText`, `ActionButton`.
- **UX Reasoning**: Encourages first-run engagement.
- **QA Notes**: Verify different empty states for "No Results" vs "No Events".

### 4.2 Error States
- **Purpose**: Recovery from sync or permission failures.
- **Layout**: Inline alert or full-screen overlay depending on severity.
- **Components**: `ErrorIcon`, `RetryButton`, `DiagnosticLogLink`.
- **UX Reasoning**: Minimizes frustration by providing a clear path forward.
- **QA Notes**: Test "Offline" error vs "Server 500" error.

### 4.3 Loading States
- **Purpose**: Indicate progress and maintain layout stability.
- **Layout**: Skeleton grid matching the active view.
- **Components**: `SkeletonCell`, `SkeletonEvent`.
- **UX Reasoning**: Reduces perceived latency.
- **QA Notes**: Verify shimmer animation stops when data is injected.

### 4.4 Responsiveness
- **Desktop (Default)**: Full multi-pane dashboard.
- **Small Desktop (1024px)**: Sidebar collapses to icons; Inspector becomes a full-screen overlay.
- **Ultra-wide (>2000px)**: Allow Sidebar and Inspector to be permanently pinned with expanded content.
- **UX Reasoning**: Ensures productivity regardless of screen real estate.

---

## 5. Automation & Workflow

- **Auto-Scheduling**: If a task has a duration but no date, AI suggests a slot in the next 48 hours.
- **Deadline Cleanup**: Past-due tasks with no progress are automatically moved to "Today" (if configured).
- **Sprint Integration**: Calendar automatically generates "Sprint Start" and "Sprint End" milestones from the Project module.
- **API Requirements**: `POST /calendar/automate/schedule`.
- **Business Rules**: Automations only run on tasks with `Ready` status.
- **QA Notes**: Verify no "Infinite Loop" in auto-rescheduling logic.

---

## 6. Integrations Matrix

- **Tasks**: Source of truth for date-based work.
- **Kanban**: Status sync (Archived tasks hidden from calendar).
- **Analytics**: Workload data source.
- **Git**: Commit history can be overlaid on the timeline to show "Work vs Schedule".
- **External**: Google/Outlook bidirectional sync.

---

## 10. Quality Assurance

- **Timezone Testing**: Ensure events don't "jump" days when traveling.
- **Recursive Testing**: Verify series deletion logic.
- **Performance Testing**: 2000 events in a single Month view (overflow handling).
- **Accessibility Testing**: 100% keyboard navigability.
