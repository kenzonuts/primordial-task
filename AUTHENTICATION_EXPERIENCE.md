# Primordial Task Authentication Experience

Version: 1.0  
Phase: 02  
Owner: Primordial Studio  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md)  
Platform: Desktop first, tablet adaptable  

## 1. Experience Principle

Authentication is the first product experience for Primordial Task. It must feel like opening a serious developer operating system: fast, quiet, precise, and trustworthy.

The flow uses the Phase 01 dark monochrome design language without deviation. The Primordial Studio logo is the primary brand element, but it should feel integrated into the application shell rather than used as marketing decoration.

The authentication experience should communicate:

- Premium software quality
- Professional security posture
- Calm confidence
- Low friction
- Clear recovery paths
- Immediate readiness for developer work

## 2. Flow Overview

```text
Application Launch
  -> Splash Screen
  -> Authentication Check
  -> Welcome Screen
  -> Login
  -> Register
  -> Forgot Password
  -> Verification
  -> Workspace Selection
  -> Dashboard
```

Primary route for returning users:

```text
Launch -> Splash -> Authentication Check -> Workspace Selection or Dashboard
```

Primary route for signed-out users:

```text
Launch -> Splash -> Authentication Check -> Welcome -> Login -> Workspace Selection -> Dashboard
```

Account creation route:

```text
Welcome -> Register -> Verification -> Workspace Selection -> Dashboard
```

Recovery route:

```text
Login -> Forgot Password -> Confirmation -> Login
```

## 3. Shared Layout System

### 3.1 Window Foundation

- Root background: `bg.app`
- Content background: `bg.workspace`
- Form surface: `surface.base`
- Form border: `border.subtle`
- Elevated panels: `surface.elevated`
- Text: `text.primary`, `text.secondary`, `text.muted`
- Status color only for validation and system states

### 3.2 Auth Shell

Authentication screens use a centered layout with one focused content column.

Desktop layout:

- Window min width: `1024px`
- Content max width: `440px` for forms
- Welcome content max width: `520px`
- Workspace selection max width: `1040px`
- Outer padding: `space.32`
- Vertical rhythm: `space.24` to `space.40`

Tablet layout:

- Outer padding: `space.24`
- Form max width remains `440px`
- Workspace grid collapses from 3 columns to 2 columns, then 1 column when needed

### 3.3 Auth Card

Default authentication card:

- Width: `440px`
- Padding: `space.32`
- Radius: `radius.lg`
- Background: `surface.base`
- Border: `1px solid border.subtle`
- Shadow: `shadow.sm`
- Internal section gap: `space.24`
- Field gap: `space.16`
- Action gap: `space.12`

The card should be structurally clear but not visually heavy. Avoid nested cards.

### 3.4 Brand Treatment

Logo block:

- Logo size: `32px` to `40px` depending on screen
- Application name: `type.h3` or `type.h2`
- Tagline: `type.body-sm` or `type.body-md`
- Gap between logo and name: `space.12`

Do not add glow, gradient, blur, or decorative framing to the logo.

### 3.5 Shared Microcopy Tone

Copy should be concise, professional, and direct.

Preferred lines:

- "Welcome back."
- "Let's continue building great products."
- "Create your account."
- "Continue with Google"
- "Continue with GitHub"
- "Forgot your password?"
- "Choose a workspace to continue."
- "Check your email."
- "Your session expired. Sign in again to continue."

Avoid:

- Hype language
- Cute empty-state copy
- Long security explanations unless legally required
- Casual jokes

## 4. Shared Components

Use Phase 01 components without redesign:

- Button
- Input
- Checkbox
- Card
- Modal
- Avatar
- Divider
- Tooltip
- Loading State
- Toast
- Alert
- Progress Bar
- Skeleton

### 4.1 Button Usage

Primary action:

- Variant: Primary
- Size: Large for main form submit, Medium for secondary screens
- Full width in forms

Secondary actions:

- Variant: Secondary or Ghost
- Full width for OAuth buttons
- Inline text button for low-emphasis navigation

Back button:

- Variant: Ghost
- Icon: `ArrowLeft`
- Size: Medium
- Position: top-left within card header area or above card

### 4.2 Input Usage

All form inputs:

