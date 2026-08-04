# Primordial Task Analytics & Reporting Specification

Version: 1.0  
Phase: 10  
Owner: Primordial Studio  
Product: Primordial Task  
Platform: Desktop application  
Depends on: [Phase 01 Design System](./DESIGN_SYSTEM.md), [Phase 04 Workspace Management](./WORKSPACE_MANAGEMENT.md), [Phase 05 Project Management](./PROJECT_MANAGEMENT.md), [Phase 06 Task Management](./TASK_MANAGEMENT.md)

---

## 1. Product Intent

The Analytics & Reporting module transforms raw workspace data into actionable insights. It serves as the decision-making center of Primordial Task, helping teams understand project progress, detect risks, manage workloads, and improve productivity. It moves beyond simple lists to show the "Why" and "What's Next" of project management.

---

## 2. Design Philosophy

- **Minimalist Precision**: Data is the hero. Charts should have no "junk" (excessive borders, heavy shadows, or decorative gradients).
- **Professional Clarity**: Every chart must answer a specific business question.
- **Speed**: Instant data visualization. Charts should render in <200ms using cached or incremental data.
- **Elegance**: Follow the monochrome palette strictly. Use subtle shades of gray to distinguish data series.
- **Actionable**: Analytics should lead to action (e.g., clicking a "Risk" card opens the affected task).

---

## 3. Design Language

Follows **Phase 01 Design System**:
- **Theme**: Dark Mode only.
- **Palette**: Monochrome (`gray.0` to `gray.950`).
- **Typography**: Inter for UI, JetBrains Mono for data points/KPIs.
- **Spacing**: 8pt grid system.
- **Components**: `radius.md` for controls, `radius.lg` for dashboard cards.

---

## 4. User Flow

```text
Workspace Selection
  ↓
Analytics Overview (High-level KPIs)
  ↓
Module Drill-down (Workspace, Project, Team, or Time)
  ↓
Custom Filters (Refining the Scope)
  ↓
AI Insight Panel (Automated Analysis)
  ↓
Report Generation (Customizing Layout)
  ↓
Export / Share (PDF, CSV, or Link)
```

**Transitions**:
- **Dashboard to Detail**: Clicking a KPI card or chart bar drill-downs into a filtered view of the specific data.
- **Filter to Refresh**: Updating a date range or project filter triggers a localized data refresh with skeleton loading states.
- **Analysis to Report**: Selecting "Generate Report" from any view pre-populates a report template with the active charts and filters.

---

## 5. Required Screens

### 5.1 Analytics Dashboard (Executive Overview)

- **Purpose**: Provide a high-level summary of workspace health and performance for leadership.
- **Business Rules**: 
  - Displays data aggregated across all accessible projects.
  - Defaults to a "Last 30 Days" view.
- **Layout**: 
  - **Top Row**: 4-5 KPI Cards (Workspace Health, Active Projects, Completion Rate, Overdue Ratio).
  - **Middle Row**: Main Productivity Chart (Line/Area) and Project Health Distribution (Donut).
  - **Bottom Row**: Team Workload Heatmap and AI Risk Summary.
- **Components**: `KPICard`, `TrendLineChart`, `DonutChart`, `WorkloadHeatmap`, `AIPanel`.
- **Interactions**: 
  - Hover over charts for precise data tooltips.
  - Click a KPI card to navigate to the detailed module.
  - Toggle "AI Summary" for a natural language explanation of the data.
- **Validation**: Date range must be valid; prevents comparing non-comparable metrics.
- **Accessibility**: ARIA labels for all SVG elements; focusable chart legends.
- **Database Relationships**: Aggregates from `Workspaces`, `Projects`, `Tasks`, and `TimeEntries`.
- **API Requirements**: `GET /analytics/dashboard?range=...`
- **State Management**: Persist `activeRange` and `preferredCurrency/Units`.
- **Realtime Behavior**: Polling or WebSockets for live KPI updates (e.g., as tasks are completed).
- **Offline Strategy**: Use stale-while-revalidate; show cached dashboard if offline.
- **Security**: Strict role-based visibility; Guests only see data for projects they are in.
- **Performance**: Pre-aggregate common metrics in a dedicated analytics table or materialized view.
- **UX Reasoning**: Executives need "at-a-glance" status without diving into details immediately.
- **Developer Notes**: Use `Recharts` or `D3.js` for custom monochrome visualization.
- **Frontend Notes**: Implement skeleton frames for each widget individually to allow partial loading.
- **Backend Notes**: Use Redis to cache dashboard results for 5-10 minutes.
- **Data Engineering Notes**: Aggregate data asynchronously to avoid blocking primary write DB.

### 5.2 Workspace Analytics

