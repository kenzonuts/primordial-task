# Primordial Task Dashboard Experience Specification

Version: 1.0  
Phase: 03  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 02 Authentication Experience](./AUTHENTICATION_EXPERIENCE.md)  

## 1. Product Intent

The Dashboard is the user's command center. It is the first authenticated workspace users see after launch, sign-in, or workspace selection. Its job is to answer the most important daily questions within seconds:

- What should I do today?
- What projects need attention?
- What deadlines are approaching?
- Am I behind schedule?
- What changed since yesterday?
- What does AI recommend?

The dashboard must feel like a professional operating system for developers, not a traditional task manager. It should be calm, information-rich, fast, and precise. Every visible element must help the user decide what to inspect, start, or resolve next.

## 2. Design Principles

### 2.1 Follow Phase 01

The dashboard uses the Phase 01 design system without visual deviation:

- Dark theme
- Monochrome base palette
- Black, white, and gray surfaces
- Status colors only for success, warning, danger, and information
- Generous spacing
- Rounded components
- Soft shadows
- Minimal borders
- Lucide-style iconography
- Predictable desktop interaction patterns

### 2.2 Dashboard Philosophy

The dashboard should feel:

- Confident: Important work is clearly ranked.
- Focused: Users see what matters today before historical or secondary data.
- Calm: No loud charts, gamified scores, or decorative color.
- Productive: Users can create, review, search, and act immediately.
- Fast: Data appears progressively and never blocks the entire screen.
- Elegant: Layout, spacing, and typography provide hierarchy instead of ornament.

### 2.3 Content Priority

Dashboard content is ordered by user decision value:

1. Critical work requiring attention today
2. Overdue or blocked work
3. Upcoming deadlines and schedule pressure
4. Project health and progress
5. Recent changes and team activity
6. AI recommendations and summaries
7. Secondary productivity signals

## 3. Desktop Window Structure

### 3.1 Primary Layout

The dashboard uses a persistent application shell:

```text
Application Window
  Left Sidebar
  Main Region
    Top Navigation
    Dashboard Content
  Right Utility Panel
```

Default dimensions:

- Minimum supported width: `1024px`
- Recommended desktop width: `1280px` to `1600px`
- Sidebar expanded width: `264px`
- Sidebar collapsed width: `72px`
- Top navigation height: `48px`
- Main content padding: `24px`
- Right utility panel width: `360px`
- Section gap: `32px`
- Widget gap: `16px`

### 3.2 Why Each Area Exists

Sidebar:

- Provides stable product navigation.
- Makes Primordial Task feel like a full workspace, not a single dashboard.
- Gives users confidence that all major product areas are reachable.

Top Navigation:

- Provides workspace context, global search, quick creation, notifications, and profile access.
- Supports fast command-driven workflows.
- Keeps global utilities stable across modules.

Main Content:

- Hosts the user's daily command center.
- Prioritizes work, deadlines, project state, and key insights.
- Supports immediate action without navigation.

Right Utility Panel:

- Hosts AI Daily Summary, recommendations, risks, and contextual productivity signals.
- Keeps AI visible without turning the dashboard into a chatbot.
- Can collapse for smaller screens.

## 4. Sidebar Specification

### 4.1 Purpose

The sidebar is the main navigation spine. It communicates product scope and workspace identity while preserving fast access to every major mode.

### 4.2 Layout

Top to bottom:

1. Application logo and product mark
2. Workspace switcher
3. Primary navigation
4. Developer tools group
5. Settings and account utilities

Expanded sidebar:

- Width: `264px`
- Padding: `12px`
- Background: `surface.sidebar`
- Border right: `1px solid border.subtle`
- Row height: `32px`
- Group gap: `20px`
- Item radius: `radius.md`

Collapsed sidebar:

- Width: `72px`
- Logo centered
- Navigation icons centered
- Tooltips required for every icon
- Workspace switcher becomes workspace avatar button

### 4.3 Navigation Hierarchy

Primary group:

- Dashboard
- Projects
- Tasks
- Kanban
- Calendar
- Analytics

Intelligence group:

- AI Workspace

Developer group:

- Developer Tools
- Snippets
- API Collections
- Database Manager
- Git

System group:

- Settings

Only the required items must be visible in the initial dashboard spec. Additional developer modules may sit under Developer Tools when the product needs a shorter sidebar.

### 4.4 Required Navigation Items

Dashboard:

- Default landing page.
- Active when the current route is the dashboard.

