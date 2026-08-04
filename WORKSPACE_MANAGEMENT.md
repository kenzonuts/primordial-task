# Primordial Task Workspace Management Specification

Version: 1.0  
Phase: 04  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 02 Authentication Experience](./AUTHENTICATION_EXPERIENCE.md), [Phase 03 Dashboard Experience](./DASHBOARD_EXPERIENCE.md)  

## 1. Product Intent

Workspace is the highest-level container in Primordial Task. Every project, task, member, note, calendar item, permission rule, integration, developer tool, and AI context belongs to a workspace.

Workspace management must feel like managing a professional desktop operating system environment. Users should always understand which workspace is active, who belongs to it, what they can do, and how to move between workspaces without losing context.

## 2. Design Principles

- Follow Phase 01 dark monochrome design language.
- Keep workspace identity visible but quiet.
- Use large spacing and clear hierarchy for management screens.
- Treat destructive operations as serious system actions.
- Prefer predictable desktop patterns over web-dashboard novelty.
- Show permission boundaries clearly without making the product feel locked down.

## 3. Core User Goals

Users must be able to:

- Create a workspace.
- Switch between workspaces.
- Rename, archive, delete, leave, or transfer ownership of a workspace.
- Invite members.
- Manage roles and permissions.
- Understand projects, members, storage, activity, and AI context at the workspace level.
- Manage workspace settings and exports.

## 4. User Flow

```text
Launch Application
  -> Workspace Detection
  -> Workspace Selector
  -> Workspace Dashboard
  -> Workspace Settings
  -> Projects
  -> Members
  -> Permissions
  -> Dashboard
```

Transitions:

- Workspace Detection decides whether the user has zero, one, or multiple workspaces.
- Zero workspaces routes to Create Workspace.
- One workspace routes to Dashboard unless the user explicitly opens Workspace Selector.
- Multiple workspaces route to Workspace Selector after authentication.
- Workspace Settings, Projects, Members, and Permissions return to Dashboard without changing the active workspace unless the user switches it.

## 5. Information Architecture

Workspace surfaces:

- Workspace Selector
- Create Workspace
- Workspace Overview
- Workspace Members
- Invite Members
- Workspace Permissions
- Workspace Settings

Global access points:

- Authentication Workspace Selection
- Sidebar Workspace Switcher
- Command Palette
- Top Navigation workspace menu
- Settings

## 6. Workspace Selector

### Purpose

Display all workspaces available to the user and support fast switching.

### Layout

- Full-window content area inside the application shell when authenticated.
- Centered max-width container: `1040px`.
- Header contains title, search, sort, filter, and Create Workspace.
- Workspace grid uses 3 columns on large desktop, 2 on small desktop, 1 on tablet.
- Card min width: `300px`.

### Components

- Search Bar
- Select for sort
- Filter popover
- Workspace Card
- Avatar or workspace logo
- Badge for role
- Button: Create Workspace
- Skeleton cards
- Alert for load errors

### Displayed Information

- Workspace logo or initials
- Workspace name
- User role
- Member count
- Recent activity summary
- Last opened timestamp
- Favorite state
- Pinned state, when applicable

### Interaction

- Click card selects workspace.
- Double-click card opens workspace.
- Enter opens focused workspace.
- Star toggles favorite.
- Context menu supports open, favorite, pin, settings, leave workspace.
- Search filters immediately after a short debounce.
- Sort supports Last Opened, Name, Recent Activity, Role, Favorites.
- Filter supports Favorites, Owned by Me, Recently Opened, Role.

### Validation

- User must have active membership to open a workspace.
- Archived workspaces appear only when the archived filter is enabled.
- Deleted workspaces never appear except in audit or recovery tools.

### Empty State

No workspace:

- Title: "No workspaces yet."
- Body: "Create a workspace to organize projects, tasks, members, and AI context."
- Primary action: "Create Workspace"

No search results:

- Title: "No matching workspaces."
- Body: "Try a different name, member, or filter."
- Action: "Clear Search"

