# Primordial Task Design System

Version: 1.0  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Theme: Dark mode first  

## 1. Purpose

This document defines the design system for Primordial Task, an AI-powered developer workspace that combines task management, project management, team collaboration, Git integration, database management, API collections, snippet management, and an AI assistant.

The system is intended to be the single source of truth for product designers, frontend engineers, and future contributors. It defines the visual language, interaction rules, accessibility requirements, layout foundations, tokens, and component behavior needed to build a premium desktop application at scale.

## 2. Brand Foundation

### 2.1 Application Identity

- Application name: Primordial Task
- Brand owner: Primordial Studio
- Official identity: The provided Primordial Studio logo

The logo is the primary brand signal inside the product. Do not redesign, redraw, stretch, recolor, add effects to, or place decorative containers around the logo unless a brand asset package explicitly defines those treatments.

### 2.2 Brand Personality

Primordial Task should feel:

- Premium
- Professional
- Elegant
- Minimal
- Modern
- Calm
- Powerful
- Intelligent
- Clean
- Timeless

The product should communicate capability through structure, precision, and restraint. It should not rely on saturated color, decorative illustration, trendy gradients, or oversized marketing patterns inside the application shell.

### 2.3 Design Philosophy

Primordial Task is a professional operating system for developers. The interface should feel fast, focused, and stable. Users should trust it with complex daily work: project planning, code context, data inspection, API testing, team decisions, snippets, and AI assistance.

Core principles:

- Hierarchy before decoration.
- Quiet surfaces before colorful panels.
- Predictable controls before novel interactions.
- Dense information when useful, with enough whitespace to scan.
- Strong typography and alignment over visual effects.
- Status color only when color improves comprehension.

## 3. Visual Direction

### 3.1 Theme

Dark mode is the primary and default theme.

The interface uses a monochrome base palette: black, white, and gray. Color is reserved for semantic status only: success, warning, danger, and information. Status color should never become general decoration or module branding.

### 3.2 Application Feel

The product should draw inspiration from Apple, Linear, Cursor, Raycast, Arc Browser, GitHub Desktop, Notion, and Vercel without copying their visual systems. The unique Primordial Task identity comes from a precise monochrome palette, measured spacing, highly consistent surfaces, and the Primordial Studio logo as the main identity anchor.

### 3.3 Visual Rules

- Use one monochrome visual language across every module.
- Avoid colorful dashboard sections, charts, badges, or navigation groups unless color communicates status.
- Avoid gaming, neon, glassmorphism, heavy blur, heavy shadow, and decorative gradient treatments.
- Keep borders subtle but present enough to separate dense tools.
- Use typography, spacing, and state changes as the main hierarchy tools.
- Prefer compact professional controls over oversized marketing UI.

## 4. Typography

### 4.1 Font Families

Primary UI font:

```css
font-family: Inter, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Rationale: Inter provides excellent legibility in dense desktop interfaces and strong numeric rendering. SF Pro Text and Segoe UI keep the product native-feeling on macOS and Windows when Inter is unavailable.

Monospace font:

```css
font-family: "JetBrains Mono", "SF Mono", "Cascadia Code", "Roboto Mono", monospace;
```

Rationale: Developer workflows need highly legible code, branch names, snippets, environment values, query text, request bodies, and logs. JetBrains Mono is readable at small sizes and supports long technical strings well.

### 4.2 Type Scale

| Token | Family | Weight | Size | Line Height | Letter Spacing | Usage |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `type.display` | Primary | 650 | 32px | 40px | 0 | Rare product-level titles, onboarding, empty workspace headers |
| `type.h1` | Primary | 650 | 26px | 34px | 0 | Main screen titles and primary workspace pages |
| `type.h2` | Primary | 620 | 22px | 30px | 0 | Section-level titles and modal titles |
| `type.h3` | Primary | 600 | 18px | 26px | 0 | Panel titles, drawer titles, card group titles |
| `type.h4` | Primary | 600 | 15px | 22px | 0 | Compact section headers and table group labels |
| `type.body-lg` | Primary | 450 | 16px | 24px | 0 | Long-form descriptions, AI assistant messages |
| `type.body-md` | Primary | 450 | 14px | 22px | 0 | Default UI text, list rows, table cells |
| `type.body-sm` | Primary | 450 | 13px | 20px | 0 | Secondary metadata, compact descriptions |
| `type.caption` | Primary | 450 | 12px | 18px | 0 | Timestamps, helper text, secondary labels |
| `type.label` | Primary | 560 | 12px | 16px | 0 | Form labels, field labels, menu labels |
| `type.button` | Primary | 560 | 13px | 16px | 0 | Button text and compact command labels |
| `type.mono` | Monospace | 450 | 13px | 20px | 0 | Code, query text, API payloads, logs, identifiers |

### 4.3 Typography Rules

- Use `body-md` as the default product text size.
- Use `body-sm` for secondary context only, not for primary task titles.
- Use `caption` sparingly; avoid using it for critical information.
- Keep letter spacing at `0`. Do not use negative tracking.
- Use medium weights to create hierarchy before increasing size.
- Use monospace only for technical content, never for decorative branding.
- Truncate long technical strings in tables and lists with a tooltip or copy action.

## 5. Color System

### 5.1 Core Palette

| Token | Value | Purpose |
| --- | --- | --- |
| `gray.0` | `#FFFFFF` | Pure white, reserved for highest-emphasis text and selected icon states |
| `gray.50` | `#F5F5F5` | Light text on deep surfaces, rare inverse elements |
| `gray.100` | `#E6E6E6` | Primary text on dark background |
| `gray.200` | `#CFCFCF` | Strong secondary text |
| `gray.300` | `#A8A8A8` | Secondary text and inactive icons |
| `gray.400` | `#858585` | Muted text and placeholders |
| `gray.500` | `#666666` | Disabled text and subtle icon states |
| `gray.600` | `#4A4A4A` | Strong borders and control strokes |
| `gray.700` | `#333333` | Borders, dividers, elevated edges |
| `gray.800` | `#242424` | Elevated surfaces and cards |
| `gray.850` | `#1C1C1C` | Inputs, sidebars, secondary surfaces |
| `gray.900` | `#141414` | Main app background |
| `gray.950` | `#0B0B0B` | Deep background and overlays |
| `black` | `#000000` | Modal overlay base and absolute depth |

