# SIH #43 — MASTER PRODUCT REQUIREMENTS DOCUMENT

## 0. Document Status
This is the authoritative product specification for the SIH Problem Statement #43 platform. It is intended for Antigravity/AI coding agents. The Design System and Technical Stack documents are companion specifications.

**Priority rule:** If implementation details conflict with this PRD, preserve the product behavior in this PRD. If the PRD is silent on an implementation detail, follow TECH_STACK.md. Visual behavior follows DESIGN_SYSTEM.md.

---

# 1. Product Vision

Build a secure, scalable, enterprise-style national innovation/civic collaboration platform connecting:

- Citizens
- Universities
- Industry
- Government

The platform turns real-world citizen/community problems into structured, verified challenges that can be discovered, prioritized, assigned to capable organizations, converted into projects, tracked through milestones, piloted/deployed, and measured for impact.

The platform must feel like a serious government/enterprise operations product, not a social-media application.

---

# 2. Primary Goals

1. Give citizens a simple way to report meaningful problems.
2. Give government a command-center dashboard to verify, prioritize, route and monitor challenges.
3. Give universities one consolidated operational dashboard to discover challenges, form/manage projects and track outcomes.
4. Give industry a structured opportunity/collaboration dashboard.
5. Use AI as decision support for classification, prioritization, duplicate detection and matching.
6. Support high-volume operational workflows and bulk actions without freezing the UI or overwhelming the backend.
7. Provide strong authentication, RBAC, organization isolation and auditability.
8. Target approximately 10,000 active users for the prototype architecture.
9. Keep infrastructure and development cost low by avoiding premature microservices/Kafka/Kubernetes/search clusters.
10. Make the platform extensible toward production scale.

---

# 3. User Types

## 3.1 Citizen

Capabilities:
- Register/login.
- Complete identity verification through an approved Aadhaar-enabled identity-verification integration.
- Maintain profile.
- Submit a challenge/problem.
- Attach evidence.
- Track submitted challenges.
- Receive requests for clarification.
- View challenge status/history.
- Discover public/eligible challenge information.
- Participate in approved collaboration/project flows where applicable.
- Receive notifications.

Citizen must NOT be able to:
- Modify government decisions.
- Access private organizational information.
- Access another citizen's private submissions.
- Bypass verification/authorization.

## 3.2 Government

Government users operate the platform's governance/operations layer.

Capabilities:
- View command-center dashboard.
- Review submitted challenges.
- Validate/reject/request clarification.
- Categorize and prioritize.
- Review AI recommendations.
- Assign/route challenges.
- Manage challenge lifecycle.
- View organization capacity and collaboration.
- Monitor projects and outcomes.
- Perform bulk operations.
- Export reports where permitted.
- View audit information.
- Manage approved platform configuration.

Government permissions must be granular; not every government user is a super-admin.

## 3.3 University

Use ONE consolidated University dashboard.

Do NOT create separate "student dashboard" and "faculty dashboard" product surfaces as primary role dashboards.

University capabilities:
- Discover/filter eligible challenges.
- View challenge details and AI analysis.
- Express interest/apply.
- Create/manage projects.
- Manage university project members.
- Assign responsibilities.
- Track milestones.
- Upload deliverables/evidence.
- Communicate/collaborate with government/industry where authorized.
- Track project outcomes and impact.
- View university-level analytics.

The university dashboard may contain internal role permissions for administrators, project managers and members, but the product information architecture remains a unified University workspace.

## 3.4 Industry

Capabilities:
- Maintain organization profile/capabilities.
- Discover relevant challenges/projects.
- View opportunity details.
- Express interest.
- Offer expertise/resources/technology.
- Collaborate with universities/government.
- Track collaborations and commitments.
- View outcomes/impact relevant to the organization.

## 3.5 Platform Administrator

Capabilities:
- Platform configuration.
- User/organization moderation.
- Role/permission management.
- System health/operational visibility.
- Audit review.
- Taxonomy/reference data management.
- Emergency controls.

---

# 4. Core Product Lifecycle

The canonical challenge lifecycle is:

DRAFT
→ SUBMITTED
→ UNDER_REVIEW
→ CLARIFICATION_REQUIRED (optional)
→ VERIFIED / REJECTED
→ CLASSIFIED
→ PRIORITIZED
→ ROUTED / PUBLISHED
→ INTERESTED / ACCEPTED
→ PROJECT_FORMED
→ IN_PROGRESS
→ PILOT
→ DEPLOYED
→ IMPACT_MEASURED
→ CLOSED / ARCHIVED

Rules:
- Invalid transitions must be rejected server-side.
- Every consequential transition must be audited.
- AI may recommend classification/priority/matching but must not silently make consequential governance decisions.
- Human review must be possible.

---

# 5. Challenge Submission

Citizen submits:
- Title
- Detailed description
- Category/domain
- Problem location/geography
- Optional affected population information
- Evidence/attachments
- Optional urgency context
- Optional expected outcome
- Consent/acknowledgements as required