- **Purpose**: Detailed breakdown of workspace-level metrics and growth trends.
- **KPIs & Calculations**:
  - **Productivity Score**: (Completed Tasks / Total Tasks) * Weight(Priority).
  - **Average Resolution Time**: Mean time from Task Creation to Completion.
  - **Growth Trend**: Month-over-month increase in project/task volume.
- **Layout**: Full-page view with specialized tables for Project ranking and Member contribution.
- **Interactions**: Compare two workspace time periods (e.g., Q3 vs Q4).
- **Developer Notes**: Requires efficient multi-project join queries.
- **QA Notes**: Verify accuracy of "Resolution Time" against manual calculations.

### 5.3 Project Analytics

- **Purpose**: Health and velocity tracking for a specific project.
- **KPIs & Calculations**:
  - **Project Progress**: % of completed milestones.
  - **Velocity**: Average tasks completed per week.
  - **Risk Score**: (Overdue Tasks * 0.5) + (Blocked Tasks * 0.5) / Total Tasks.
- **Layout**:
  - **Burn-up/Burn-down Chart**: Visualizing work remaining vs time.
  - **Status Breakdown**: Bar chart of tasks by status (To Do, In Progress, Review, Done).
- **Interactions**: Click a "Blocked" bar to list specific tasks in a side drawer.
- **UX Reasoning**: Project Managers need to see "friction" points (Blocked/Overdue) clearly.

### 5.4 Task Analytics

- **Purpose**: Analyzing the lifecycle and distribution of tasks.
- **KPIs & Calculations**:
  - **Throughput**: Number of tasks entering vs exiting the workflow.
  - **Cycle Time**: Time spent in specific statuses (e.g., "In Review").
- **Layout**:
  - **Priority Donut**: Tasks by High/Medium/Low priority.
  - **Lead Time Scatterplot**: Visualizing resolution time for individual tasks.
- **Developer Notes**: Store timestamp history for every task status change.

### 5.5 Team Analytics (Workload & Capacity)

- **Purpose**: Balancing team effort and preventing burnout.
- **KPIs & Calculations**:
  - **Capacity**: Assigned vs Max tasks (based on historical velocity).
  - **Focus Time**: Time tracked on tasks vs total work hours.
- **Layout**:
  - **Member Comparison Bar Chart**: Tasks assigned/completed per member.
  - **Availability Grid**: Weekly view of team member load.
- **Security**: Sensitive time/productivity data may be restricted to Admin/Manager roles.
- **UX Reasoning**: Avoid "Big Brother" vibes; focus on identifying overloaded members to redistribute work.

### 5.6 Time Tracking Analytics

- **Purpose**: Financial and operational analysis of time spent.
- **KPIs & Calculations**:
  - **Estimated vs Actual**: Accuracy ratio of initial task estimates.
  - **Idle Time**: Time during work hours without task tracking.
- **Layout**: 
  - **Time Log Heatmap**: Visualizing work hours across the week.
  - **Project Time Distribution**: Donut chart of hours spent per project.
- **Developer Notes**: Integrates with Phase 07 (Calendar/Time Tracking).

### 5.7 Reports

- **Purpose**: Formalize and share data insights.
- **Generation**: Automated generation based on templates (Weekly, Monthly, Sprint).
- **Layout**: A document-like view combining charts, tables, and AI-generated summaries.
- **Interactions**: "Configure Report" to toggle which charts and project data are included.
- **Export**: PDF, XLSX, CSV.
- **UX Reasoning**: Reports are for external stakeholders or archival; they must look "Print-Ready".

---

## 6. KPI System (Formulas)

- **Workspace Health (%)**: `(On-Track Projects / Total Projects) * 100`
- **Project Health (0-100)**: Weighted average of Progress (40%), Deadline Risk (30%), and Blocked Status (30%).
- **Productivity Score**: `(Tasks Completed / Tasks Planned) * (1 - (Overdue Ratio))`
- **Focus Score (0-10)**: `Tracked Task Time / (Work Day Hours - Non-Task Time)`
- **Task Velocity**: `Tasks Completed / Time Unit (Week/Sprint)`
- **Overdue Rate**: `(Overdue Tasks / Total Open Tasks) * 100`
- **Blocked Ratio**: `(Blocked Tasks / Total Open Tasks) * 100`
- **Member Capacity (%)**: `(Current Estimated Work / Average Velocity) * 100`

---

## 7. Chart Types

- **Line / Area Chart**: Used for trends over time (Productivity, Velocity).
- **Bar Chart**: Used for comparisons between members, projects, or categories.
- **Stacked Bar**: Used for status distribution across multiple projects.
- **Donut / Pie Chart**: Used for simple distributions (Priority, Tags).
- **Heatmap**: Used for time distribution (Activity, Workload).
- **Scatterplot**: Used for Cycle Time vs Task Complexity.
- **Progress Ring**: Used for individual KPI targets (e.g., "75% of goal").
- **KPI Card**: Large monochrome numbers with a small trend indicator (+/- %).