### 5.2 Semantic Product Tokens

| Token | Value | Purpose |
| --- | --- | --- |
| `bg.app` | `#0B0B0B` | Root application window background |
| `bg.workspace` | `#141414` | Main content background |
| `bg.secondary` | `#1C1C1C` | Secondary background for sidebars and tool panels |
| `surface.base` | `#1C1C1C` | Default component surface |
| `surface.elevated` | `#242424` | Popovers, dropdowns, raised panels |
| `surface.sidebar` | `#111111` | Primary sidebar background |
| `surface.nav` | `#171717` | Top navigation and command surfaces |
| `surface.card` | `#1F1F1F` | Cards, notification items, compact widgets |
| `surface.input` | `#181818` | Input, textarea, select, search fields |
| `border.default` | `#333333` | Standard component borders |
| `border.subtle` | `#262626` | Dividers and low-emphasis boundaries |
| `border.strong` | `#4A4A4A` | Active controls and focused structural borders |
| `divider` | `#2A2A2A` | Separators between regions and table rows |
| `overlay.scrim` | `rgba(0, 0, 0, 0.64)` | Modal and drawer background overlay |
| `text.primary` | `#E6E6E6` | Primary readable text |
| `text.secondary` | `#A8A8A8` | Secondary context text |
| `text.muted` | `#858585` | Metadata, timestamps, subdued helper text |
| `text.disabled` | `#666666` | Disabled labels and inactive values |
| `text.placeholder` | `#666666` | Placeholder text in inputs |
| `state.hover` | `#262626` | Hover background on rows, menus, and ghost controls |
| `state.pressed` | `#303030` | Pressed background state |
| `state.selected` | `#2D2D2D` | Selected row, active tab, current nav item |
| `state.focus` | `#F5F5F5` | Keyboard focus ring |
| `state.skeleton` | `#262626` | Loading skeleton base |
| `state.skeleton-highlight` | `#333333` | Loading skeleton shimmer highlight |

### 5.3 Status Tokens

Status colors are the only color accents allowed inside the product.

| Token | Value | Purpose |
| --- | --- | --- |
| `success` | `#4ADE80` | Successful sync, passing checks, completed operations |
| `success.bg` | `rgba(74, 222, 128, 0.12)` | Success badges and subtle alerts |
| `warning` | `#FACC15` | Risk, pending review, rate limit warnings |
| `warning.bg` | `rgba(250, 204, 21, 0.12)` | Warning badges and subtle alerts |
| `danger` | `#F87171` | Failed jobs, destructive actions, merge conflicts |
| `danger.bg` | `rgba(248, 113, 113, 0.12)` | Danger badges and subtle alerts |
| `info` | `#60A5FA` | Informational status, neutral notifications, AI activity |
| `info.bg` | `rgba(96, 165, 250, 0.12)` | Informational badges and subtle alerts |

### 5.4 Color Usage Rules

- Do not use status colors for navigation, section identity, decoration, or arbitrary emphasis.
- Prefer monochrome selected states for active navigation and tabs.
- Use colored icons only when the adjacent text or status badge also communicates the same state.
- Text must maintain at least WCAG AA contrast. Critical workflows should target AAA where feasible.
- Disabled states must remain readable enough to understand unavailable options.

## 6. Spacing System

Primordial Task uses an 8-point spacing system with small precision values for dense desktop controls.

| Token | Value | Usage |
| --- | ---: | --- |
| `space.2` | 2px | Hairline offsets, icon optical alignment, compact separator spacing |
| `space.4` | 4px | Tight icon-label gaps, compact stacked metadata |
| `space.8` | 8px | Default small gap between related controls |
| `space.12` | 12px | Compact control padding, menu item horizontal gap |
| `space.16` | 16px | Default component padding and form field gap |
| `space.20` | 20px | Panel internal padding and compact section gap |
| `space.24` | 24px | Default page padding on dense screens |
| `space.32` | 32px | Section separation and larger panel padding |
| `space.40` | 40px | Major content group separation |
| `space.48` | 48px | Empty state spacing and modal vertical padding |
| `space.56` | 56px | Large page rhythm and onboarding blocks |
| `space.64` | 64px | Major workspace region spacing |
| `space.80` | 80px | Hero-like documentation and onboarding layouts only |
| `space.96` | 96px | Rare full-page empty or first-run layouts |