Projects:

- Opens project index and project health views.

Tasks:

- Opens task list and planning views.

Kanban:

- Opens board-focused execution view.

Calendar:

- Opens schedule, deadlines, and meetings.

Analytics:

- Opens productivity and reporting views.

AI Workspace:

- Opens AI-assisted planning, review, summarization, and automation workflows.

Developer Tools:

- Opens unified technical tools such as Git, databases, API collections, snippets, and environment utilities.

Settings:

- Opens workspace, account, preferences, billing, and integrations.

### 4.5 Active State

Active item:

- Background: `state.selected`
- Text: `text.primary`
- Icon: `gray.0`
- Optional left active rail: `2px` in `gray.100`

Hover:

- Background: `state.hover`
- Text shifts from `text.secondary` to `text.primary`
- Transition: `motion.fast`

Pressed:

- Background: `state.pressed`

Focus:

- Visible focus ring using `state.focus`
- Focus ring must not be clipped

Disabled:

- Text: `text.disabled`
- Tooltip explains why unavailable

### 4.6 Workspace Switcher

Purpose:

- Shows current workspace and opens workspace switching.

Displayed information:

- Workspace logo or initials
- Workspace name
- User role or plan metadata, if useful
- Chevron icon

Interaction:

- Click opens workspace menu.
- Keyboard Enter or Space opens menu.
- Menu includes switch workspace, manage workspace, invite member, and sign out.

Developer notes:

- Cache last selected workspace.
- If user has one workspace, still show workspace identity but keep switch menu compact.

## 5. Top Navigation Specification

### 5.1 Purpose

Top navigation provides global utilities and immediate context without competing with dashboard content.

### 5.2 Layout

Left to right:

1. Workspace name
2. Current project context, if selected
3. Global search
4. Quick Create
5. Notifications
6. Theme indicator
7. Profile

Dimensions:

- Height: `48px`
- Padding horizontal: `16px`
- Background: `surface.nav`
- Border bottom: `1px solid border.subtle`
- Gap between utility controls: `8px`

### 5.3 Workspace Name

Purpose:

- Confirms the active workspace.

Interaction:

- Click opens workspace switcher menu.
- Tooltip shows full workspace name if truncated.

### 5.4 Current Project

Purpose:

- Shows scoped project context when the dashboard is filtered to a project.

Behavior:

- Hidden on global dashboard.
- Visible as breadcrumb-like label when project scope is active.
- Click opens project picker.

### 5.5 Global Search

Purpose:

- Search across projects, tasks, workspaces, members, docs, snippets, and commands.

Interaction:

- Click opens command palette.
- Keyboard shortcut: Command/Ctrl + K.
- Slash `/` may focus local dashboard search only if no input is active.

### 5.6 Notifications

Purpose:

- Shows unread updates, mentions, system alerts, and workflow changes.

Interaction:

- Click opens notification drawer or popover.
- Unread count uses neutral badge unless severity requires status color.

### 5.7 Quick Create

Purpose:

- Starts high-frequency creation workflows.

Interaction:

- Click opens Quick Actions panel.
- Keyboard shortcut: Command/Ctrl + N opens New Task by default.
- Command/Ctrl + Shift + N opens full Quick Create panel.

### 5.8 Profile

Purpose:

- Gives access to account, presence, preferences, and sign out.

Interaction:

- Avatar click opens profile menu.
- Menu includes profile, preferences, keyboard shortcuts, and sign out.

### 5.9 Theme Indicator

Purpose:

- Communicates theme mode and system appearance state.

Behavior:

- Since Primordial Task is dark-mode-first, indicator is subtle.
- Click opens appearance settings, not a large theme switcher.
- Do not introduce colorful theme controls.

## 6. Main Dashboard Layout

### 6.1 Content Grid

Default desktop structure:

```text
Main Content
  Welcome Section
  Primary Work Grid
    Left Column
      Today's Tasks
      Overdue Tasks
      Upcoming Deadlines
    Center Column
      Recent Projects
      Project Progress
      Recent Activity
    Right Utility Panel
      AI Daily Summary
      Today's Recommendations
      Risk Detection
      Productivity Insights
```

Recommended desktop grid:

- Main content area uses 12 columns.
- Left column: 5 columns.
- Center column: 4 columns.
- Right utility panel: fixed `360px` or 3 columns equivalent.
- Gap: `16px`.
- Section gap: `24px` to `32px`.