### Loading State

- Skeleton cards matching final card dimensions.
- Search and Create Workspace remain visible once permissions are known.

### Error State

- Alert: "Workspaces could not be loaded."
- Actions: Retry, Sign Out.
- Preserve cached workspaces when available and mark them as stale.

### Accessibility

- Workspace grid uses listbox or radiogroup behavior when selection is required.
- Cards expose name, role, member count, and last opened in accessible text.
- Favorite button has independent label.
- Keyboard users can search, filter, sort, and open workspaces.

### Developer Notes

- Cache last successful workspace list.
- Sort favorites above non-favorites only when user selects Favorites sort.
- Never expose workspaces where membership is revoked.

### UX Reasoning

The selector is a decision screen. It should show enough context to choose quickly without becoming a workspace analytics dashboard.

## 7. Create Workspace

### Purpose

Allow users to create a new highest-level container.

### Layout

- Centered form card or modal depending on entry point.
- Recommended width: `520px`.
- Form sections: Identity, Visibility, Defaults, Review.
- Primary action fixed at bottom of modal if content scrolls.

### Components

- Input: Workspace Name
- Avatar/Icon picker
- Textarea: Description
- Radio group: Visibility
- Select: Time Zone
- Select: Language
- Select: Default View
- Checkbox group for default settings
- Button: Create Workspace
- Button: Cancel
- Alert for validation and server errors

### Fields

Workspace Name:

- Required.
- 2 to 80 characters.
- Must be unique for the current user account context where required by backend policy.

Workspace Icon:

- Optional.
- Initials fallback generated from workspace name.

Workspace Description:

- Optional.
- Maximum 280 characters.

Visibility:

- Private: Invite-only, no discovery.
- Team: Visible to approved organization members.
- Public: Discoverable where product policy allows.

Default Settings:

- Default project visibility.
- Default member role.
- Default dashboard view.
- Time zone.
- Language.

### Interaction

- Create button submits form.
- Cancel returns to previous screen.
- If dirty, Cancel opens confirmation modal.
- Visibility choice updates helper text.
- Icon preview updates as name changes.

### Validation

- Inline validation for required and invalid fields.
- Server validation is authoritative.
- Public visibility may be disabled by plan or policy.

### Success State

- Toast: "Workspace created."
- Route to new Workspace Overview or Dashboard.
- If created during auth onboarding, continue to Dashboard.

### Cancel Flow

- Empty form cancels immediately.
- Dirty form asks: "Discard workspace setup?"

### Accessibility

- Every field has visible label.
- Radio choices include descriptions.
- Confirmation modal traps focus and restores focus on close.

### Developer Notes

- Create workspace atomically with owner membership.
- Initialize default roles, settings, audit log, and AI policy.
- Workspace creation should not depend on optional integrations.

### UX Reasoning

Workspace creation should feel significant but not bureaucratic. Only identity and visibility are essential; defaults can be changed later.

## 8. Workspace Overview

### Purpose

Provide an executive-level summary of the active workspace.

### Layout

- Dashboard-style overview inside the application shell.
- Header: workspace logo, name, description, role, quick actions.
- Content grid: Projects Overview, Members Overview, Recent Activity, Storage Usage, Statistics, Pinned Projects, AI Summary.
- Right utility area may show AI Summary or workspace health.

### Components

- Header block
- Cards and widgets
- Progress Bar
- Avatar group
- Recent Activity list
- Quick Actions
- Alert
- Skeletons

### Displayed Information

- Workspace name and description
- User role and permission summary
- Active project count
- Member count by role
- Recent activity
- Storage usage
- Workspace statistics
- Pinned projects
- AI summary

### Interaction

- Quick actions: Create Project, Invite Member, Open Settings, Switch Workspace.
- Click project summary opens Projects.
- Click member summary opens Members.
- Click storage opens Settings > Storage.
- AI summary opens AI Workspace detail.

### Validation