Rules:

- Use `8`, `12`, and `16` for most component internals.
- Use `24` and `32` for page and panel layout.
- Use `40+` only for major workflow separation.
- Avoid arbitrary spacing values unless needed for optical alignment.

## 7. Grid And Layout

Desktop only. The application should support dense professional workflows on laptop and large monitor sizes.

| Token | Value | Usage |
| --- | ---: | --- |
| `layout.window-min-width` | 1024px | Minimum supported desktop application width |
| `layout.container` | 1280px | Default centered content width for readable pages |
| `layout.max-width` | 1600px | Maximum width for standard content before using multi-pane layouts |
| `layout.content` | Fluid | Main workspace should adapt to available window width |
| `layout.sidebar-width` | 264px | Primary navigation sidebar |
| `layout.sidebar-compact` | 72px | Collapsed sidebar with icons |
| `layout.inspector-width` | 360px | Right inspector, AI context, properties panel |
| `layout.panel-min` | 280px | Minimum functional panel width |
| `layout.content-padding` | 24px | Default page padding |
| `layout.content-padding-dense` | 16px | Dense tools, tables, and editors |
| `layout.section-gap` | 32px | Gap between major content sections |
| `layout.card-gap` | 16px | Gap between card or widget groups |
| `layout.widget-gap` | 12px | Gap between compact widgets and controls |

Layout rules:

- Favor two-pane and three-pane layouts for developer workflows.
- Keep sidebars fixed-width and content panes fluid.
- Avoid centered narrow layouts for operational tools unless the task is reading or writing long text.
- Tables, lists, editors, API tools, and database views should use available width efficiently.
- Use sticky headers in dense lists and data tables when vertical scrolling is expected.

## 8. Border Radius

| Token | Value | Usage |
| --- | ---: | --- |
| `radius.sm` | 4px | Inputs, table rows, compact menu items |
| `radius.md` | 6px | Buttons, tabs, badges, chips |
| `radius.lg` | 8px | Cards, modals, popovers, drawers |
| `radius.xl` | 12px | Command palette and large floating panels |
| `radius.full` | 999px | Avatars, pills, progress handles, toggle knobs |

Rules:

- Cards should normally use `8px` or less.
- Use `12px` only for large floating surfaces where softness improves focus.
- Do not mix many radius values inside the same component family.

## 9. Shadow System

Shadows must be subtle and primarily communicate elevation over dark surfaces.

| Token | Value | Usage |
| --- | --- | --- |
| `shadow.sm` | `0 1px 2px rgba(0, 0, 0, 0.32)` | Slight lift on controls and cards |
| `shadow.md` | `0 8px 24px rgba(0, 0, 0, 0.28)` | Dropdowns, popovers, floating toolbars |
| `shadow.lg` | `0 16px 48px rgba(0, 0, 0, 0.36)` | Drawers and larger elevated panels |
| `shadow.floating` | `0 20px 64px rgba(0, 0, 0, 0.42)` | Command palette and contextual overlays |
| `shadow.modal` | `0 24px 80px rgba(0, 0, 0, 0.50)` | Modal windows |
| `shadow.popover` | `0 10px 32px rgba(0, 0, 0, 0.34)` | Menus and temporary context panels |

Rules:

- Pair shadows with borders on dark surfaces for crisp separation.
- Do not use colored shadows.
- Avoid stacking multiple heavy shadows.

## 10. Iconography

Recommended library: Lucide.

Lucide is a strong fit because it is open source, consistent, readable at small sizes, and aligned with professional developer tools. Its simple outline style works well in a monochrome interface.

Icon rules:

- Default size: `16px`
- Dense control size: `14px`
- Large navigation size: `20px`
- Empty state size: `32px`
- Default stroke width: `1.75px`
- Large or empty state stroke width: `1.5px`
- Icon button padding: `8px` for 32px controls, `10px` for 36px controls
- Icons inherit current text color unless showing semantic status.
- Use one icon style across the product. Do not mix filled, duotone, and outline families.
- Every icon-only button must have a tooltip and accessible label.

## 11. Component System

All components share the following base states unless otherwise noted:

- Default
- Hover
- Pressed
- Focused
- Selected or active where applicable
- Disabled
- Loading where applicable
- Error where applicable

Keyboard focus uses a visible `1px` or `2px` focus ring in `state.focus`, offset by `2px` where space allows.

### 11.1 Button

Purpose: Trigger primary, secondary, tertiary, or destructive actions.

Variants:

- Primary: High-emphasis monochrome action, filled with `gray.100` and dark text.
- Secondary: Bordered action on transparent or surface background.
- Ghost: Low-emphasis action for toolbars and row actions.
- Destructive: Danger action using `danger` text or subtle `danger.bg`.

Sizes:

- Small: 28px height, 12px horizontal padding, `type.button`
- Medium: 32px height, 14px horizontal padding, `type.button`
- Large: 40px height, 18px horizontal padding, `body-md` medium weight