System:
1. Validates input.
2. Validates attachment type/size.
3. Creates challenge.
4. Assigns initial status SUBMITTED.
5. Creates audit event.
6. Triggers asynchronous AI analysis where enabled.
7. Notifies appropriate review queue.

Do not block the HTTP request on expensive AI processing.

---

# 6. Government Review

Government review screen must show:
- Challenge information
- Evidence
- Location
- Existing history
- AI classification
- AI priority recommendation
- Duplicate/similarity candidates
- Suggested organizations
- Audit/history
- Reviewer actions

Actions:
- Verify
- Reject with reason
- Request clarification
- Edit approved metadata
- Assign/reroute
- Publish
- Escalate
- Mark duplicate/merge where policy permits

---

# 7. AI Requirements

AI is decision support.

Required/desired AI capabilities:
- Domain/category classification
- Priority/severity recommendation
- Duplicate/similar challenge detection
- Semantic similarity
- Organization/project matching
- Suggested tags
- Summarization
- Explanation of recommendations
- Confidence score
- Model/version metadata

AI result should include where applicable:
- recommendation
- confidence
- explanation
- model identifier/version
- timestamp
- processing status

Human override:
- A reviewer can accept, modify or reject AI recommendations.
- Overrides are auditable.

AI failure:
- Must not crash the main platform.
- Challenge remains usable.
- Retry can happen asynchronously.

---

# 8. Challenge Discovery

Users with permission can:
- Search
- Filter
- Sort
- Paginate
- Save/use views where implemented
- Open detail view
- Select multiple rows
- Perform permitted bulk actions

Filters may include:
- Status
- Domain/category
- Geography
- Priority
- Date
- Organization
- AI classification
- Project state
- Impact
- Assignment

All high-volume lists use server-side pagination/filtering/sorting.

---

# 9. Bulk Operations

Bulk operations are a first-class product capability.

Examples:
- Bulk assign
- Bulk change status
- Bulk categorize
- Bulk publish
- Bulk archive
- Bulk export
- Bulk notify
- Bulk approve where policy permits

Required behavior:
1. User selects records.
2. UI shows selected count.
3. Floating bulk-action toolbar appears.
4. User chooses action.
5. UI shows confirmation and impact summary.
6. Backend checks permission for the entire operation.
7. Backend validates each item.
8. Backend creates BulkOperation job.
9. API responds quickly with job ID.
10. Worker processes items in bounded batches.
11. UI receives progress through polling or SSE.
12. Each item records success/failure/skipped.
13. Completion summary is shown.
14. Failed eligible items can be retried.
15. Audit events are generated.

Never execute thousands of database mutations synchronously in a browser request.

Bulk operation properties:
- id
- actor
- organization scope
- action
- resource type
- requested count
- processed count
- succeeded count
- failed count
- skipped count
- status
- timestamps
- failure details
- audit reference

---

# 10. Dashboards

## 10.1 Government Command Center

KPIs:
- Total challenges
- Pending review
- Verified
- High priority
- Active projects
- Projects at risk
- Deployed solutions
- Impact indicators

Operational sections:
- Review queue
- Priority challenges
- Geographic distribution
- Challenge trends
- AI insights
- Assignment workload
- Project health
- Recent activity
- Alerts

## 10.2 University Dashboard

KPIs:
- Available challenges
- Applications/interests
- Active projects
- Milestones due
- Projects at risk
- Completed projects
- Impact

Sections:
- Recommended challenges
- Active projects
- Upcoming milestones
- Collaboration requests
- Deliverables
- University performance/impact

## 10.3 Industry Dashboard

KPIs:
- Relevant opportunities
- Active collaborations
- Offers/expressions of interest
- Commitments
- Projects supported
- Outcomes

Sections:
- Recommended opportunities
- Active collaborations
- Requests
- Capability matching
- Impact

## 10.4 Citizen Dashboard

Sections:
- My submissions
- Status tracker
- Clarification requests
- Recent activity
- Notifications
- Eligible public outcomes

---

# 11. Organization Model

Organizations:
- Government department/unit
- University
- Industry organization

Organization attributes may include:
- legal/display name
- type
- verification status
- geography
- domains
- capabilities
- contact/administrative metadata
- members
- roles
- created/updated timestamps

Organization membership controls access.

---

# 12. Authentication

Required:
- Registration/login
- Secure session lifecycle
- Identity verification where applicable
- Role assignment
- Organization membership
- Account recovery
- Session expiration/revocation
- Server-side authorization

Aadhaar:
- Treat Aadhaar as an external/approved identity-verification integration.
- Do not implement unofficial Aadhaar authentication.
- Do not store unnecessary Aadhaar numbers or authentication secrets.
- Store minimum verification references needed by the product.

---

# 13. RBAC

Example roles:
- CITIZEN
- UNIVERSITY_ADMIN
- UNIVERSITY_PROJECT_MANAGER
- UNIVERSITY_MEMBER
- INDUSTRY_ADMIN
- INDUSTRY_MEMBER
- GOVERNMENT_REVIEWER
- GOVERNMENT_MANAGER
- PLATFORM_ADMIN