### 6.2 Information Density

The dashboard should show enough to act without becoming a report page.

Default visible limits:

- Today's Tasks: 6 items
- Overdue Tasks: 3 items
- Upcoming Deadlines: 5 items
- Recent Projects: 4 items
- Recent Activity: 8 items
- Pinned Items: 5 items
- Favorite Projects: 4 items

Each section offers "View all" when more items exist.

## 7. Dashboard Sections

## 7.1 Welcome Section

### Purpose

Establish context for the day and orient the user after launch.

### Priority

High. This is the first content block and sets the tone.

### Layout

- Full-width header region above dashboard widgets.
- Left side: greeting, date, workspace context.
- Right side: compact quick actions and optional sync status.
- No large decorative hero.

### Displayed Information

- Greeting: "Good morning, Alex."
- Date: "Tuesday, August 4"
- Workspace name
- Today's summary line: "6 tasks due today, 2 projects need attention."
- Last sync time when relevant

### Interactions

- Quick action buttons: New Task, New Project, Ask AI.
- Sync status opens sync details.
- Date opens calendar view.

### Empty State

If no tasks or projects exist:

- Title: "Start with your first project."
- Body: "Create a project to organize tasks, deadlines, and team activity."
- Primary action: "New Project"

### Loading State

- Skeleton lines for greeting summary.
- Quick actions remain available if permissions are loaded.

### Error State

- Inline Alert: "Dashboard summary could not be loaded."
- Action: "Retry"

### Accessibility

- Greeting is `h1`.
- Summary is readable text, not only counts.
- Quick actions appear after heading in focus order.

### Developer Notes

- Greeting adapts to local time.
- Date uses user locale.
- Summary counts must be derived from the same filters used in sections below.

## 7.2 Today's Tasks

### Purpose

Answer "What should I do today?"

### Priority

Highest operational priority.

### Layout

- Card-like section with header, count, filter control, and task list.
- Rows use checkbox/status, task title, project, priority, due time, assignee when relevant.
- Default height fits 6 rows.

### Displayed Information

- Task title
- Project
- Status
- Priority
- Due time or due today label
- Assignee avatar if team workspace
- Blocked indicator if blocked

### Interactions

- Click row opens task detail in right utility panel or drawer.
- Checkbox marks complete with optimistic update.
- Right-click opens context menu.
- Drag row to reorder daily priority.
- "View all" opens Tasks filtered to Today.

### Empty State

- Title: "No tasks due today."
- Body: "Review upcoming work or create a task for today."
- Actions: "New Task", "View Upcoming"

### Loading State

- Skeleton task rows matching final row height.

### Error State

- Inline Alert: "Today's tasks could not be loaded."
- Action: "Retry"

### Accessibility

- Task list supports keyboard row navigation.
- Completion checkbox has accessible label: "Mark [task name] complete."
- Reorder must have keyboard-accessible alternative.

### Developer Notes

- Query by workspace, user assignment, due date, and visibility.
- Support optimistic complete with rollback on failure.
- Persist manual priority order per user.

## 7.3 Overdue Tasks

### Purpose

Show work that is already late and needs recovery.

### Priority

High when items exist; hidden or collapsed when empty.

### Layout

- Compact alert-like section above or near Today's Tasks.
- Uses danger status subtly.
- Shows up to 3 most urgent overdue items.

### Displayed Information

- Task title
- Days overdue
- Project
- Owner
- Recovery action

### Interactions

- Click opens task detail.
- "Reschedule" opens date popover.
- "View all overdue" opens Tasks filtered to Overdue.

### Empty State

- When empty, do not show a large empty card.
- Optional small success line in AI panel: "No overdue tasks."

### Loading State

- Skeleton rows only if section location is reserved.

### Error State

- Non-blocking warning in section header.

### Accessibility

- Do not rely on red alone. Include text such as "2 days overdue."
- Alert severity should not be announced repeatedly on every refresh.

### Developer Notes

- Sort by due date ascending, then priority descending.
- Hide completed tasks.

## 7.4 Upcoming Deadlines

### Purpose

Answer "What deadlines are approaching?"

### Priority

High.

### Layout

- Timeline or grouped list for the next 7 to 14 days.
- Group by Today, Tomorrow, This Week, Later.
- Compact due-date badges remain monochrome unless risk threshold is met.

### Displayed Information

- Task or milestone title
- Project
- Due date
- Owner
- Completion status
- Risk indicator when deadline confidence is low