States:

- Hover: Slight background shift, no layout movement.
- Pressed: Darker or lower-contrast fill.
- Disabled: Reduced text contrast, no pointer interaction.
- Loading: Spinner replaces leading icon or appears before label.

Usage rules:

- Use one primary button per focused region.
- Prefer icon plus text for commands that benefit from recognition.
- Use destructive styling only at the confirmation point.

Accessibility:

- Minimum hit area: 32px, with 40px preferred for primary actions.
- Button label must describe the action, not the destination only.
- Loading buttons should announce progress when action duration exceeds one second.

Interaction:

- Click triggers immediately unless destructive or irreversible.
- Enter and Space activate focused buttons.

### 11.2 Icon Button

Purpose: Trigger compact commands in toolbars, tables, editors, and navigation.

Variants: Ghost, subtle filled, selected, destructive.

Sizes:

- Small: 28px square, 14px icon
- Medium: 32px square, 16px icon
- Large: 36px square, 18px icon

States: Default, hover, pressed, focused, selected, disabled, loading.

Usage rules:

- Use tooltips for every icon-only button.
- Do not use ambiguous icons without a label nearby.
- Group related icon buttons with `space.4` or `space.8`.

Accessibility:

- Include an accessible name.
- Preserve keyboard order matching visual order.

Interaction:

- Tooltip appears after 500ms hover or focus.
- Selected state persists until mode or selection changes.

### 11.3 Input

Purpose: Capture short text, names, filters, paths, tokens, IDs, URLs, and values.

Variants: Default, search, with leading icon, with trailing action, read-only, error.

Sizes:

- Small: 28px height
- Medium: 34px height
- Large: 40px height

States: Default, hover, focused, filled, disabled, read-only, error.

Usage rules:

- Use labels for persisted fields.
- Use placeholders only as examples, not as labels.
- Use monospace for code-like values.

Accessibility:

- Connect labels and descriptions with form semantics.
- Error text must be visible and programmatically associated.

Interaction:

- Focus border changes to `border.strong` plus focus ring when keyboard focused.
- Escape clears transient search fields when appropriate.

### 11.4 Textarea

Purpose: Capture longer plain text, notes, comments, AI instructions, SQL, JSON, and snippets.

Variants: Plain text, code, resizable, fixed height, error, read-only.

Sizes:

- Compact: 96px min height
- Standard: 144px min height
- Large: 240px min height

States: Same as Input.

Usage rules:

- Use monospace for code, payloads, and queries.
- Preserve whitespace for code-like content.
- Avoid auto-growing beyond the visible workspace without scroll containment.

Accessibility:

- Provide clear labels and error feedback.
- Ensure keyboard users can move focus out of code textareas.

Interaction:

- Support Tab insertion only in explicit code-editing contexts.
- Command/Ctrl + Enter may submit comments or prompts when documented by proximity.

### 11.5 Dropdown

Purpose: Reveal a temporary list of actions or options.

Variants: Action menu, option menu, nested menu, profile menu.

Sizes:

- Min width: 180px
- Item height: 32px
- Dense item height: 28px

States: Open, closed, highlighted, disabled, checked, danger item.

Usage rules:

- Use for actions, not long data selection.
- Keep destructive actions separated by a divider.
- Place keyboard shortcuts at the right edge in muted text.

Accessibility:

- Use menu semantics for actions.
- Arrow keys navigate, Enter selects, Escape closes.

Interaction:

- Opens from click or keyboard.
- Closes after selection unless the action toggles a setting.

### 11.6 Select

Purpose: Choose one value from a bounded list.

Variants: Default, compact, searchable, multi-select.

Sizes: Small 28px, medium 34px, large 40px.

States: Default, hover, open, focused, selected, disabled, error.

Usage rules:

- Use Select when the current value matters after choice.
- Use Command Palette or Search when options are numerous or cross-domain.

Accessibility:

- Label required for forms.
- Typeahead should work for long option sets.

Interaction:

- Click opens list.
- Arrow keys navigate.
- Enter commits selection.

### 11.7 Checkbox

Purpose: Toggle one or more independent boolean values.

Variants: Unchecked, checked, indeterminate.

Sizes:

- Control: 16px
- Hit area: at least 32px

States: Default, hover, focused, checked, indeterminate, disabled, error.

Usage rules:

- Use for multi-select and independent settings.
- Align checkbox with the first text baseline.

Accessibility:

- Label must be clickable.
- Indeterminate state must be exposed programmatically.

Interaction:

- Space toggles focused checkbox.

### 11.8 Radio

Purpose: Select exactly one option from a small set.

Variants: Unselected, selected.

Sizes:

- Control: 16px
- Hit area: at least 32px

States: Default, hover, focused, selected, disabled.

Usage rules:

- Use when all choices should be visible.
- Avoid radio groups with more than seven options.

Accessibility:

- Group must have an accessible label.
- Arrow keys move between options.

Interaction:

- Click or Space selects the option.

### 11.9 Switch

Purpose: Toggle an immediate on/off setting.

Variants: Off, on, disabled.

Sizes:

- Small: 28px by 16px
- Medium: 36px by 20px