Permissions must be checked:
- at API/service layer
- at resource scope
- at organization scope
- for every bulk action

Frontend hiding a button is NOT security.

---

# 14. Notifications

Events may include:
- Challenge submitted
- Review started
- Clarification requested
- Challenge verified
- Challenge rejected
- Challenge assigned
- Interest accepted/rejected
- Collaboration requested
- Project created
- Milestone due
- Milestone overdue
- Project status changed
- Deployment
- Impact update

Notification channels:
- In-app first
- Email/push can be added later

Notification failures must not roll back core transactions.

---

# 15. Audit

Audit important actions:
- Login/security events where appropriate
- Identity verification state changes
- Challenge state changes
- Reviewer decisions
- Assignment
- AI override
- Bulk jobs
- Organization/role changes
- Project state changes
- Sensitive file access where required
- Administrative changes

Audit fields:
- actor
- actor organization
- action
- target
- timestamp
- result
- relevant metadata
- correlation/request ID

Never log:
- passwords
- tokens
- secrets
- unnecessary identity numbers
- sensitive evidence content

---

# 16. Data Model

Core domains:
- users
- profiles
- organizations
- organization_members
- organization_roles
- challenges
- challenge_evidence
- challenge_ai_analysis
- challenge_assignments
- challenge_history
- projects
- project_members
- milestones
- deliverables
- project_updates
- collaborations
- collaboration_requests
- impact_metrics
- notifications
- bulk_operations
- bulk_operation_items
- file_metadata
- audit_events

PostgreSQL is the source of truth.

---

# 17. API Requirements

Use REST JSON.

Conventions:
- `/api/v1/...`
- UUID/ULID-style external IDs
- DTOs
- validation
- consistent error envelope
- pagination metadata
- filtering/sorting
- idempotency for retry-sensitive operations

Example endpoints:
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/me`
- GET `/api/v1/challenges`
- POST `/api/v1/challenges`
- GET `/api/v1/challenges/{id}`
- PATCH `/api/v1/challenges/{id}`
- POST `/api/v1/challenges/{id}/verify`
- POST `/api/v1/challenges/{id}/clarification`
- POST `/api/v1/challenges/{id}/assign`
- POST `/api/v1/bulk-operations`
- GET `/api/v1/bulk-operations/{id}`
- GET `/api/v1/projects`
- POST `/api/v1/projects`
- PATCH `/api/v1/projects/{id}`
- GET `/api/v1/notifications`
- GET `/api/v1/analytics/...`

Exact endpoint names may be refined during implementation, but the domain boundaries must remain.

---

# 18. Performance Requirements

Target:
- approximately 10,000 active users for prototype
- graceful degradation under traffic spikes
- no UI crash during bulk operations
- bounded backend concurrency
- server-side pagination
- indexed database queries
- Redis caching
- rate limiting
- async expensive operations

Do not promise a fixed RPS without load testing.

Track:
- p50/p95/p99 latency
- throughput
- 4xx/5xx
- DB pool utilization
- Redis latency/hit rate
- queue/job depth
- worker processing time
- error/retry rates

---

# 19. Failure & Recovery

The system must handle:
- AI service unavailable
- Redis unavailable
- database transient failure
- worker crash
- partial bulk failure
- duplicate requests
- expired sessions
- invalid state transitions
- failed file upload
- notification delivery failure

Core transactional functionality must degrade safely.

---

# 20. Security

Required:
- HTTPS
- secure headers
- input validation
- output encoding
- parameterized queries/ORM
- authentication
- RBAC
- resource-level authorization
- rate limiting
- brute-force protection
- secure file upload
- secret management
- encrypted backups
- dependency scanning
- audit logging

---

# 21. MVP Scope

MVP must prioritize:
1. Authentication and roles
2. Organization model
3. Citizen challenge submission
4. Government review workflow
5. Challenge discovery
6. University workflow
7. Industry workflow
8. Project lifecycle
9. Bulk operations
10. AI recommendations
11. Notifications
12. Audit
13. Analytics dashboards
14. Rate limiting/caching
15. Production-style error handling

Advanced features can follow after core lifecycle is stable.

---

# 22. Non-Functional Requirements

- Responsive desktop-first enterprise UI
- Accessible controls
- Keyboard navigation for major workflows
- Clear loading/empty/error states
- No destructive action without confirmation
- Optimistic UI only where safe
- Consistent terminology
- No fake backend state in final implementation
- No hardcoded demo data presented as real data
- Seed data may exist for development/demo environments and must be clearly separated.

---

# 23. Acceptance Criteria

A feature is complete only when:
- UI exists and follows DESIGN_SYSTEM.md.
- API exists and validates inputs.
- Authorization is enforced server-side.
- Data persists correctly.
- Loading/empty/error states exist.
- Audit is implemented where required.
- Tests cover important business rules.
- High-volume lists are paginated.
- Bulk actions are asynchronous where appropriate.
- Failure does not corrupt state.
- The feature works with real backend data.