### Interactions

- Click opens item.
- Calendar icon opens Calendar filtered to deadline.
- Right-click allows reschedule, assign, mark complete.

### Empty State

- Title: "No upcoming deadlines."
- Body: "Deadlines from active projects will appear here."

### Loading State

- Skeleton grouped rows.

### Error State

- Inline Alert with retry.

### Accessibility

- Dates include full readable labels.
- Timeline is represented as grouped lists for screen readers.

### Developer Notes

- Include tasks, milestones, sprints, and project due dates.
- Default window: 14 days.
- User preference may adjust window.

## 7.5 Recent Projects

### Purpose

Help users resume active work quickly.

### Priority

Medium-high.

### Layout

- Grid or vertical list of project cards.
- Each project card is compact and monochrome.
- Shows up to 4 recent projects.

### Displayed Information

- Project name
- Project key or repository
- Progress percentage
- Open tasks
- Last activity
- Project health

### Interactions

- Click opens project dashboard.
- Star toggles favorite.
- Context menu includes open, pin, archive, copy link.

### Empty State

- Title: "No recent projects."
- Action: "Create Project"

### Loading State

- Skeleton project cards.

### Error State

- Inline Alert with retry.

### Accessibility

- Project cards expose title, progress, and health as readable text.
- Favorite action has independent focus.

### Developer Notes

- Recent projects are calculated from user activity, not only workspace activity.
- Respect project permissions.

## 7.6 Project Progress

### Purpose

Show whether active projects are moving forward.

### Priority

Medium-high.

### Layout

- Widget with horizontal progress rows.
- Avoid colorful charts.
- Use monochrome progress bars with status text.

### Displayed Information

- Project name
- Completion percentage
- Completed tasks vs total tasks
- Blocked count
- Due date
- Health: On track, At risk, Blocked

### Interactions

- Click row opens project.
- Hover reveals details tooltip.
- "View analytics" opens Analytics.

### Empty State

- "Project progress appears when tasks are added to active projects."

### Loading State

- Skeleton progress bars.

### Error State

- "Project progress could not be calculated."

### Accessibility