States: Default, hover, focused, on, off, disabled.

Usage rules:

- Use only for settings that apply immediately.
- Do not use for form submission choices that need review.

Accessibility:

- Expose as switch with checked state.
- Label must explain what changes when enabled.

Interaction:

- Space toggles focused switch.

### 11.10 Tabs

Purpose: Switch between related views at the same hierarchy level.

Variants: Underline, pill, sidebar tabs, segmented tabs.

Sizes:

- Compact: 28px height
- Standard: 34px height

States: Default, hover, active, focused, disabled.

Usage rules:

- Use tabs for sibling views, not step-by-step flows.
- Keep labels short and stable.
- Use badges only for counts or status.

Accessibility:

- Use tablist, tab, and tabpanel semantics.
- Arrow keys move focus between tabs.

Interaction:

- Selection should update immediately on click.

### 11.11 Badge

Purpose: Communicate status, count, priority, or small metadata.

Variants: Neutral, success, warning, danger, info.

Sizes:

- Small: 18px height
- Medium: 22px height

States: Default, hover only when interactive, selected when filterable.

Usage rules:

- Use neutral badges for counts, labels, and module metadata.
- Use color only for semantic state.
- Keep text to one or two words.

Accessibility:

- Do not rely on color alone. Include status text.

Interaction:

- Non-interactive badges do not show hover states.

### 11.12 Chip

Purpose: Represent compact selected values, filters, assignees, labels, or removable terms.

Variants: Default, removable, selectable, avatar chip, status chip.

Sizes: 24px and 28px height.

States: Default, hover, selected, focused, disabled.

Usage rules:

- Use chips for user-selected values that can be edited.
- Include a close icon only when removal is available.

Accessibility:

- Remove action needs a separate accessible label.

Interaction:

- Backspace may remove the focused chip in tokenized inputs.

### 11.13 Tag

Purpose: Classify items with persistent metadata such as area, stack, team, or release.

Variants: Neutral, outlined, compact.

Sizes: 20px and 24px height.

States: Default, hover only when clickable, selected when filtering.

Usage rules:

- Tags are more persistent than chips.
- Avoid colorful tag systems inside the monochrome product.

Accessibility:

- Tag meaning must be readable from text.

Interaction:

- Clickable tags filter or navigate to the tag view.

### 11.14 Tooltip

Purpose: Provide short explanatory text for icons, truncated content, and compact controls.

Variants: Label-only, label with shortcut, description.

Sizes:

- Max width: 280px
- Padding: 8px 10px

States: Hidden, visible.

Usage rules:

- Use for secondary help, not critical instructions.
- Keep tooltip text under two short lines.

Accessibility:

- Tooltip content should be available on keyboard focus.
- Do not place interactive controls inside tooltips.

Interaction:

- Show after 500ms hover or focus.
- Hide on pointer leave, Escape, or blur.

### 11.15 Toast

Purpose: Confirm transient system feedback without blocking work.

Variants: Neutral, success, warning, danger, info, action toast.

Sizes:

- Width: 320px to 420px
- Padding: 14px 16px

States: Entering, visible, exiting, paused on hover.

Usage rules:

- Use for completed actions, sync results, copied content, and recoverable errors.
- Avoid stacking more than three toasts.
- Provide Undo for reversible destructive actions.

Accessibility:

- Use polite live region for normal updates.
- Use assertive only for urgent errors.

Interaction:

- Auto-dismiss after 4 to 6 seconds.
- Persist while hovered or focused.

### 11.16 Alert

Purpose: Present persistent contextual feedback or risk.

Variants: Neutral, success, warning, danger, info.

Sizes: Inline, panel, full-width.

States: Default, dismissible, loading, expanded.

Usage rules:

- Use alerts for information the user must notice before proceeding.
- Keep action buttons inside alert minimal.

Accessibility:

- Include role status or alert depending on urgency.
- Icon and text must both communicate severity.

Interaction:

- Dismissible alerts should not return unless conditions change.

### 11.17 Card

Purpose: Group related content or actions as a reusable unit.

Variants: Default, interactive, selected, compact, notification, metric.

Sizes:

- Padding: 16px or 20px
- Radius: 8px
- Gap: 12px to 16px

States: Default, hover if interactive, selected, focused, disabled, loading.

Usage rules:

- Use cards for repeated items, notifications, and contained widgets.
- Do not nest cards inside cards.
- Do not use cards as generic page sections.

Accessibility:

- Interactive cards need clear focus and activation behavior.
- Avoid making every child separately focusable unless needed.

Interaction:

- Entire card may open details if no inner controls conflict.

### 11.18 Modal

Purpose: Require focused user attention for confirmation, creation, editing, or critical decisions.

Variants: Confirmation, form, detail, destructive, command-like.

Sizes:

- Small: 400px
- Medium: 560px
- Large: 760px
- Max height: 80vh

States: Opening, open, closing, loading, error.

Usage rules:

- Use modals sparingly for blocking decisions.
- Keep destructive confirmations explicit and specific.
- Primary action belongs bottom-right; cancel belongs to its left.

Accessibility:

- Trap focus inside modal.
- Restore focus to the triggering element on close.
- Escape closes unless a critical unsaved state requires confirmation.

