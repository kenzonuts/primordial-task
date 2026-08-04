# Primordial Task Project Management Specification

Version: 1.0  
Phase: 05  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 03 Dashboard Experience](./DASHBOARD_EXPERIENCE.md), [Phase 04 Workspace Management](./WORKSPACE_MANAGEMENT.md)  

## 1. Product Intent

Projects are the primary organizational units inside a workspace. Every task, calendar event, note, file, discussion, time entry, documentation page, Git repository, AI context, and analytics signal can belong to a project.

Project management should make each project feel like a focused workspace with its own health, progress, members, deadlines, activity, and modules.

## 2. Design Principles

- Follow Phase 01 design language.
- Prioritize clarity over decoration.
- Treat projects as operational environments, not decorative cards.
- Show progress, risk, workload, and deadlines without noisy charts.
- Keep creation fast and configuration flexible.
- Make project status and health understandable at a glance.

## 3. Core User Goals

Users must be able to:

- Create, duplicate, archive, delete, favorite, pin, and open projects.
- Manage members and project settings.
- Track progress, milestones, deadlines, workload, and activity.
- Move between project modules: Tasks, Kanban, Calendar, Notes, Files, Documentation, Analytics.

## 4. User Flow

```text
Workspace
  -> Projects
  -> Project Explorer
  -> Select Project
  -> Project Overview
  -> Project Modules
  -> Project Settings
```

Transitions:

- Workspace navigation opens Project Explorer.
- Selecting a project opens Project Overview.
- Module tabs preserve project context.
- Project Settings returns to Overview or Explorer.
- Archived projects remain accessible through an archive filter.

## 5. Project Explorer

### Purpose

Display every project inside the active workspace and support fast discovery, creation, and recovery.

### Layout

- Application shell with sidebar and top navigation.
- Header includes title, workspace context, search, filter, sort, and Quick Create.
- View switcher toggles Grid View and List View.
- Recent Projects and Pinned Projects can appear above all projects when populated.

### Components

- Search Bar
- Tabs or segmented control for active/archived
- View switcher
- Filter popover
- Sort Select
- Project Card
- Project row
- Button: Create Project
- Skeleton cards/rows
- Alert

### Displayed Information

- Project name
- Icon
- Description excerpt
- Status
- Health
- Progress
- Favorite state
- Pinned state
- Owner
- Members
- Due date
- Last activity

### Interaction

- Click opens project.
- Star toggles favorite.
- Pin action pins project.
- Right-click opens context menu.
- Drag reorders pinned projects only.
- Search filters by name, description, member, tags, and status.
- Sort supports Recently Updated, Name, Status, Health, Progress, Due Date, Owner.

### Validation

- User must have project read access.
- Duplicate names can be allowed if project keys remain unique; otherwise validate uniqueness.
- Archived projects cannot be edited until restored unless policy allows.

### Empty State

No projects:

- Title: "No projects yet."
- Body: "Create a project to organize tasks, docs, deadlines, and team activity."
- Action: "Create Project"

No search results:

- "No projects match your filters."

### Loading State

- Grid skeleton or list skeleton matching active view.

### Error State

- Alert: "Projects could not be loaded."
- Action: Retry.

### Accessibility

- Grid and list support keyboard navigation.
- Cards expose project name, status, health, and progress.
- View switcher has clear selected state.

### Developer Notes

- Fetch active and archived projects separately.
- Use cursor pagination for large workspaces.
- Respect workspace and project permissions.

### UX Reasoning

The explorer must support both visual scanning and dense project management. Grid view helps recognition; list view supports operations.

## 6. Create Project

### Purpose

Create a project with enough structure to begin work immediately.

### Layout

- Modal or drawer from Project Explorer or Quick Create.
- Width: `560px` to `720px` depending on template complexity.
- Sections: Identity, Schedule, Ownership, Template, Defaults.

### Components