---

## 8. Filter System

- **Universal Filters**: Date Range (Preset: 7d, 30d, 90d, QTD, YTD; Custom).
- **Scope Filters**: Workspace, Project, Sprint, Team.
- **Attribute Filters**: Status, Priority, Tags, Member, Label.
- **Saved Filters**: Ability for users to save complex filter sets (e.g., "High Priority Blocked Tasks this Quarter").

---

## 9. Search Experience

- **Search Content**: Search for specific Reports, Projects, or Members within the Analytics view.
- **Keyboard Shortcut**: `Cmd+K` opens a scoped search for "Jump to Project Analytics".
- **Recent**: Quick access to the last 5 viewed reports.

---

## 10. AI Features

- **Daily Summary**: A 2-sentence natural language brief on workspace performance.
- **Project Risk Detection**: AI identifies projects with high "Risk Scores" before they fail.
- **Deadline Prediction**: "Based on current velocity, Project X is likely to be 4 days late."
- **Burnout Detection**: Alert managers when a member's focus score drops and workload spikes.
- **Sprint Review**: Automated summary of "What we achieved" vs "What we missed".
- **Executive Summary**: 1-page high-level brief for owners.

---

## 11. Automation & Notifications

- **Scheduled Reports**: Send Weekly/Monthly reports to email or Slack automatically.
- **Realtime Refresh**: Dashboard widgets refresh when significant tasks are updated.
- **Alert Rules**: "Notify me when Project Health drops below 50%."
- **Burnout Alerts**: Private notification to the member or manager if capacity is exceeded.

---

## 12. Export System

- **PDF**: High-fidelity, monochrome documents with headers and footers.
- **XLSX / CSV**: Raw data export for external analysis.
- **JSON**: Full data dump for technical audits.
- **Image**: Export individual charts as high-res PNG for slide decks.

---

## 13. UI States (Empty, Error, Loading)

- **Empty States**: "Not enough data yet. Complete more tasks to see analytics."
- **Error States**: "Data aggregation failed. Retrying..." with a manual refresh button.
- **Loading States**: 
  - **Skeletons**: Layout-matching gray blocks for each chart widget.
  - **Incremental**: Charts populate data series as they arrive from the API.

---

## 14. Responsiveness

- **Wide Desktop**: 3-column widget grid.
- **Standard Desktop**: 2-column widget grid.
- **Small Desktop**: Single column stack; sidebar collapses to icons.
- **Ultrawide**: Wide-span charts for long timeline analysis.

---

## 15. Accessibility

- **Color Contrast**: target WCAG 2.1 AA. Since monochrome, use varying luminosity (`gray.100` vs `gray.400`) carefully.
- **Screen Readers**: SVGs must have `title` and `desc` tags; data tables must accompany complex charts via a "View Table" toggle.
- **Keyboard**: Navigate between widgets using `Tab`; use arrow keys to inspect data points within a chart.

---

## 16. Technical & Operational Requirements

### 16.1 Database Relationships

- **AnalyticsEvent**: Tracks granular changes (Status changed, Task completed, Time logged).
- **MetricSnapshot**: Pre-calculated daily aggregations for faster dashboard loading.
- **CustomDashboard**: User-defined layouts of widgets.
- **ReportTemplate**: Configurations for automated reporting.

### 16.2 API Requirements

- `GET /analytics/kpis`: Core numbers.
- `GET /analytics/charts/{type}`: Data series for specific visualizations.
- `POST /reports/generate`: Trigger PDF/CSV creation.
- `GET /analytics/ai/insights`: Natural language analysis.

### 16.3 State Management

- **Realtime**: Use a dedicated `AnalyticsStore` to handle stream of incoming events.
- **Filter State**: Sync filters with URL query params for easy sharing.
- **Optimization**: Debounce chart re-renders when filters change rapidly.

---

## 17. Security

- **Workspace Isolation**: No data leakage between tenants.
- **Role Validation**: Managers see team data; Members only see their own and public project data.
- **Audit Log**: Every export action is logged.

---

## 18. Performance

- **Aggregation Engine**: Move heavy calculations to background workers (Sidekiq/Temporal).
- **Caching**: 5-minute TTL for dashboard KPIs; 1-hour for historical reports.
- **Virtualization**: Use `react-window` for any data tables showing >100 rows.

---

## 19. Business Rules

- **Data Retention**: Aggregated metrics kept forever; raw events pruned after 1 year.
- **Refresh Frequency**: Dashboard refreshes on-focus or every 10 minutes.
- **Aggregation Logic**: Tasks in "Cancelled" or "Archive" are excluded from productivity scores.

---

## 20. Output Summary

The Analytics & Reporting module for Primordial Task provides a professional, high-performance engine for turning project noise into strategic signal. It balances minimalism with deep technical insights, ensuring that every team member, from developer to executive, has the data they need to build better products.