- Progress bars expose `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and readable label.

### Developer Notes

- Progress calculation: completed tasks divided by non-cancelled tasks.
- Exclude archived projects by default.
- Health logic is defined in Productivity Widgets.

## 7.7 Recent Activity

### Purpose

Answer "What changed since yesterday?"

### Priority

Medium.

### Layout

- Activity feed with timestamped rows.
- Group by relative time: Today, Yesterday, Earlier.
- Rows use avatar, action, object, and timestamp.

### Displayed Information

- Actor
- Action
- Object name
- Project
- Timestamp
- Optional short change detail

### Interactions

- Click row opens source object.
- Filter by project, actor, or type.
- Context menu: copy link, mark as read.

### Empty State

- "No recent activity yet."

### Loading State

- Skeleton activity rows.

### Error State

- Non-blocking Alert with retry.

### Accessibility

- Feed rows are chronological list items.
- Timestamps use accessible full date labels.

### Developer Notes

- Use cursor pagination.
- Virtualize when row count exceeds 50.
- Merge noisy repeated events.

## 7.8 Calendar Widget

### Purpose

Show immediate schedule context without opening the full calendar.

### Priority

Medium.

### Layout

- Compact monthly calendar plus today's agenda.
- On smaller screens, show agenda-only mode.

### Displayed Information

- Current month
- Today indicator
- Deadline markers
- Meeting count
- Upcoming agenda items

### Interactions

- Click date filters dashboard sections to that date.
- Click meeting or deadline opens detail.
- "Open Calendar" navigates to Calendar.

### Empty State

- "No events scheduled."

### Loading State

- Skeleton calendar grid and agenda lines.

### Error State

- "Calendar could not be loaded."

### Accessibility

- Calendar uses grid semantics.
- Date cells have full labels and selected state.

### Developer Notes

- Local timezone is required.
- External calendar integrations should load after dashboard-critical task data.

## 7.9 Quick Actions

### Purpose

Let users create or import important objects without navigating.

### Priority

High as a utility, medium visually.

### Layout

- Compact row or panel near Welcome Section.
- Use icon + text buttons.
- Do not use colorful tiles.

### Displayed Actions

- New Workspace
- New Project
- New Task
- New Note
- Import
- Invite Member

### Interactions

- Click opens creation modal, drawer, or import flow.
- Command/Ctrl + N starts New Task.
- Command Palette exposes every action.

### Empty State

Not applicable.

### Loading State

- Individual action shows loading only when permission or template data is being fetched.

### Error State

- Toast: "Action could not be started."

### Accessibility

- Every action has text label and icon.
- Disabled actions explain permission limits via tooltip.

### Developer Notes

- Hide actions unavailable to the user's role only if they are never relevant.
- Disable temporarily unavailable actions with explanation.

## 7.10 Pinned Items

### Purpose

Give users stable access to personally important tasks, projects, docs, snippets, or API collections.

### Priority

Medium.

### Layout

- Compact list with object-type icons.
- Optional in right utility panel if space is constrained.

### Displayed Information

- Item title
- Object type
- Project or workspace
- Last updated

### Interactions

- Click opens item.
- Drag reorders pins.
- Context menu includes unpin and copy link.

### Empty State

- "Pin tasks, projects, or docs to keep them close."

### Loading State

- Skeleton list rows.

### Error State

- Inline retry.

### Accessibility

- Reordering must support keyboard.
- Object type is included in accessible label.

### Developer Notes

- Pins are user-specific.
- Store order per workspace.

## 7.11 Favorite Projects

### Purpose

Provide fast access to high-value projects independent of recency.

### Priority

Medium.

### Layout

- Compact horizontal or vertical list.
- May share section with Recent Projects if space is limited.

### Displayed Information

- Project name
- Health
- Open task count
- Last activity

### Interactions

- Click opens project.
- Star toggles favorite.
- Drag reorders favorite projects.

### Empty State

- "Favorite projects to keep them visible here."

### Loading State

- Skeleton rows.

### Error State

- Inline retry.

### Accessibility

- Favorite toggle has accessible label.

### Developer Notes

- Favorites are user-specific.
- Do not auto-favorite projects.

## 7.12 AI Daily Summary

### Purpose

Answer "What does AI recommend?" without presenting a chatbot.

### Priority

High in the right utility panel.

### Layout

- Persistent AI panel section.
- Summary appears as concise structured insights.
- No chat input by default.

### Displayed Information

- Summary headline
- 3 to 5 bullet insights
- Risk count
- Recommended next action
- Timestamp of generated summary

### Interactions

- "Refresh summary" regenerates.
- "Explain" opens detail drawer.
- "Create tasks" launches reviewed task generation flow.
- "Generate sprint plan" opens planning modal.

### Empty State

- "AI summary appears after workspace activity is available."
- Action: "Generate Summary"

### Loading State

- Skeleton insight rows.
- Status text: "Analyzing workspace activity"

### Error State

- "AI summary could not be generated."
- Action: "Try Again"

### Accessibility

- AI output is readable structured text.
- Generated content updates are announced politely.

### Developer Notes

- AI summary must cite source objects internally for traceability.
- Do not auto-create tasks without user confirmation.
- Cache daily summary and refresh on demand or after major changes.

## 8. AI Utility Panel

### 8.1 Placement

The AI panel is placed in the right utility panel on standard and large desktop layouts. It collapses behind an AI button in top navigation on small desktop widths.

### 8.2 Behavior

AI behaves like an intelligent productivity assistant:

- Summarizes
- Recommends
- Detects risk
- Predicts deadlines
- Generates structured plans
- Creates draft tasks for review
- Reviews project health

It does not behave like a default open chatbot. Free-form chat may exist inside AI Workspace, not as the primary dashboard panel.

### 8.3 Panel Sections

Daily Summary:

- Concise overview of today's work, changes, and risk.

Today's Recommendations:

- Ranked list of suggested next actions.
- Each recommendation includes reason and source.

Risk Detection:

- Detects blocked tasks, overdue work, workload imbalance, stale projects, and missed updates.

Deadline Prediction:

- Predicts whether active deadlines are likely to be missed.
- Shows confidence as text: High, Medium, Low.

Productivity Insights:

- Summarizes focus patterns, completion trends, and workload pressure.

Generate Sprint Plan:

- Opens a guided plan generation flow.
- Requires project, duration, capacity, and goals.

Generate Tasks:

- Converts notes, project descriptions, or AI recommendations into draft tasks.
- Requires user review before creation.

Summarize Yesterday:

- Produces a short digest of completed tasks, changes, blockers, and carryover.

Review Project:

- Runs a project health review and suggests next actions.

### 8.4 Visibility Rules

- Show AI panel by default on widths `>= 1360px`.
- Collapse on widths below `1360px`.
- Remember user preference per workspace.
- Hide AI actions requiring unavailable permissions.
- If AI is disabled by workspace policy, show a neutral unavailable state with settings link for admins.

### 8.5 Interaction Rules

- AI recommendations are never applied automatically.
- Every generated task, sprint plan, or project update requires review.
- AI panel can be refreshed manually.
- AI panel updates after meaningful workspace events, but should debounce refreshes.
- Show source references in detail views.

## 9. Global Search And Command Palette

### 9.1 Purpose

Search is the fastest way to move through Primordial Task. It must find content and execute commands.

### 9.2 Scope

Search finds:

- Projects
- Tasks
- Workspaces
- Members
- Documentation
- Snippets
- Commands
- Recent results
- Developer tools objects, where available

### 9.3 Entry Points

- Top navigation search field
- Command/Ctrl + K
- Command Palette
- Recent search suggestions

### 9.4 Search Behavior

Default empty state:

- Shows recent results
- Shows common commands
- Shows quick create actions

While typing:

- Results update after `150ms` debounce.
- Local cached results appear first.
- Remote results stream in progressively.

Result grouping:

- Top Hits
- Tasks
- Projects
- Docs
- Snippets
- Members
- Commands

Ranking:

- Exact title matches
- Recently opened objects
- Assigned or owned objects
- Active project objects
- Workspace-wide matches

### 9.5 Command Palette

Command Palette dimensions:

- Width: `640px`
- Max height: `70vh`
- Row height: `44px`

Interactions:

- Arrow keys navigate.
- Enter opens or runs selected result.
- Command/Ctrl + Enter opens in new window or secondary panel where supported.
- Escape closes.
- Tab can move into result actions only when action controls are visible.

Accessibility:

- Use combobox/listbox behavior.
- Announce result count changes.
- Selected result is programmatically identified.

Developer Notes:

- Search index should combine local cache with server query.
- Commands should be permission-aware.
- Never expose unauthorized workspace content in search results.

## 10. Quick Creation Panel

### 10.1 Purpose

Quick creation reduces friction for common setup and capture actions.

### 10.2 Actions

New Workspace:

- For users managing multiple teams or clients.
- Opens workspace creation flow if permitted.

New Project:

- Starts a new organized work area.
- Should request name, key, owner, and optional template.

New Task:

- Captures work quickly.
- Minimum fields: title, project, assignee, due date.

New Note:

- Captures free-form planning or meeting notes.
- Can later convert selected text into tasks.

Import:

- Supports importing tasks, project files, issue tracker data, snippets, or API collections.

Invite Member:

- Adds teammates to the current workspace.
- Requires role selection.

### 10.3 Layout

- Opens as popover or drawer from top navigation.
- Width: `360px` to `420px`.
- Actions are list rows with icon, title, and short description.
- No colorful tiles.

### 10.4 Interaction

- Click action opens focused modal or drawer.
- Keyboard shortcuts appear aligned right.
- Disabled actions show tooltip with permission reason.

### 10.5 Developer Notes

- Load templates lazily after panel opens.
- Preserve partially entered quick task content if panel closes accidentally.
- Route import flows to dedicated screens when complex.

## 11. Productivity Widgets

### 11.1 Task Completion

Purpose:

- Shows completion momentum for selected period.

Displayed data:

- Completed tasks
- Total due tasks
- Completion percentage
- Comparison to previous period

Calculation:

- `completed_due_tasks / total_due_tasks`
- Exclude cancelled tasks.
- Include tasks due in selected date range.

### 11.2 Focus Time

Purpose:

- Shows protected work time and deep-work consistency.

Displayed data:

- Total focus time
- Sessions completed
- Average session length

Calculation:

- Sum completed focus sessions from local timer or calendar integrations.
- If no integration exists, show setup state.

### 11.3 Weekly Progress

Purpose:

- Shows progress trend across the week.

Displayed data:

- Completed tasks per day
- Planned vs completed
- Carryover count

Calculation:

- Group task completion by local day.
- Compare completed count to planned due count.

### 11.4 Project Health

Purpose:

- Summarizes whether projects are on track.

Displayed data:

- On track count
- At risk count
- Blocked count
- Stale count

Calculation:

- On track: progress meets expected pace and no major blockers.
- At risk: deadline within risk window and completion pace is low.
- Blocked: one or more blocking dependencies prevent critical path progress.
- Stale: no meaningful activity for configured threshold.

### 11.5 Upcoming Meetings

Purpose:

- Connects task planning with calendar reality.

Displayed data:

- Next meetings
- Time
- Related project
- Meeting notes link, if available

Calculation:

- Pull from connected calendars.
- Match meetings to projects by explicit link, title, participants, or user association.

### 11.6 Workload

Purpose:

- Shows whether work is distributed realistically.

Displayed data:

- Tasks by assignee
- Due this week
- Overdue by assignee
- Capacity warning

Calculation:

- Count open tasks due in period by assignee.
- Weight priority and estimated effort when available.

### 11.7 Productivity Score

Purpose:

- Provides a compact signal of workspace execution health.

Displayed data:

- Score from 0 to 100
- Trend
- Contributing factors

Calculation:

- Completion rate: 35 percent
- Overdue ratio: 25 percent
- Project health: 20 percent
- Focus consistency: 10 percent
- Activity freshness: 10 percent

Design rule:

- Present as a sober operational score, not gamification.
- Always show contributing factors so users can understand the number.

## 12. Interaction Design

### 12.1 Hover

- Rows and cards use `state.hover`.
- Hover reveals secondary actions only when they do not cause layout shift.
- Tooltips appear after 500ms for icon-only controls.

### 12.2 Focus

- Focus ring uses `state.focus`.
- Focus order begins at sidebar, then top navigation, then main content, then right utility panel.
- Skip links should allow direct jump to main dashboard content.

### 12.3 Click

- Single click selects or opens depending on component convention.
- Primary content rows open details.
- Checkboxes and inline buttons do not trigger row open.

### 12.4 Drag

- Drag supports task priority reorder, pinned item reorder, and favorite project reorder.
- Drag handles appear on hover or focus.
- Keyboard reorder is required.

### 12.5 Expand And Collapse

- Sidebar can collapse.
- AI panel can collapse.
- Dashboard sections may collapse if user customizes dashboard.
- Collapsed state is remembered per user and workspace.

### 12.6 Loading

- Load the dashboard progressively.
- Welcome Section and Today's Tasks load first.
- AI and analytics widgets load after critical task and project data.

### 12.7 Refreshing

- Manual refresh is available in top navigation or command palette.
- Pull-to-refresh is not a desktop pattern and should not be used.
- Refresh does not clear visible data unless data becomes invalid.

### 12.8 Keyboard Navigation

Required shortcuts:

- Command/Ctrl + K: Open Command Palette
- Command/Ctrl + N: New Task
- Command/Ctrl + Shift + N: Quick Create
- G then D: Go to Dashboard
- G then P: Go to Projects
- G then T: Go to Tasks
- G then C: Go to Calendar
- Escape: Close active overlay
- Enter: Activate selected item

### 12.9 Context Menu And Right Click

Context menus are available for:

- Tasks
- Projects
- Pinned items
- Activity rows
- Calendar items

Common actions:

- Open
- Copy link
- Pin or unpin
- Assign
- Change status
- Reschedule
- Archive

Destructive actions must be separated by a divider and require confirmation when irreversible.

### 12.10 Command Palette

The Command Palette mirrors visible actions and exposes hidden power-user workflows. Any dashboard action available by mouse should be discoverable by command.

## 13. Responsiveness

### 13.1 Desktop

Default target:

- Width: `1280px` to `1600px`
- Sidebar expanded
- AI panel visible
- Main dashboard uses two content columns plus utility panel

### 13.2 Small Desktop

Range:

- `1024px` to `1279px`

Behavior:

- Sidebar may remain expanded if space allows.
- AI panel collapses behind top navigation button.
- Main content becomes two columns or one column depending on density.
- Calendar and productivity widgets move lower in the page.

### 13.3 Large Desktop

Range:

- `1600px` to `1919px`

Behavior:

- Content can expand to max width `1600px`.
- Preserve readable column widths.
- Do not stretch cards into low-density empty panels.

### 13.4 Ultra-Wide Monitor

Range:

- `1920px+`

Behavior:

- Keep dashboard content max width around `1600px`.
- Allow optional pinned right utility panel and secondary inspector.
- Use remaining width as calm background space or optional secondary detail panel.
- Never stretch lists so far that scanning becomes difficult.

## 14. Accessibility

### 14.1 Keyboard

- All controls must be reachable by keyboard.
- Dashboard sections must have headings.
- Lists and grids must support predictable arrow navigation where appropriate.
- Context menu must be available by keyboard.

### 14.2 Focus Order

Default order:

1. Sidebar navigation
2. Top navigation utilities
3. Welcome Section quick actions
4. Today's Tasks
5. Overdue Tasks
6. Upcoming Deadlines
7. Project widgets
8. Activity feed
9. Calendar and productivity widgets
10. AI Utility Panel

### 14.3 Screen Reader Support

- Use semantic landmarks for navigation, main, complementary panel, and content sections.
- Use lists for task and activity feeds.
- Use tables only for true tabular data.
- Progress values must include readable labels.
- AI-generated changes are announced politely.

### 14.4 Contrast

- Meet WCAG AA contrast for text and controls.
- Status color is never the only signal.
- High contrast mode increases borders, focus rings, and text contrast without changing layout.

### 14.5 Reduced Motion

- Disable skeleton shimmer.
- Remove slide transitions.
- Preserve instant state changes and focus visibility.

## 15. Performance Specification

### 15.1 Loading Priority

Priority 1:

- Shell
- Sidebar
- Top navigation
- Welcome Section
- Today's Tasks
- Overdue Tasks

Priority 2:

- Upcoming Deadlines
- Recent Projects
- Project Progress
- Recent Activity

Priority 3:

- Calendar Widget
- Productivity Widgets
- AI Daily Summary
- AI Recommendations

### 15.2 Lazy Loading

- Load AI panel after essential dashboard data.
- Load analytics widgets after tasks and projects.
- Load external calendar integrations after internal deadlines.
- Load hidden collapsed sections only when expanded.

### 15.3 Virtualized Lists

Use virtualization for:

- Activity feeds over 50 rows
- Task lists over 100 rows
- Search results over 100 rows
- Workspace-wide command results when streaming

### 15.4 Widget Refresh Strategy

- Critical task counts refresh on foreground and relevant mutations.
- Activity feed refreshes in background with quiet unread indicator.
- AI summary refreshes manually, daily, or after meaningful workspace changes.
- Productivity widgets refresh every 5 to 15 minutes depending on data cost.
- Calendar refresh follows integration sync cadence.

### 15.5 Caching

- Cache dashboard shell and last successful data.
- Show stale data with subtle timestamp if refresh fails.
- Use optimistic updates for task completion and pinned item reorder.
- Reconcile optimistic changes with server result.

### 15.6 Skeleton Loading

- Skeletons must match final layout dimensions.
- Avoid full-page spinners after shell is visible.
- Use section-level loading so ready content can be used immediately.

## 16. Developer Notes

### 16.1 Data Contracts

Dashboard data should be fetched as composable resources:

- User workspace context
- Task summary
- Today's task list
- Overdue task list
- Deadline list
- Project summary
- Activity feed
- Calendar summary
- Productivity metrics
- AI summary

Avoid a single blocking dashboard payload. The dashboard should render progressively.

### 16.2 Permissions

Every section must respect:

- Workspace role
- Project membership
- Private tasks
- Integration availability
- AI policy
- Billing or plan limits

Unavailable content should either be hidden or shown with a clear permission state, depending on whether the user can request access.

### 16.3 State Persistence

Persist per user and workspace:

- Sidebar collapsed state
- AI panel visibility
- Dashboard section order, if customization exists
- Pinned items
- Favorite projects
- Last selected workspace
- Last dashboard date filter

### 16.4 Failure Handling

Dashboard failures should be isolated:

- A failed AI summary does not block tasks.
- A failed calendar integration does not block deadlines.
- A failed activity feed does not block project progress.
- Global outage can show app-level Alert with cached data retained.

## 17. Quality Bar

The dashboard is complete when:

- It answers today's priorities, active projects, progress, deadlines, activity, and AI recommendations within seconds.
- It follows Phase 01 visual language without decorative color or gradients.
- Sidebar, top navigation, main content, and right utility panel are fully specified.
- Every required dashboard section includes purpose, priority, layout, displayed information, interactions, empty state, loading state, error state, accessibility, and developer notes.
- AI behaves as a productivity assistant, not a default chatbot.
- Global search and command palette find content and actions across the workspace.
- Quick actions support high-frequency creation workflows.
- Productivity widgets have clear calculation logic.
- Desktop, small desktop, large desktop, and ultra-wide behavior are defined.
- Accessibility and performance requirements are explicit enough for production implementation.