- Input: Project Name
- Icon picker
- Color selector limited to neutral/status usage
- Textarea: Description
- Select: Workspace
- Radio: Visibility
- Date pickers: Start Date, Due Date
- Select: Owner
- Member picker
- Template selector
- Select: Default Status
- Button: Create Project
- Alert

### Fields

- Project Name: required, 2 to 120 characters.
- Project Icon: optional, initials fallback.
- Project Color: optional metadata only; do not use color-heavy UI.
- Description: optional, 500 character guidance limit.
- Workspace: required.
- Visibility: Workspace, Private, Team, Public if policy permits.
- Start Date and Due Date: optional, due date cannot precede start date.
- Owner: required.
- Members: optional.
- Template Selection: optional.
- Default Status: Planning or Active.

### Interaction

- Template selection previews included modules and default statuses.
- Cancel with dirty fields opens discard confirmation.
- Success routes to Project Overview.

### Validation

- Required fields validate inline.
- Date conflict shows inline error.
- Visibility and owner options are permission-aware.

### Success State

- Toast: "Project created."
- Route to Project Overview.

### Accessibility

- Form has one heading and visible labels.
- Date inputs are keyboard accessible.
- Template cards expose included modules as text.

### Developer Notes

- Project creation initializes modules, default statuses, activity log, and AI context.
- Server assigns immutable project ID and optional project key.

### UX Reasoning

Creation should capture project intent without forcing complete setup. Templates reduce repeated configuration for teams.

## 7. Project Overview

### Purpose

Show project state, health, progress, members, deadlines, activity, and next actions.

### Layout

- Project header with banner area, name, description, status, health, favorite/pin, and actions.
- Module navigation below header.
- Content grid: progress, milestones, task summary, calendar summary, members, files, activity, AI insights.

### Components

- Header
- Badge
- Progress Bar
- Cards/widgets
- Avatar group
- Activity feed
- Quick Actions
- AI insight panel

### Displayed Information

- Project banner
- Project name and description
- Project progress
- Project status
- Health indicator
- Milestones
- Tasks summary
- Calendar summary
- Recent activity
- Files
- Members
- AI insights

### Interaction

- Status can be changed by permitted users.
- Progress rows open related tasks.
- Milestones open milestone detail.
- Quick actions: New Task, Open Kanban, Open Calendar, Invite Members, Review Project.

### Validation

- Status transitions follow the project status system.
- Restricted modules appear only when enabled and permitted.

### Empty State

- New project shows setup checklist: Add tasks, Invite members, Set due date, Open Kanban.

### Loading State

- Header loads first.
- Widgets load independently.

### Error State

- Section-level alerts.
- Project not found routes to Explorer.

### Accessibility

- Project name is `h1`.
- Progress values include text and ARIA values.
- Module navigation uses tabs or navigation landmarks.

### Developer Notes

- Fetch overview as composable resources.
- AI insights should load after project task and activity summaries.

### UX Reasoning

Overview is the project command center. It should make the next best action obvious without forcing users into a report.

## 8. Project Members

### Purpose

Manage project-level access and responsibility.

### Layout

- Table with search, filter, sort, invite, and bulk actions.

### Components

- Table
- Avatar
- Role Select
- Permission Badge
- Online Status
- Context Menu
- Confirmation Modal

### Displayed Information

- Avatar
- Name
- Email
- Role
- Permission
- Online status
- Recent activity

### Interaction

- Invite member.
- Remove member.
- Transfer ownership.
- Change role.
- Search, filter, sort.
- Bulk actions for role changes and removal.

### Validation

- Project owner cannot be removed until ownership transfers.
- Role cannot exceed workspace role authority.
- Guests may be limited by workspace policy.

### Accessibility

- Table semantics.
- Role changes announce success or failure.

### Developer Notes

- Project permissions inherit from workspace unless overridden.
- Audit membership changes.

### UX Reasoning

Project membership needs precision and accountability. Tables are appropriate for administrative workflows.