- Only show actions permitted by role.
- Storage usage requires workspace-level read permission.

### Empty State

No projects:

- "Create the first project for this workspace."

No activity:

- "Workspace activity will appear after members create or update work."

### Loading State

- Load header first.
- Widgets load independently with skeletons.

### Error State

- Section-level errors do not block the whole overview.
- Workspace not found routes to Workspace Selector with Alert.

### Accessibility

- Header uses a clear `h1`.
- Widgets have section headings.
- Progress and statistics expose readable labels.

### Developer Notes

- Fetch overview data as separate resources.
- AI summary loads after core workspace data.
- Use cached overview while refreshing.

### UX Reasoning

The overview helps owners and contributors understand workspace state without diving into projects immediately.

## 9. Workspace Members

### Purpose

Manage people, roles, status, access, and membership lifecycle.

### Layout

- Table-first management screen.
- Header includes member count, search, filter, sort, and Invite Member.
- Bulk action toolbar appears when rows are selected.

### Components

- Table
- Avatar
- Badge
- Search Bar
- Filter popover
- Select for role
- Context Menu
- Modal for removal and role changes

### Displayed Information

- Avatar
- Name
- Email
- Role: Owner, Admin, Manager, Member, Guest
- Status: Active, Invited, Suspended, Removed
- Last active
- Recent activity

### Interaction

- Search by name or email.
- Filter by role, status, last active.
- Sort by name, role, status, last active.
- Change role inline when permitted.
- Remove member opens confirmation.
- Bulk actions support role change, remove, resend invite, export list.

### Validation

- Owner cannot remove themselves without transferring ownership.
- At least one Owner must remain.
- Role changes require Manage Members permission.
- Guests cannot be promoted beyond policy limits if external access is restricted.

### Accessibility

- Member table uses table semantics.
- Role controls include current value.
- Confirmation dialogs explain consequences.

### Developer Notes

- Paginate members after 50 rows.
- Role changes require server-side permission validation.
- Write every membership change to audit log.

### UX Reasoning

Member management is operational and sensitive. A table provides scanability, precision, and bulk workflows without visual clutter.

## 10. Invite Members

### Purpose

Invite individuals or groups into the workspace.

### Layout

- Modal or drawer launched from Members or Quick Actions.
- Sections: Email Invitation, Share Link, Pending Invitations.

### Components

- Tokenized email input
- Select: role
- Textarea: optional message
- Button: Send Invites
- Copy Invite Link button
- Pending invitations table
- Toast
- Alert

### Interaction

- Add multiple email addresses.
- Validate emails as tokens.
- Send invitations.
- Copy invite link.
- Resend or cancel pending invitations.
- Set expiration for share links where allowed.

### Validation

- Valid email required.
- Duplicate emails are merged.
- Cannot invite above user's role authority.
- Share links may be disabled by workspace security settings.

### Accessibility

- Tokenized email field must support keyboard deletion and editing.
- Pending invitation actions have accessible labels.

### Developer Notes

- Invitations should be single-use unless configured otherwise.
- Track expiration, sender, role, and acceptance state.
- Never reveal private workspace data before invitation acceptance.

### UX Reasoning

Inviting members should be fast for teams, but security controls must be visible before access is granted.

## 11. Workspace Permissions

### Purpose

Define what each role can access and modify.

### Layout

- Matrix table with roles as columns and permissions as rows.
- Permission groups: Workspace, Projects, Tasks, Data, Developer Tools, AI, Billing.
- Owner column is locked.

### Components

- Table
- Checkbox or locked indicator
- Tooltip
- Alert for inherited permissions
- Save bar for edited custom permissions, if supported

### Role Definitions

Owner:

- Full control.
- Can transfer ownership, delete workspace, manage billing, and change all settings.

Admin:

- Manages workspace operations, members, projects, settings, imports, exports, developer tools, and AI policy where allowed.

Manager:

- Manages projects, tasks, members within assigned scope, and workflow settings.

Member:

- Creates and edits work they can access.