- Size: Large, `40px` height
- Labels are always visible
- Placeholder is example-only
- Validation message appears below field
- Error border uses `danger`
- Helper text uses `text.muted`

Password inputs:

- Include visibility toggle icon button
- Toggle has tooltip: "Show password" or "Hide password"
- Do not reveal password by default

### 4.3 Divider Usage

OAuth and email flows are separated by a quiet divider:

- Horizontal divider color: `divider`
- Text label: "or"
- Label typography: `type.caption`
- Label color: `text.muted`
- Vertical spacing: `space.20`

### 4.4 Loading Usage

Use the smallest loading indicator that communicates state:

- Splash: centered progress indicator
- Form submit: spinner inside primary button
- Auth check: compact spinner and status line
- Workspace list: skeleton cards
- Dashboard handoff: progress bar only if loading exceeds 800ms

## 5. Screen Specifications

## 5.1 Splash Screen

### Purpose

- Load the application shell
- Initialize local services
- Check session cache
- Establish brand recognition

### Layout Structure

- Full-window centered composition
- Root uses `bg.app`
- Logo and app name are vertically centered
- Loading indicator sits below brand block
- Version number sits at bottom center

Desktop dimensions:

- Brand block width: `320px`
- Logo size: `40px`
- Logo to name gap: `space.12`
- Name to loader gap: `space.32`
- Loader to status text gap: `space.12`
- Bottom version offset: `space.24`

### Components

- Logo
- Application name
- Loading indicator
- Optional status caption
- Optional version caption

### Spacing

- Outer padding: `space.32`
- Brand stack gap: `space.12`
- Loading region gap: `space.16`

### Interaction

- No user interaction required
- Escape does not cancel loading
- If loading exceeds 8 seconds, show a recoverable message with retry

### States

- Loading: "Opening Primordial Task"
- Checking session: "Checking session"
- Offline: "Connection unavailable"
- Timeout: "Primordial Task is taking longer than expected"
- Retry available: Ghost button "Retry"

### Accessibility

- Use `role="status"` for loading text
- Version text is readable but not focusable
- Respect reduced motion by using a static spinner or progress dots

### Design Notes

The splash screen should feel like a native desktop app launch, not a web loading page. Keep it nearly silent: logo, product name, and a precise loading signal.

### Developer Notes

- Minimum display duration: `600ms` to avoid flashing
- Maximum automatic wait before timeout message: `8000ms`
- Do not block on non-critical analytics
- Use local session cache to decide whether to continue to Authentication Check

## 5.2 Authentication Check

### Purpose

- Validate stored session
- Refresh tokens if possible
- Route the user to Welcome, Workspace Selection, or Dashboard

### Layout Structure

- Full-window centered compact status block
- Same foundation as Splash, but smaller brand treatment
- No card unless an error requires user choice

Desktop dimensions:

- Content width: `360px`
- Logo size: `32px`
- Status text below spinner

### Components

- Logo
- Loading indicator
- Alert for expired or invalid sessions
- Button for "Sign in again" when needed

### Spacing

- Logo to spinner: `space.24`
- Spinner to text: `space.12`
- Error alert margin top: `space.24`

### Interaction

- Automatic routing
- If refresh succeeds, continue without interruption
- If refresh fails because of session expiry, show recovery action

### States

- Checking: "Checking your session"
- Refreshing: "Restoring secure session"
- Expired: "Your session expired. Sign in again to continue."
- Failed: "We could not verify your session."

### Accessibility

- Status changes use polite live region
- Error action receives focus when automatic recovery fails

### Design Notes

This screen should rarely be visible for long. It exists to make the transition from launch to authenticated workspace feel secure and intentional.

### Developer Notes

- Route signed-out users to Welcome
- Route users with one workspace directly to Dashboard
- Route users with multiple workspaces to Workspace Selection
- Store the intended route for post-login redirect

## 5.3 Welcome Screen

### Purpose

- Introduce Primordial Task
- Offer clear sign-in and account creation routes
- Provide OAuth entry points

### Layout Structure

- Full-window centered content
- No heavy panel if the screen is first-run and unauthenticated
- Use a focused central column with logo at top
- Optional auth card contains actions only

Desktop dimensions:

- Content width: `520px`
- Auth action group width: `360px`
- Logo size: `40px`
- Main heading uses `type.display`
- Body copy uses `type.body-lg`

### Components

- Logo
- Heading
- Body text
- Primary Button: "Sign In"
- Secondary Button: "Create Account"
- OAuth Buttons: "Continue with Google", "Continue with GitHub"
- Divider

### Spacing

- Logo to heading: `space.24`
- Heading to body: `space.12`
- Body to action group: `space.40`
- Button gap: `space.12`
- OAuth divider spacing: `space.20`

### Interaction

- Sign In opens Login Screen
- Create Account opens Register Screen
- Google and GitHub start OAuth flow
- OAuth buttons show loading independently

### States

- Default
- OAuth loading
- OAuth error
- Offline

### Accessibility

- Heading is the only `h1`
- OAuth buttons include provider names in accessible labels
- Focus order: logo skip, heading skip, Sign In, Create Account, Google, GitHub

### Design Notes

The welcome screen should not oversell the product. The strongest message is confidence. Use one concise tagline:

"An AI-powered developer workspace for focused teams."

### Developer Notes

- If OAuth provider is disabled, hide the button rather than disabling it
- Preserve any invitation or redirect token through the route
- OAuth popup errors should return focus to the triggering button

## 5.4 Login Screen

### Purpose

- Authenticate returning users with email/password or OAuth
- Provide account recovery
- Communicate validation clearly

### Layout Structure

- Centered auth card
- Card header contains back button, logo, title, and supporting copy
- Form fields stacked vertically
- Remember Me and Forgot Password share one row
- Primary login button full width
- OAuth options below divider

Desktop dimensions:

- Card width: `440px`
- Card padding: `space.32`
- Field width: full card content width
- Header stack max width: `360px`

### Components

- Card
- Back Button
- Logo
- Heading: "Welcome back."
- Body: "Let's continue building great products."
- Input: Email
- Input: Password
- Checkbox: Remember Me
- Text Button: Forgot Password
- Primary Button: "Sign In"
- Divider
- OAuth Buttons
- Alert for form-level errors
- Toast for successful sign-in only if route delay exceeds 1 second

### Spacing

- Card header gap: `space.12`
- Header to form: `space.32`
- Field gap: `space.16`
- Remember row margin top: `space.4`
- Form to submit: `space.24`
- Submit to divider: `space.24`
- OAuth button gap: `space.12`

### Interaction

- Email input validates on blur and submit
- Password input validates on submit
- Remember Me toggles with click or Space
- Forgot Password opens Forgot Password Screen
- Enter submits when form is valid enough to attempt authentication
- Escape returns to Welcome Screen when no request is in progress

### States

- Default: Empty fields
- Focused: Focus ring on active input
- Invalid email: Inline error below email
- Missing password: Inline error below password
- Wrong password: Form-level Alert
- Loading: Login button disabled with spinner and label "Signing in"
- Success: Button label "Signed in"; route to next screen
- Disabled: Submit disabled only while request is in progress, not while fields are empty

### Accessibility

- Form has a visible heading
- Inputs use labels and `aria-describedby`
- Field errors use `aria-invalid="true"`
- Form-level Alert receives focus after failed submit
- Password visibility toggle has accessible label

### Design Notes

Wrong-password errors should not shake the form or use dramatic animation. The interface should remain calm and helpful.

### Developer Notes

- Use `autocomplete="email"` and `autocomplete="current-password"`
- Do not disclose whether an email exists for password mismatch
- Rate-limit repeated attempts
- Preserve invitation and redirect context after sign-in

## 5.5 Register Screen

### Purpose

- Create a new Primordial Task account
- Set expectations for secure access
- Support OAuth registration

### Layout Structure

- Centered auth card
- Header mirrors Login Screen
- Full name, email, password, confirm password fields
- Password strength appears beneath password field
- Terms checkbox before submit
- OAuth options below divider

Desktop dimensions:

- Card width: `440px`
- Card padding: `space.32`
- Long form may scroll within window if vertical space is limited

### Components

- Card
- Back Button
- Logo
- Heading: "Create your account."
- Body: "Start building in a focused developer workspace."
- Input: Full Name
- Input: Email
- Input: Password
- Password Strength Indicator
- Input: Confirm Password
- Checkbox: Accept Terms
- Primary Button: "Create Account"
- Divider
- OAuth Buttons
- Alert for form-level errors

