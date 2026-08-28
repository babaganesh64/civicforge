# SIH #43 — DESIGN SYSTEM & UI/UX SPECIFICATION

## 0. Design Direction

The platform must use a refined enterprise operations aesthetic inspired by the visual qualities discussed from Taskora/Biosynthesia-style interfaces:

- Clean
- Dense but breathable
- Minimal decoration
- Strong hierarchy
- Subtle borders
- White/light surfaces
- Compact controls
- Operational data first
- High-quality tables
- Calm, professional visual language

Do NOT copy another product's branding, logo, proprietary assets or exact screen designs.

---

# 1. Application Shell

Desktop:
- Persistent left sidebar.
- Main content area.
- Top bar.
- Content container with generous but controlled spacing.

Sidebar:
- Product/logo area
- Role-aware navigation
- Primary sections
- Secondary/admin area
- Profile/settings at bottom

Topbar:
- Breadcrumb/page title
- Global search where relevant
- Notifications
- User menu
- Contextual action

Mobile/tablet:
- Collapsible navigation
- Preserve primary actions
- Tables may become horizontally scrollable or transform into responsive cards.

---

# 2. Role-Based Navigation

Citizen:
- Overview
- My Challenges
- Discover
- Notifications
- Profile

University:
- Overview
- Challenge Marketplace
- Projects
- Collaborations
- Deliverables
- Impact
- Analytics
- Settings

Industry:
- Overview
- Opportunities
- Collaborations
- Projects
- Capabilities
- Impact
- Analytics
- Settings

Government:
- Command Center
- Challenges
- Review Queue
- Organizations
- Projects
- Impact
- Analytics
- Operations/Bulk Jobs
- Audit
- Settings

Platform Admin:
- System Overview
- Users
- Organizations
- Taxonomy
- Operations
- Audit
- System Settings

Navigation must be permission-aware.

---

# 3. Design Tokens

Use CSS variables/design tokens.

Typography:
- Modern sans-serif.
- Strong page title.
- Medium-weight section headings.
- Compact table typography.
- High readability.

Spacing:
- Use a consistent 4/8-based spacing scale.
- Avoid random margins.

Radius:
- Small to medium radius.
- Avoid excessive pill-shaped UI.

Borders:
- Subtle borders around cards/tables.
- Use elevation sparingly.

Colors:
- Neutral base.
- One restrained primary accent.
- Semantic success/warning/error/info colors.
- Never rely on color alone to communicate state.

---

# 4. Dashboard Composition

Dashboard layout:
1. Page heading
2. Context/actions
3. KPI cards
4. Primary operational content
5. Secondary analytics/activity

KPI cards:
- Label
- Value
- Trend/change where useful
- Supporting context
- Optional icon
- Clickable only if it navigates to a meaningful filtered view

Do not fill the screen with decorative charts.

---

# 5. Government Command Center

Hero area:
- "Command Center"
- Short operational summary
- Main actions

KPI row:
- Total challenges
- Pending review
- High priority
- Active projects
- At-risk projects
- Deployed

Primary grid:
- Review queue table
- Priority challenges
- Geographic/trend visualization

Secondary:
- Project health
- Assignment workload
- Recent activity
- Alerts

---

# 6. University Dashboard

Top:
- University identity/context
- KPIs
- Recommended challenge CTA

Sections:
- Recommended challenges
- Active projects
- Upcoming milestones
- Collaboration requests
- Deliverables
- Impact

The interface must feel like a unified institutional workspace, not a student portal.

---

# 7. Industry Dashboard

Sections:
- Recommended opportunities
- Active collaborations
- Requests
- Capability matches
- Supported projects
- Impact/outcomes

Primary CTA:
- Explore opportunities / express interest.

---

# 8. Citizen Dashboard

Simple and less dense than institutional dashboards.

Cards:
- Submitted
- Under review
- Verified
- In progress
- Resolved/deployed

Main:
- My challenge list
- Timeline/status tracker
- Clarifications
- Notifications

---

# 9. Operational Data Tables

Tables are a major product primitive.

Required features:
- Search
- Filter
- Sort
- Pagination
- Column visibility where useful
- Row selection
- Status badges
- Contextual row actions
- Empty state
- Loading state
- Error state

For large datasets:
- Server-side filtering/sorting/pagination.
- Never load thousands of rows just to paginate in browser.

Suggested columns for challenge table:
- Checkbox
- Challenge ID
- Title
- Category
- Location
- Priority
- Status
- AI confidence
- Assigned organization
- Updated
- Actions

---

# 10. Bulk Selection UX

This is a core visual interaction.

When zero rows selected:
- Normal table.

When rows selected:
- Floating/sticky bulk-action bar appears.
- Show selected count.
- Show permitted actions.
- Provide clear close/clear-selection control.