Guest:

- Limited project or task access.

### Permission Matrix

| Permission | Owner | Admin | Manager | Member | Guest |
| --- | --- | --- | --- | --- | --- |
| Create Project | Yes | Yes | Yes | Yes | No |
| Delete Project | Yes | Yes | Scoped | No | No |
| Manage Members | Yes | Yes | Scoped | No | No |
| Invite Members | Yes | Yes | Yes | Scoped | No |
| Manage Workspace | Yes | Yes | No | No | No |
| Manage Billing | Yes | Scoped | No | No | No |
| Manage Settings | Yes | Yes | Scoped | No | No |
| Create Tasks | Yes | Yes | Yes | Yes | Scoped |
| Delete Tasks | Yes | Yes | Yes | Own | No |
| Export Data | Yes | Yes | Scoped | No | No |
| Import Data | Yes | Yes | Yes | No | No |
| Access Developer Tools | Yes | Yes | Scoped | Scoped | No |
| Access AI Features | Yes | Yes | Yes | Yes | Scoped |

### Permission Inheritance

- Workspace role is the default permission baseline.
- Project roles can narrow or expand access only within policy limits.
- Task-level privacy can restrict visibility inside accessible projects.
- Owner permissions cannot be removed.

### Interaction

- Hover permission cells for explanation.
- Click editable cells toggles permission when custom roles exist.
- Role presets can be duplicated only by Owners/Admins.

### Validation

- No role can grant permissions higher than the editor's authority.
- Billing and ownership permissions require Owner approval.

### Accessibility

- Matrix cells expose role, permission, and state.
- Keyboard navigation supports row and column traversal.

### Developer Notes

- Enforce permissions server-side for every mutation and query.
- Client matrix is explanatory, not authoritative.

### UX Reasoning

Permissions must be understandable before they are editable. The matrix makes role boundaries explicit and reduces accidental over-sharing.

## 12. Workspace Settings

### Purpose

Configure workspace identity, behavior, security, notifications, backup, export, and lifecycle.

### Layout

- Settings uses left settings navigation and right content pane.
- Sections: General, Appearance, Notifications, Security, Backup and Export, Danger Zone.

### Components

- Inputs
- Textarea
- Select
- Checkbox
- Switch
- Button
- Alert
- Modal
- Toast

### Settings

General:

- Workspace Name
- Workspace Icon
- Description
- Time Zone
- Language
- Default View

Appearance:

- Workspace logo
- Sidebar display preferences
- Default density, when supported

Notifications:

- Workspace activity notifications
- Invitation notifications
- Project update summaries
- AI summary cadence

Security:

- Allowed domains
- Share link policy
- Guest access
- Session requirements
- Two-factor policy, where supported

Backup and Export:

- Export workspace data
- Backup schedule
- Import data
- Audit log export

Danger Zone:

- Transfer Ownership
- Archive Workspace
- Delete Workspace
- Leave Workspace

### Interaction

- Editable settings save inline or via section save bar.
- Dangerous actions open confirmation modal.
- Delete requires workspace name confirmation.
- Transfer ownership requires selecting eligible member.

### Validation

- Workspace name required.
- Time zone must be valid.
- Delete requires Owner role.
- Transfer requires at least one other eligible active member.

### Accessibility

- Settings navigation uses clear landmarks.
- Dangerous confirmations have explicit headings and consequences.
- Form errors are associated with fields.

### Developer Notes

- Settings mutations write audit log entries.
- Apply settings optimistically only when rollback is safe.
- Security changes may require session revalidation.

### UX Reasoning

Settings must feel calm and administrative. Grouping prevents critical security and lifecycle actions from being mixed with routine identity edits.

## 13. Sidebar Behavior

Workspace Switcher:

- Shows active workspace at top of sidebar.
- Opens menu with recent, pinned, and all workspaces.

Active Workspace:

- Current workspace is visually selected and included in top navigation context.

Collapsed Sidebar:

- Shows logo, workspace avatar, and icons.
- Tooltips are required.

Expanded Sidebar:

- Shows workspace name, nav labels, and groups.

Hover States:

- Use `state.hover`.
- No layout shift.

Keyboard Navigation:

- Arrow keys move inside workspace menu.
- Enter selects.
- Escape closes.

Context Menu:

- Available on workspace item.
- Actions: Open, Pin, Favorite, Settings, Leave.

Recent Workspaces:

- Sorted by last opened.

Pinned Workspaces:

- Always appear above recent workspaces.

## 14. Search Experience

Workspace Search finds:

- Workspace name
- Description
- Member
- Recent workspaces
- Favorite workspaces

Shortcut:

- Command/Ctrl + K opens global search.
- Workspace switcher search is focused automatically when menu opens.

Behavior:

- Debounce search input.
- Show local cached matches immediately.
- Show loading when remote results are pending.
- Empty results provide clear reset action.

Accessibility:

- Result count is announced politely.
- Current active result is programmatically selected.

## 15. Quick Actions

Actions:

- Create Workspace
- Invite Member
- Open Settings
- Switch Workspace
- Create Project

Visibility:

- Create Workspace appears when account policy allows it.
- Invite Member requires invite permission.
- Settings requires workspace management access or read-only settings visibility.
- Create Project requires Create Project permission.

## 16. Empty States

No Workspace:

- Encourage creating or accepting an invitation.

No Members:

- Only possible in transitional states; show setup guidance.

No Projects:

- Primary action: Create Project.

No Invitations:

- "Pending invitations will appear here."

No Activity:

- "Workspace activity appears as members create and update work."

## 17. Error States

Workspace Not Found:

- Route to selector and show Alert.

Permission Denied:

- Explain missing permission and suggest contacting an admin.

Invitation Expired:

- Offer request-new-invite action.

Network Error:

- Preserve cached data and offer retry.

Workspace Deleted:

- Route to selector.

Conflict Detected:

- Show latest server state and offer reload.

## 18. Loading States

- Workspace Loading: shell and selector skeletons.
- Member Loading: table row skeletons.
- Permission Loading: matrix skeleton.
- Settings Loading: form skeletons preserving section layout.

Use section-level loading whenever possible.

## 19. Responsiveness

Desktop:

- Expanded sidebar, full management layouts.

Small Desktop:

- Collapse right panels first.
- Tables remain horizontally scrollable only when necessary.

Large Desktop:

- Keep content max width readable.

Ultra-wide:

- Allow secondary inspector but do not stretch tables beyond scannable width.

## 20. Accessibility

- Keyboard navigation required for every menu, table, modal, and form.
- Focus order follows sidebar, top nav, main content, right panel.
- Screen readers receive semantic labels for roles, permissions, and status.
- High contrast mode increases border and text contrast.
- Reduced motion disables panel translation and skeleton shimmer.
- Forms use visible labels and associated errors.
- ARIA roles: dialog, menu, listbox, table, status, alert where appropriate.

## 21. Performance

Workspace Switching:

- Switch shell immediately, then load workspace data progressively.

Caching:

- Cache workspace list and current workspace metadata.

Lazy Loading:

- Load members, activity, storage, and AI summaries after core workspace identity.

Member Pagination:

- Paginate after 50 members.

Activity Refresh:

- Cursor pagination and background refresh.

Synchronization:

- Keep optimistic UI for safe actions.
- Reconcile server state and show conflicts clearly.

## 22. Security

- Validate role and permission on every server request.
- Enforce workspace isolation across all queries.
- Maintain audit trail for membership, permission, settings, export, and destructive actions.
- Revalidate session before ownership transfer, exports, and deletion.
- Invitation links must be scoped, expiring, and revocable.

## 23. Quality Bar

Workspace management is complete when users can create, switch, understand, configure, invite, permission, archive, leave, transfer, and delete workspaces with clear feedback, accessible controls, isolated data, and Phase 01 visual consistency.