### Spacing

- Header to form: `space.28`
- Field gap: `space.16`
- Password strength top margin: `space.8`
- Terms margin top: `space.8`
- Submit margin top: `space.24`

### Interaction

- Full name validates on blur
- Email validates on blur and submit
- Password strength updates as the user types
- Confirm password validates after the field has content
- Terms checkbox must be checked before account creation
- Enter submits when focus is in a text field
- Escape returns to Welcome Screen if no data is entered; otherwise show unsaved confirmation Modal

### States

- Default
- Inline validation
- Weak password
- Acceptable password
- Strong password
- Terms missing
- Loading: "Creating account"
- Success: "Account created"
- Account already exists
- Connection failed

### Accessibility

- Password strength must include text, not only visual bars
- Terms checkbox label includes links to Terms and Privacy
- Links are keyboard reachable
- Confirmation modal traps focus if unsaved data exists

### Design Notes

The password strength indicator should be quiet and precise. Use monochrome bars for weak to strong progression and semantic color only for actual invalid or accepted states.

### Developer Notes

- Use `autocomplete="name"`, `autocomplete="email"`, and `autocomplete="new-password"`
- Enforce validation on server as source of truth
- Send users to Verification when email verification is required
- OAuth registration should skip password fields and continue to workspace setup or selection

## 5.6 Forgot Password Screen

### Purpose

- Help users recover access without anxiety
- Confirm next steps without revealing account existence

### Layout Structure

- Centered auth card
- Header contains back button, logo, heading, and brief explanation
- Email field and reset button
- Confirmation state replaces form after submit

Desktop dimensions:

- Card width: `420px`
- Card padding: `space.32`

### Components

- Card
- Back Button
- Logo
- Heading: "Reset your password."
- Body: "Enter your email and we will send reset instructions."
- Input: Email
- Primary Button: "Send Reset Link"
- Confirmation State
- Alert for connection failures

### Spacing

- Header to form: `space.32`
- Field to submit: `space.24`
- Confirmation icon to heading: `space.16`

### Interaction

- Back returns to Login Screen
- Enter submits the email field
- On submit, show confirmation regardless of account existence
- Confirmation action: "Back to Sign In"

### States

- Default
- Invalid email
- Loading: "Sending link"
- Confirmation: "Check your email."
- Connection failed
- Server unavailable

### Accessibility

- Confirmation uses `role="status"`
- The confirmation heading receives focus after successful submit
- Email error is associated with the input

### Design Notes

The recovery flow should reduce concern. Avoid language like "No account found" in this flow.

### Developer Notes

- Do not disclose account existence
- Add resend timer only if email service requires throttling
- Track reset request failures without exposing sensitive details

## 5.7 Verification Screen

### Purpose

- Confirm email ownership or complete OAuth/security verification
- Provide resend and change-email paths

### Layout Structure

- Centered auth card
- Logo and heading at top
- Email address shown in muted text
- Verification code input or email-link confirmation depending on implementation
- Resend and change email actions below

Desktop dimensions:

- Card width: `420px`
- Code input group width: full card width
- Six code cells: `44px` square with `space.8` gap

### Components

- Card
- Logo
- Heading: "Verify your email."
- Body
- Code Input or status block
- Primary Button: "Verify"
- Ghost Button: "Resend Code"
- Text Button: "Use a different email"
- Alert for invalid or expired codes

### Spacing

- Header to code input: `space.32`
- Code input to actions: `space.24`
- Resend row gap: `space.8`

### Interaction

- Paste full code into first field fills all cells
- Backspace moves to previous cell when empty
- Enter submits when code is complete
- Resend starts cooldown timer
- Escape returns to previous screen if allowed

### States

- Waiting for code
- Verifying
- Verified
- Invalid code
- Expired code
- Resend cooldown
- Email link sent

### Accessibility

- Code input group has one visible label
- Each code cell has clear position label if implemented as separate inputs
- Timer is readable and announced politely when it changes meaningfully

### Design Notes

Verification should feel secure, not punitive. Use precise language and give users a clear way to correct their email address.

### Developer Notes