## 9. Project Activity

### Purpose

Show what changed inside a project.

### Layout

- Timeline feed with filters, search, and pagination.

### Components

- Activity list
- Avatar
- Filter controls
- Search
- Pagination or infinite scroll
- Skeleton rows

### Displayed Information

- Task updates
- Comments
- File uploads
- Status changes
- Member activity
- System events
- Timestamps

### Interaction

- Click activity opens source object.
- Filter by type, actor, date.
- Search activity descriptions.
- Context menu supports copy link.

### Validation

- Only show activities user can access.

### Accessibility

- Timeline is a list with readable timestamps.
- Filters are keyboard accessible.

### Developer Notes

- Cursor paginate.
- Merge noisy repeated events.
- Virtualize large feeds.

### UX Reasoning

Activity is a trust surface. Users need to understand changes without being overwhelmed.

## 10. Project Settings

### Purpose

Configure project identity, visibility, ownership, modules, integrations, exports, and lifecycle.

### Layout

- Settings navigation on left, content pane on right.
- Sections: General, Members, Permissions, Integrations, Export, Danger Zone.

### Components

- Inputs
- Textarea
- Select
- Switch
- Buttons
- Alerts
- Confirmation modals

### Settings

General:

- Project Name
- Icon
- Color metadata
- Description
- Project Owner
- Visibility

Members and Permissions:

- Project access
- Guest access
- Role overrides

Lifecycle:

- Archive
- Duplicate
- Delete
- Export

Integrations:

- Git repository
- Calendar
- Documentation
- API collection
- Database
- Snippets
- AI context

Danger Zone:

- Archive
- Delete
- Transfer ownership

### Interaction

- Routine settings save inline.
- Destructive actions require confirmation.
- Duplicate opens project duplication flow.

### Validation

- Name required.
- Owner required.
- Delete requires explicit confirmation.
- Archive blocked if policy requires resolving open critical tasks.

### Accessibility

- Clear settings navigation.
- Dangerous actions include explicit consequences.

### Developer Notes

- Audit every settings mutation.
- Exports run asynchronously.
- Deletion may be soft-delete first.

### UX Reasoning

Settings should separate everyday configuration from irreversible actions.

## 11. Project Status System

Statuses:

- Planning
- Active
- On Hold
- Review
- Completed
- Archived
- Cancelled

Transition rules:

- Planning -> Active, On Hold, Cancelled
- Active -> On Hold, Review, Completed, Cancelled
- On Hold -> Active, Cancelled
- Review -> Active, Completed, On Hold
- Completed -> Archived, Active if reopened
- Archived -> Active only after restore
- Cancelled -> Archived or Active if reopened by permitted user

Validation:

- Archived projects are read-only by default.
- Completed requires all required milestones complete unless override is permitted.
- Cancelled requires reason.

## 12. Project Health

Health states:

- Excellent
- Good
- Warning
- Critical

Calculation factors:

- Task completion pace
- Overdue tasks
- Blocked tasks
- Upcoming deadlines
- Workload balance
- Member activity
- AI analysis

Suggested scoring:

- Completion pace: 30 percent
- Overdue ratio: 20 percent
- Blocked critical work: 20 percent
- Deadline risk: 15 percent
- Activity freshness: 10 percent
- Workload balance: 5 percent

Visual hierarchy:

- Use text labels always.
- Use status color only for Warning and Critical indicators.

## 13. Project Progress

Displayed progress:

- Overall completion
- Milestone completion
- Completed tasks
- Remaining tasks
- Timeline progress
- Estimated completion

Calculation:

- Overall completion = completed non-cancelled tasks divided by total non-cancelled tasks.
- Milestones can weight progress if project uses milestones.
- Estimated completion uses current completion velocity and remaining estimated effort.
- Manual override requires audit trail.

## 14. Search Experience

Search by:

- Project name
- Description
- Member
- Status
- Tags
- Recent
- Favorites
- Archived