Interaction:

- Backdrop click may close non-critical modals.
- Form submit supports Enter when focus is in a single-line field.

### 11.19 Drawer

Purpose: Show related detail, properties, filters, or AI context without leaving the current workspace.

Variants: Right inspector, left navigation drawer, bottom logs drawer.

Sizes:

- Right: 360px default, 480px wide
- Bottom: 280px default height

States: Opening, open, resizing, closing, loading.

Usage rules:

- Use drawers for secondary workflows that preserve main context.
- Allow resizing for logs, AI output, and database inspectors.

Accessibility:

- Focus should move into drawer when opened intentionally.
- Escape closes temporary drawers.

Interaction:

- Drawer can be pinned when used as a persistent inspector.

### 11.20 Popover

Purpose: Display lightweight contextual controls or information.

Variants: Filter popover, date picker, quick edit, preview, settings.

Sizes:

- Min width: 240px
- Max width: 420px

States: Open, closed, focused, loading.

Usage rules:

- Use for compact contextual workflows.
- Do not place long forms or complex multi-step flows inside popovers.

Accessibility:

- Manage focus according to whether content is interactive.
- Escape closes and restores focus.

Interaction:

- Close on outside click unless interacting with related trigger controls.

### 11.21 Avatar

Purpose: Represent a user, bot, team, or integration.

Variants: Image, initials, bot, integration, stacked.

Sizes:

- XS: 20px
- SM: 24px
- MD: 32px
- LG: 40px

States: Default, online, away, busy, selected.

Usage rules:

- Use initials fallback when image is unavailable.
- Use status dots only when presence matters.

Accessibility:

- Provide accessible user or entity name.
- Decorative repeated avatars can be hidden from screen readers when the name appears nearby.

Interaction:

- Clicking may open profile, assignee menu, or integration details.

### 11.22 Breadcrumb

Purpose: Show hierarchy and enable quick navigation.

Variants: Text, icon-leading, collapsed, path-like.

Sizes: 28px height, `body-sm`.

States: Default, hover, active current page, focused.

Usage rules:

- Use for nested projects, repositories, database paths, API collections, and docs.
- Collapse middle segments when space is constrained.

Accessibility:

- Use navigation landmark with ordered hierarchy.

Interaction:

- Click parent segments to navigate.
- Current segment is not interactive unless it opens a menu.

### 11.23 Sidebar

Purpose: Provide persistent workspace navigation across product modules.

Variants: Expanded, collapsed, workspace switcher, nested navigation.

Sizes:

- Expanded width: 264px
- Collapsed width: 72px
- Row height: 32px

States: Default, hover, active, focused, collapsed, disabled.

Usage rules:

- Keep module names stable and predictable.
- Use monochrome icons and text.
- Use counts sparingly and align them consistently.
- Logo appears at the top as the identity anchor.

Accessibility:

- Navigation must be keyboard reachable.
- Collapsed icon items require tooltips and accessible labels.

Interaction:

- Active item uses `state.selected`.
- Nested groups expand inline with subtle motion.

### 11.24 Top Navigation

Purpose: Provide global context, search, command access, sync state, and account controls.

Variants: Standard, dense editor, split-pane workspace.

Sizes:

- Height: 48px default
- Dense: 40px

States: Default, scrolled, focused, loading, offline.

Usage rules:

- Keep top navigation quiet and utility-focused.
- Avoid duplicate navigation already in sidebar.
- Show global search or command trigger prominently.

Accessibility:

- Global search and command palette must be reachable by keyboard.

Interaction:

- Sync/status indicators open details on click.
- Account controls open a profile menu.

### 11.25 Search Bar

Purpose: Find or filter tasks, code context, projects, requests, snippets, and database entities.

Variants: Global search, local filter, command search, table filter.

Sizes:

- Compact: 32px height
- Standard: 40px height

States: Empty, typing, focused, loading, results, no results, error.

Usage rules:

- Use local search for filtering visible collections.
- Use global search for cross-workspace retrieval.
- Show scope clearly.

Accessibility:

- Announce result counts when results update.
- Provide clear labels even when visually compact.

Interaction:

- Escape clears query first, then closes transient search.
- Command/Ctrl + K opens global search or command palette.

### 11.26 Command Palette

Purpose: Execute commands, navigate anywhere, search workspace content, and invoke AI actions.

Variants: Global command, scoped command, AI command.

Sizes:

- Width: 640px default
- Max height: 70vh
- Row height: 44px

States: Empty, typing, loading, results, no results, error.

Usage rules:

- Command palette is the fastest route through the product.
- Group results by type only when it improves scanning.
- Show keyboard shortcuts where available.

Accessibility:

- Use combobox/listbox semantics.
- Announce highlighted result and count changes.

Interaction:

- Command/Ctrl + K opens.
- Arrow keys navigate.
- Enter selects.
- Escape closes.

### 11.27 Context Menu

Purpose: Provide contextual actions for selected objects.

Variants: Row menu, editor menu, canvas menu, file/repo menu.

Sizes:

- Min width: 200px
- Item height: 30px

States: Open, highlighted, disabled, checked, danger item.

Usage rules:

- Keep items relevant to the selected object.
- Avoid duplicating full toolbar sets.
- Separate destructive actions.

Accessibility:

- Keyboard equivalent actions should exist for common commands.
- Right-click and keyboard menu key should both open where supported.

Interaction:

- Right-click opens at cursor.
- Escape closes.

### 11.28 Table

Purpose: Display structured data such as tasks, issues, Git changes, database records, API responses, and team activity.

Variants: Data table, editable table, selectable table, tree table, virtualized table.

Sizes:

- Header height: 36px
- Row height: 40px default
- Dense row height: 32px

States: Default, hover row, selected row, focused cell, editing, loading, empty, error.

Usage rules:

- Use sticky headers for long tables.
- Right-align numeric values.
- Use monospace for IDs, hashes, endpoints, and technical values.
- Support column resizing and sorting when data density demands it.

Accessibility:

- Use table semantics for tabular data.
- Provide keyboard navigation for editable grids.

Interaction:

- Click row selects or opens depending on context.
- Double-click may enter edit mode in editable tables.

### 11.29 List

Purpose: Display ordered or grouped objects such as tasks, branches, snippets, requests, files, and notifications.

Variants: Simple list, grouped list, selectable list, draggable list, virtualized list.

Sizes:

- Compact row: 36px
- Standard row: 44px
- Rich row: 56px to 72px

States: Default, hover, selected, focused, dragging, loading, empty.

Usage rules:

- Use lists when each item has a primary title and supporting metadata.
- Keep row alignment consistent across modules.
- Use drag handles only when reordering is enabled.

Accessibility:

- Expose selection and drag state.
- Preserve logical keyboard order.

Interaction:

- Single click selects.
- Enter opens.
- Space toggles selection in multi-select mode.

### 11.30 Empty State

Purpose: Explain that no content exists, no results match, or setup is required.

Variants: First-run, no results, permission needed, offline, error empty.

Sizes:

- Compact panel
- Full workspace

States: Default, loading to empty, actionable.

Usage rules:

- Keep text concise and useful.
- Provide one primary action when possible.
- Avoid decorative illustration inside operational screens.

Accessibility:

- Empty state title and action must be reachable in reading order.

Interaction:

- Primary action starts the next logical workflow.

### 11.31 Loading State

Purpose: Communicate that content or an operation is in progress.

Variants: Spinner, inline loading, skeleton, progress, optimistic loading.

Sizes:

- Inline spinner: 14px
- Button spinner: 14px to 16px
- Page spinner: 24px

States: Loading, delayed, partial content, timeout, error.

Usage rules:

- Use skeletons for structured content loading.
- Use spinners for actions with unknown shape.
- Show meaningful progress for long operations.

Accessibility:

- Announce long operations.
- Do not trap focus during background loading.

Interaction:

- Keep the interface usable when background sync is running.

### 11.32 Skeleton

Purpose: Reserve layout space while content loads.

Variants: Text line, avatar, card, table row, list row.

Sizes: Match the dimensions of final content.

States: Static, shimmer, reduced-motion static.

Usage rules:

- Skeletons should mirror final layout closely.
- Do not show skeletons for instant loads under 300ms.

Accessibility:

- Hide decorative skeleton shapes from screen readers.
- Respect reduced motion preferences.

Interaction:

- Skeletons are non-interactive.

### 11.33 Progress Bar

Purpose: Show completion of sync, import, export, AI processing, migration, or build activity.

Variants: Determinate, indeterminate, segmented, inline.

Sizes:

- Thin: 4px
- Standard: 6px
- Large: 8px

States: In progress, paused, complete, error.

Usage rules:

- Use determinate progress whenever the system can estimate work.
- Use monochrome progress unless semantic status is required.

Accessibility:

- Expose value, min, max, and label.
- Announce completion for long-running operations.

Interaction:

- Progress bars are not interactive unless paired with cancel or pause controls.

### 11.34 Calendar Widget

Purpose: Select dates, schedule tasks, view due dates, and inspect time-based work.

Variants: Date picker, date range picker, mini month, agenda.

Sizes:

- Date picker width: 280px
- Day cell: 32px

States: Today, selected, range start, range end, disabled, unavailable, focused.

Usage rules:

- Use monochrome selection for active dates.
- Use status color only for semantic deadlines or warnings.
- Show week starts according to user locale.

Accessibility:

- Use grid semantics.
- Arrow keys move day focus.
- Page Up/Down moves month where supported.

Interaction:

- Click selects date.
- Range selection previews on hover after start date selection.

### 11.35 Notification Card

Purpose: Present workspace events such as mentions, reviews, sync issues, automation results, and AI updates.

Variants: Mention, task update, Git update, database update, API failure, AI suggestion.

Sizes:

- Compact: 56px min height
- Standard: 72px min height

States: Unread, read, hover, selected, dismissed, archived.

Usage rules:

- Use subtle unread indicators, not large colored blocks.
- Include source, title, timestamp, and one clear action when needed.
- Group noisy system events.

Accessibility:

- Announce unread state in text.
- Actions must be keyboard reachable.

Interaction:

- Click opens the source object.
- Secondary action may archive or mark as read.

## 12. Motion System