- Prefer a single hidden input with visually separated cells when feasible
- Mask or limit sensitive code logging
- Support magic-link verification as an alternative path

## 5.8 Workspace Selection

### Purpose

- Let users with multiple workspaces choose where to continue
- Show enough context to make the choice fast

### Layout Structure

- Full-window content with centered max-width container
- Header includes logo, title, account avatar, and optional sign-out menu
- Workspace cards appear in responsive grid
- Continue button remains disabled until a workspace is selected

Desktop dimensions:

- Container max width: `1040px`
- Header height: `64px`
- Grid columns: 3 at wide desktop, 2 at medium desktop, 1 on tablet
- Card min width: `300px`
- Card padding: `space.20`
- Grid gap: `space.16`

### Components

- Logo
- Heading: "Choose a workspace."
- Body: "Select where you want to continue."
- Avatar
- Workspace Cards
- Workspace logo or initials Avatar
- Badge for role
- Member count
- Last activity
- Primary Button: "Continue"
- Ghost Button or menu action: "Sign Out"
- Skeleton cards while loading
- Empty State if no workspace exists

### Spacing

- Window padding: `space.32`
- Header to content: `space.40`
- Heading to grid: `space.24`
- Card internal gap: `space.12`
- Footer actions margin top: `space.32`

### Interaction

- Click card selects workspace
- Double-click card continues immediately
- Enter continues when a card is selected
- Arrow keys move card focus in grid
- Continue button loads selected workspace
- Account avatar opens profile menu

### States

- Loading skeleton
- Empty workspace list
- Default card
- Hover card
- Focused card
- Selected card
- Workspace unavailable
- Continue loading
- Server unavailable

### Accessibility

- Workspace cards use radio-group behavior or listbox behavior
- Selected state is exposed programmatically
- Member count and role are readable text
- Last activity uses accessible date text

### Design Notes

Workspace cards should feel like professional identity objects, not colorful project tiles. Use monochrome logos or initials. Role badges remain neutral unless role includes a status warning.

### Developer Notes

- Cache the last selected workspace
- Sort by last activity descending
- If exactly one workspace is available, skip this screen unless user explicitly switches workspace
- Empty state should offer "Create Workspace" only if product policy allows it at this step

## 5.9 Dashboard Handoff

### Purpose

- Transition from authentication into the product workspace
- Avoid abrupt visual discontinuity

### Layout Structure

- If loading is under 800ms, route directly to Dashboard
- If loading exceeds 800ms, show compact centered progress state
- Background remains `bg.app` or transitions to app shell `bg.workspace`

### Components

- Loading indicator or Progress Bar
- Status text
- Toast if sign-in succeeded but workspace data is still syncing

### Spacing

- Compact centered stack
- Gap: `space.12`

### Interaction

- No interaction unless loading fails
- Retry button appears after recoverable failure

### States

- Loading workspace
- Syncing workspace
- Success
- Failed to load workspace

### Accessibility

- Use live region for loading status
- Focus moves to Dashboard main heading after route completes

### Design Notes

The handoff should feel continuous with the product shell. Avoid celebratory success screens.

### Developer Notes

- Preload app shell during Authentication Check where possible
- Preserve selected workspace ID
- Route focus to the first meaningful dashboard element

## 6. Validation Rules

### 6.1 Email

Default validation:

- Required
- Must contain valid email structure
- Trim leading and trailing whitespace

Messages:

- Empty: "Enter your email."
- Invalid: "Enter a valid email address."

### 6.2 Password

Default validation:

- Required
- Minimum 8 characters
- Should include a mix of letters, numbers, or symbols

Messages:

- Empty: "Enter your password."
- Too short: "Use at least 8 characters."
- Weak: "Add more variety to strengthen your password."

### 6.3 Confirm Password

Default validation:

- Required
- Must match password

Messages:

- Empty: "Confirm your password."
- Mismatch: "Passwords do not match."

### 6.4 Full Name

Default validation:

- Required
- Minimum 2 characters after trimming

Messages:

- Empty: "Enter your full name."
- Too short: "Enter at least 2 characters."

### 6.5 Terms

Default validation:

- Required for registration

Message:

- "Accept the terms to create an account."

## 7. Error Experience