Shortcut:

- Command/Ctrl + K for global search.
- Project Explorer search field for local search.

Behavior:

- Cached matches appear first.
- Remote results load progressively.
- Archived results appear only when included.

Accessibility:

- Announce result count.
- Maintain keyboard focus after filtering.

## 15. Filters

Filters:

- Status
- Owner
- Members
- Tags
- Priority
- Health
- Progress
- Date
- Recently Updated
- Favorites
- Archived
- Saved Filters

Behavior:

- Filters combine with AND logic across categories and OR logic within a category.
- Active filters appear as removable chips.
- Saved filters are user-specific unless shared by workspace policy.

## 16. Quick Actions

Actions:

- Create Project
- Duplicate
- Archive
- Favorite
- Open Kanban
- Open Calendar
- Open Documentation
- Invite Members
- Export

Visibility:

- Permission-aware.
- Destructive or restricted actions hidden or disabled with explanation.

## 17. Empty States

- No Projects: prompt Create Project.
- No Search Results: suggest clearing filters.
- No Favorites: explain starring projects.
- No Archived Projects: no large visual treatment.
- No Activity: activity appears after updates.
- No Members: invite members or explain inherited workspace access.

## 18. Error States

- Project Not Found: route to Explorer.
- Permission Denied: explain access limitation.
- Duplicate Name: inline validation or warning depending policy.
- Synchronization Failed: keep cached state and retry.
- Project Deleted: route to Explorer.
- Archive Failed: show reason and recovery.
- Validation Error: inline field errors.

## 19. Loading States

- Project Loading: header and widget skeletons.
- Member Loading: table skeleton.
- Activity Loading: feed skeleton.
- Settings Loading: section skeletons.
- Progress Loading: progress bar skeletons.

## 20. Responsiveness

Desktop:

- Sidebar, top navigation, two-column project overview.

Small Desktop:

- Collapse secondary panels and stack widgets.

Large Desktop:

- Maintain max readable content width.

Ultra-wide:

- Optional inspector panel; do not over-stretch content.

## 21. Accessibility

- Keyboard navigation across Explorer, modules, tables, and settings.
- Focus order follows shell, header, main content, right panel.
- Screen readers receive status, health, progress, and timestamps as text.
- High contrast mode strengthens borders and focus rings.
- Reduced motion disables non-essential transitions.
- ARIA roles for tabs, tables, dialogs, alerts, and progress.

## 22. Performance

- Load project identity first.
- Cache recent and favorite projects.
- Infinite scroll large project lists.
- Virtualize activity feeds.
- Use optimistic updates for favorite, pin, and safe status changes.
- Refresh project summaries in background.
- Synchronize module data independently.

## 23. Security

- Enforce workspace isolation.
- Validate permissions and roles server-side.
- Audit settings, membership, exports, archival, deletion, and ownership changes.
- Protect private project data from search and AI context leakage.

## 24. Integrations

Tasks:

- Projects contain tasks and task summaries.

Kanban:

- Project status workflows can power boards.

Calendar:

- Project deadlines, milestones, and task dates appear in calendar.

Notes and Documentation:

- Project knowledge and planning content.

Files:

- Project attachments and shared assets.

Time Tracking:

- Time entries aggregate to project analytics.

Git Integration:

- Repositories, branches, commits, and pull requests link to projects and tasks.

Database Manager:

- Project-scoped database connections and queries.

API Collection:

- Project-scoped API requests and environments.

Snippet Manager:

- Project-specific reusable code snippets.

AI Assistant:

- Summaries, risk detection, task generation, and project review.

Analytics:

- Project progress, velocity, health, and workload.

Notifications:

- Project mentions, assignments, status changes, and deadline alerts.

## 25. Quality Bar

Project management is complete when users can create, find, open, understand, operate, configure, and retire projects with clear state, accessible controls, permission safety, and consistent Phase 01 visual language.