Example:
`24 selected | Assign | Change Status | Categorize | Publish | Export | More`

Bulk toolbar must not hide critical page navigation.

---

# 11. Bulk Confirmation

Before impactful operations:
- Action title
- Selected count
- Summary of affected records
- Warning if some records may be skipped
- Optional reason/parameters
- Cancel
- Confirm

For destructive operations:
- Strong warning
- Explicit confirmation
- Require reason where policy needs it

---

# 12. Bulk Progress

After confirmation:
- Do not freeze the page.
- Show job/progress drawer or notification.
- Progress:
  - processed / total
  - success
  - failed
  - skipped
- Allow user to continue navigating.
- Completion notification links to job details.

---

# 13. Bulk Job Details

Page/drawer:
- Job ID
- Actor
- Action
- Created time
- Current status
- Progress bar
- Success/failure/skipped counts
- Error list
- Retry eligible failures
- Audit link

---

# 14. Challenge Detail Page

Header:
- Challenge title
- ID
- status
- priority
- primary actions

Main:
- Problem statement
- Location
- Evidence
- Affected context
- Expected outcome

Side/secondary:
- AI insights
- Similar challenges
- Suggested organizations
- Assignment
- Timeline

Tabs/sections:
- Overview
- AI Analysis
- Evidence
- Activity
- Assignment
- Project
- Impact

---

# 15. Government Review Screen

Use a split/structured layout:
- Left/main: challenge content and evidence.
- Right: review controls and AI recommendation cards.

Actions:
- Verify
- Request clarification
- Reject
- Assign
- Publish
- Escalate

AI card:
- Recommendation
- Confidence
- Explanation
- Similarity candidates
- Accept/edit/reject

Human override must be visually obvious.

---

# 16. Project Detail

Header:
- Project name
- linked challenge
- status
- health
- actions

Sections:
- Summary
- Team
- Milestones
- Deliverables
- Activity
- Collaboration
- Impact

Milestone component:
- name
- owner
- due date
- status
- progress
- blockers

---

# 17. Search & Filters

Filter controls should be compact and discoverable.

Recommended:
- Search field
- Filter button/drawer
- Active filter chips
- Clear all

Desktop may use inline filters where space permits.
Mobile should use filter drawer.

Persist filter state when practical via URL/query state.

---

# 18. Drawers & Modals

Use drawers for:
- Quick details
- Filters
- Bulk job details
- Contextual editing

Use modals for:
- Confirmation
- Short focused forms
- Destructive actions

Do not put huge multi-step workflows into tiny modals.

---

# 19. Forms

Principles:
- Clear labels
- Helper text
- Inline validation
- Required indicators
- Preserve entered data on recoverable errors
- Disable only the submitting action
- Show progress for uploads
- Provide success confirmation

Challenge submission should feel simple despite rich data.

---

# 20. State System

Every async component needs:
- Loading
- Success/data
- Empty
- Error
- Permission denied where applicable

Use skeletons for initial table/card loading where appropriate.

Never show an empty white panel while data is loading.

---

# 21. Notifications

Notification center:
- unread/read state
- timestamp
- type
- concise message
- navigation target

Use toast notifications for immediate feedback.
Use persistent notification center for important events.

---

# 22. Charts

Use charts only where they answer an operational question.

Examples:
- Challenges over time
- Status distribution
- Geographic distribution
- Project health
- Impact trends

Charts need:
- accessible labels
- tooltips
- fallback data table/summary where practical

---

# 23. Responsive Design

Desktop is primary because the product is operational/dashboard-heavy.

At smaller widths:
- Collapse sidebar.
- Stack KPI cards.
- Convert dense grids to vertical sections.
- Allow table horizontal scroll.
- Preserve row actions.
- Make bulk toolbar responsive.
- Never hide critical actions without a discoverable alternative.

---

# 24. Accessibility

- Keyboard navigation
- Visible focus
- Semantic HTML
- Accessible labels
- Dialog focus management
- Screen-reader-friendly status
- Color-independent state indicators
- Sufficient contrast
- Touch targets of reasonable size

---

# 25. Performance UX

- Debounce search.
- Paginate.
- Avoid unnecessary re-renders.
- Lazy load heavy charts/details.
- Optimistic updates only for safe actions.
- Show immediate acknowledgement for async jobs.
- Never make users wait for AI processing if it can happen in background.

---

# 26. Design Anti-Patterns

Do NOT:
- Create flashy gradients everywhere.
- Use giant hero sections for operational pages.
- Turn every status into a pill.
- Use excessive shadows.
- Hide core actions inside menus unnecessarily.
- Use huge tables without pagination.
- Put 10+ charts on a dashboard.
- Create separate dashboards that duplicate the same university data for student/faculty.
- Make bulk actions destructive without confirmation.
- Freeze the application during bulk processing.
- Present AI recommendations as unquestionable decisions.