Errors should be calm, specific, and actionable. Use inline errors for field issues and Alerts for request or system-level issues.

| Error | Placement | Message | Solution |
| --- | --- | --- | --- |
| Wrong password | Form Alert | "The email or password is incorrect." | "Check your details or reset your password." |
| Invalid email | Inline email error | "Enter a valid email address." | Keep focus on email field |
| Connection failed | Form Alert | "Connection failed." | "Check your connection and try again." |
| Authentication timeout | Form Alert | "Authentication timed out." | "Try again in a moment." |
| Session expired | Auth Check Alert | "Your session expired." | "Sign in again to continue." |
| Server unavailable | Form Alert | "Primordial Task is unavailable right now." | "Try again shortly." |
| Account not found | Login Alert | "The email or password is incorrect." | Avoid account enumeration |
| Account already exists | Register Alert | "An account with this email may already exist." | "Sign in or reset your password." |
| OAuth cancelled | Toast | "Sign-in was cancelled." | No additional action |
| OAuth failed | Form Alert | "Provider sign-in failed." | "Try again or use email." |
| Workspace unavailable | Workspace Alert | "This workspace is unavailable." | "Choose another workspace or contact an admin." |

Design rules:

- Alerts use `danger.bg`, `danger`, and `border.default`
- Error text remains concise
- Do not animate errors aggressively
- Preserve user input after failures
- Move focus to the most useful recovery point

## 8. Empty States

### 8.1 No Workspaces

Purpose: Handle users who authenticated successfully but have no available workspace.

Layout:

- Centered compact empty state inside Workspace Selection container
- No illustration
- Optional small monochrome workspace icon

Copy:

- Title: "No workspaces available."
- Body: "You are signed in, but this account is not connected to a workspace."
- Primary action if allowed: "Create Workspace"
- Secondary action: "Sign Out"

Accessibility:

- Empty state title receives focus after loading completes
- Actions are keyboard reachable

### 8.2 No Network During Auth

Copy:

- Title: "Connection unavailable."
- Body: "Check your connection and try again."
- Primary action: "Retry"

Developer note:

- Keep typed form data in memory while retrying

## 9. Loading States

### 9.1 Splash Loading

- Use compact spinner or indeterminate progress mark
- Caption changes only at meaningful phases
- No percentage unless real progress exists

### 9.2 Form Loading

- Submit button shows spinner and action-specific label
- Inputs remain visible
- Disable submit and OAuth buttons during the active request
- Keep Back enabled only if cancelling is technically safe

### 9.3 Workspace Skeleton

Skeleton card structure:

- Avatar circle skeleton
- Workspace name line
- Metadata line
- Last activity line

Use `state.skeleton` and `state.skeleton-highlight`. Respect reduced motion.

### 9.4 Progress Indicator

Use progress bars only for:

- Workspace loading that can report progress
- App migration or first-run setup
- Long OAuth callback resolution

Do not use progress bars as decoration.

## 10. Interaction Model

### 10.1 Pointer

- Hover: `motion.fast`, background shifts to `state.hover`
- Pressed: `state.pressed`
- Selected: `state.selected`
- Disabled: no pointer interaction, readable disabled text

### 10.2 Keyboard

Global rules:

- Tab follows visual order
- Shift + Tab moves backward
- Enter submits focused form or activates focused action
- Space toggles checkbox, switch, or selected workspace card
- Escape closes dialogs or returns to the previous auth screen when safe

Screen-specific keyboard rules:

- Login: Enter submits credentials
- Register: Enter submits when a text input is focused
- Forgot Password: Enter sends reset link
- Verification: Enter verifies completed code
- Workspace Selection: Arrow keys move between cards, Enter continues

### 10.3 Focus

- Focus ring uses `state.focus`
- First interactive field receives focus when a form screen opens
- On validation failure, focus moves to the first invalid field
- On form-level request error, focus moves to Alert
- On successful route, focus moves to next screen heading or main content

### 10.4 Transitions

Use subtle motion only:

- Screen enter: `motion.base`, opacity 0 to 1, translateY 4px to 0
- Screen exit: `motion.fast`, opacity 1 to 0
- Modal enter: `motion.slow` with `ease.emphasized`
- Button state: `motion.fast`