Motion should feel precise, fast, and calm. It exists to clarify state changes, not to entertain.

### 12.1 Duration Tokens

| Token | Duration | Usage |
| --- | ---: | --- |
| `motion.instant` | 80ms | Pressed states, tiny feedback |
| `motion.fast` | 120ms | Hover, focus, selected states |
| `motion.base` | 180ms | Popovers, dropdowns, tooltips |
| `motion.slow` | 240ms | Drawers and modal entrances |
| `motion.page` | 320ms | Major view transitions only |

### 12.2 Easing Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `ease.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most UI transitions |
| `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Closing and dismissing |
| `ease.emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | Modals, command palette, drawers |

### 12.3 Motion Rules

- Hover: 120ms background or border transition.
- Click: Immediate pressed state, then action.
- Open: Fade plus 4px to 8px translate where spatially useful.
- Close: Faster fade and reverse translate.
- Page transition: Use only for major navigation, never for routine panel updates.
- Loading: Prefer skeleton shimmer only when it improves perceived structure.
- Focus: Focus ring appears immediately or within 80ms.
- Reduced motion: Disable shimmer, translate, and non-essential motion.

## 13. Accessibility

### 13.1 Targets

- Minimum hit target: 32px by 32px for desktop controls.
- Preferred target: 40px by 40px for high-frequency and primary actions.
- Dense table controls may visually be smaller if the interactive hit area remains at least 32px.

### 13.2 Contrast

- Normal text: Minimum 4.5:1 contrast ratio.
- Large text: Minimum 3:1 contrast ratio.
- Icons and controls: Minimum 3:1 against adjacent background.
- Critical states and destructive actions should target stronger contrast when feasible.

### 13.3 Keyboard Navigation

- Every interactive element must be reachable by keyboard.
- Focus order follows visual order.
- Modal, drawer, popover, dropdown, and command palette focus behavior must be explicit.
- Escape closes transient overlays.
- Enter activates primary selected actions.
- Space toggles checkboxes, switches, and selected row states where applicable.

### 13.4 Focus Indicators

- Keyboard focus must be visible across all surfaces.
- Use `state.focus` ring with at least 1px thickness.
- Do not rely on hover styling as focus styling.
- Focus rings must not be clipped by parent containers.

### 13.5 Screen Reader Considerations

- Provide semantic roles for menus, tables, tabs, dialogs, alerts, and command results.
- Icon-only buttons need accessible labels.
- Status updates should use live regions appropriate to urgency.
- Loading skeletons should be hidden from screen readers.
- Error messages must be associated with the field or region they describe.

## 14. Implementation Tokens

Recommended CSS custom properties:

```css
:root {
  --bg-app: #0b0b0b;
  --bg-workspace: #141414;
  --bg-secondary: #1c1c1c;
  --surface-base: #1c1c1c;
  --surface-elevated: #242424;
  --surface-sidebar: #111111;
  --surface-nav: #171717;
  --surface-card: #1f1f1f;
  --surface-input: #181818;

  --border-default: #333333;
  --border-subtle: #262626;
  --border-strong: #4a4a4a;
  --divider: #2a2a2a;

  --text-primary: #e6e6e6;
  --text-secondary: #a8a8a8;
  --text-muted: #858585;
  --text-disabled: #666666;
  --text-placeholder: #666666;

  --state-hover: #262626;
  --state-pressed: #303030;
  --state-selected: #2d2d2d;
  --state-focus: #f5f5f5;
  --state-skeleton: #262626;
  --state-skeleton-highlight: #333333;

  --success: #4ade80;
  --success-bg: rgba(74, 222, 128, 0.12);
  --warning: #facc15;
  --warning-bg: rgba(250, 204, 21, 0.12);
  --danger: #f87171;
  --danger-bg: rgba(248, 113, 113, 0.12);
  --info: #60a5fa;
  --info-bg: rgba(96, 165, 250, 0.12);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 999px;
}
```

## 15. Product Composition Guidelines

### 15.1 Primary Shell

The default application shell should use:

- Left sidebar for workspace and module navigation.
- Top navigation for global search, command palette, sync state, and account controls.
- Main content area for the active module.
- Optional right inspector for properties, AI context, or selected object detail.

### 15.2 Module Consistency

Every module should follow the same foundational structure:

- Page title and local actions.
- Filter or search row where needed.
- Primary content surface: table, list, editor, split pane, or board.
- Contextual inspector for selected object details.
- Consistent empty, loading, and error states.

### 15.3 Developer Workspace Specifics

- Git, API, database, and snippet workflows should use monospace where technical accuracy matters.
- AI assistant content should use readable body text, with code blocks in monospace.
- Dense data should prioritize alignment, sticky headers, keyboard navigation, and copy actions.
- Multi-pane layouts should preserve context and reduce navigation churn.

## 16. Quality Bar

A screen is considered design-system compliant when:

- It uses only approved typography tokens.
- It uses only approved monochrome and semantic status colors.
- It follows the spacing and radius system.
- It has clear hover, focus, selected, disabled, loading, and error states.
- It supports keyboard navigation.
- It meets contrast requirements.
- It uses the logo without modification.
- It avoids decorative color, heavy shadow, trendy gradients, and unnecessary visual noise.