Reduced motion:

- Remove translate movement
- Keep instant opacity or no transition
- Disable skeleton shimmer

## 11. Accessibility Requirements

Authentication must be fully operable without a pointer.

Requirements:

- Every input has a visible label
- Every icon-only control has accessible label and tooltip
- Errors are programmatically associated with fields
- Alerts use appropriate roles
- Loading states use live regions
- Focus is never lost between route transitions
- OAuth popups return focus to the triggering button
- Contrast meets WCAG AA minimum
- Text remains readable at desktop and tablet sizes
- Hit targets are at least `32px` by `32px`
- Forms remain usable at 200 percent zoom

ARIA notes:

- Form-level errors: `role="alert"` when immediate attention is needed
- Loading text: `role="status"` with `aria-live="polite"`
- Verification code group: `role="group"` with accessible label
- Workspace choices: `radiogroup` and `radio`, or `listbox` and `option`
- Modal confirmations: `role="dialog"` and `aria-modal="true"`

## 12. Responsiveness

Desktop is primary.

Desktop:

- Use centered forms
- Maintain generous vertical rhythm
- Workspace grid can use 3 columns

Small desktop and tablet:

- Reduce outer padding from `space.32` to `space.24`
- Keep form card width capped at available width minus margins
- Workspace grid becomes 2 columns, then 1 column
- Avoid shrinking text below Phase 01 tokens

Minimum practical viewport:

- Width: `768px`
- Height: `640px`

Overflow behavior:

- Auth cards may scroll vertically if the viewport is short
- Keep primary action reachable
- Avoid fixed vertical centering that hides fields

## 13. React Implementation Notes

Recommended route model:

```text
/launch
/auth/check
/auth/welcome
/auth/login
/auth/register
/auth/forgot-password
/auth/verify
/workspaces
/dashboard
```

Recommended component structure:

```text
AuthShell
  BrandMark
  AuthCard
  AuthHeader
  OAuthButtonGroup
  Divider
  FormAlert
  PasswordField
  PasswordStrength
  VerificationCodeInput
  WorkspaceGrid
  WorkspaceCard
```

State handling:

- Keep auth request state local to each form
- Keep session and workspace state in a shared auth provider
- Use server responses as final validation authority
- Preserve route intent through login, OAuth, and verification
- Never log passwords, verification codes, or access tokens

Performance:

- Preload dashboard shell after successful session validation
- Lazy-load OAuth provider code when the user reaches auth screens
- Keep splash lightweight
- Avoid delaying routing for analytics or marketing events

Security:

- Avoid account enumeration in login and password reset
- Rate-limit auth attempts
- Clear sensitive fields after successful submit
- Use secure token storage appropriate to the desktop platform
- Revalidate session before opening privileged workspace data

## 14. Figma Implementation Notes

Create these Figma pages:

- `02 Auth / Foundations`
- `02 Auth / Splash`
- `02 Auth / Welcome`
- `02 Auth / Login`
- `02 Auth / Register`
- `02 Auth / Recovery`
- `02 Auth / Verification`
- `02 Auth / Workspace Selection`
- `02 Auth / States`

Component variants:

- Auth Card: default, loading, error
- OAuth Button: Google, GitHub, loading, disabled
- Password Field: hidden, visible, error
- Password Strength: empty, weak, acceptable, strong
- Verification Code: empty, partial, complete, error
- Workspace Card: default, hover, focused, selected, disabled, loading
- Form Alert: danger, warning, info, success

Prototype links:

- Splash to Authentication Check
- Authentication Check to Welcome
- Welcome to Login
- Welcome to Register
- Login to Forgot Password
- Register to Verification
- Verification to Workspace Selection
- Workspace Selection to Dashboard

## 15. Quality Bar

The authentication experience is complete when:

- It uses only Phase 01 typography, color, spacing, radius, icon, shadow, motion, and component rules
- Every required screen has default, loading, success, and error behavior where applicable
- Every field has visible labels and accessible validation
- OAuth, email login, registration, recovery, verification, and workspace selection are all specified
- Keyboard navigation works from launch through dashboard handoff
- Error messages are helpful without exposing sensitive account details
- Tablet adaptation is defined
- The experience feels quiet, premium, and professional without decorative visual noise

