# SIH #43 — MASTER BUILD SPECIFICATION FOR ANTIGRAVITY

## READ THIS FIRST

You are implementing the SIH Problem Statement #43 platform.

This repository contains four authoritative specification files:

1. `PRD.md` — product requirements and workflows.
2. `DESIGN_SYSTEM.md` — UI/UX and visual behavior.
3. `TECH_STACK.md` — architecture and engineering decisions.
4. `MASTER_BUILD_SPEC.md` — implementation rules and document hierarchy.

**You MUST read all four before implementing the product.**

---

# 1. SOURCE OF TRUTH

Priority:
1. MASTER_BUILD_SPEC.md
2. PRD.md for product behavior
3. DESIGN_SYSTEM.md for UI/UX
4. TECH_STACK.md for implementation details

If a detail is unspecified:
- choose the simplest production-sensible solution,
- keep the architecture consistent with TECH_STACK.md,
- do not introduce major infrastructure without justification.

Do not silently replace core technologies.

---

# 2. NON-NEGOTIABLE STACK

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table
- Recharts

Backend:
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA/Hibernate
- Flyway

Data:
- PostgreSQL
- Redis
- S3-compatible object storage

Rate limiting:
- Bucket4j + Redis

AI:
- Python + FastAPI only where model/AI workloads require it.

Infrastructure:
- Docker
- Caddy/Nginx
- GitHub Actions
- Actuator/Micrometer/Prometheus/Grafana

---

# 3. ARCHITECTURE RULE

Build a **modular monolith** first.

Do NOT create:
- microservice-per-domain
- Kubernetes cluster
- Kafka cluster
- Elasticsearch cluster
- service mesh

The backend should have clear modules:
identity, users, organizations, challenges, projects, collaboration, AI, notifications, analytics, files, audit, bulk, administration.

---

# 4. PRODUCT RULES

The platform connects:
Citizen ↔ Government ↔ University ↔ Industry.

University is a single institutional dashboard/product surface. Do not split the main product into student/faculty dashboards.

Government is the operational authority layer.

AI supports decisions; humans remain responsible for consequential governance actions.

Bulk operations are core functionality.

---

# 5. IMPLEMENTATION ORDER

## Phase 0 — Foundation
- Monorepo/project structure
- Docker development environment
- PostgreSQL
- Redis
- Flyway
- Spring Boot base
- Next.js base
- Environment configuration
- Logging/error handling
- CI

## Phase 1 — Identity & Organizations
- Authentication
- User profile
- Role model
- Organization model
- Membership
- Authorization
- Audit

## Phase 2 — Challenge Core
- Citizen submission
- Evidence upload
- Challenge list
- Challenge detail
- Government review
- State machine
- Audit/history

## Phase 3 — AI
- Async AI job
- classification
- priority recommendation
- duplicate/similarity
- matching
- explanations
- human override

## Phase 4 — University & Industry
- challenge discovery
- interest/application
- organization capabilities
- collaboration
- project creation

## Phase 5 — Project Lifecycle
- project detail
- members
- milestones
- deliverables
- progress
- pilot/deployment
- impact

## Phase 6 — Operations
- bulk actions
- async jobs
- progress
- retries
- exports
- notifications

## Phase 7 — Dashboards
- citizen
- university
- industry
- government
- admin

## Phase 8 — Hardening
- rate limiting
- caching
- load testing
- security testing
- observability
- failure handling
- accessibility
- production build

---

# 6. DATA INTEGRITY

Use explicit state machines for challenges and projects.

Never:
- allow arbitrary status changes from frontend
- trust client organization scope
- trust client role
- overwrite important history without audit
- use Redis as authoritative state

Transactions must protect multi-record changes.

---

# 7. API IMPLEMENTATION RULES

Every endpoint:
- authenticates where required
- authorizes
- validates input
- applies organization/resource scope
- returns consistent response format
- logs/correlates failures
- avoids leaking sensitive data

Use DTOs.

Never expose persistence entities directly.

---

# 8. BULK IMPLEMENTATION RULES

Never process a large bulk operation entirely inside an HTTP request.

The request creates a job.

The worker processes bounded batches.

Each item gets a result.

Support:
- progress
- partial failure
- retry
- audit
- idempotency
- cancellation when safe

Frontend must remain usable during processing.

---

# 9. UI IMPLEMENTATION RULES

Follow DESIGN_SYSTEM.md.

Every page must include:
- loading state
- empty state
- error state
- permission state where relevant

Operational tables:
- server pagination
- search
- filters
- sort
- selection
- bulk toolbar
- row actions

When rows are selected, show the floating bulk toolbar.

Do not create decorative UI that reduces operational clarity.

---

# 10. SECURITY RULES

Security is not a frontend feature.

Backend must enforce:
- authentication
- RBAC
- organization isolation
- resource ownership
- state transition permissions
- bulk permissions

Aadhaar integration must be through an approved external verification process/provider. Do not invent or implement unsupported Aadhaar authentication mechanisms.

Never log:
- passwords
- tokens
- secrets
- unnecessary Aadhaar/identity numbers
- sensitive evidence contents

---

# 11. AI RULES

AI service must not:
- directly mutate core database state
- bypass authorization
- make silent final governance decisions

AI returns recommendations.

Java decides whether and how those recommendations are applied.

Store model/version/confidence/explanation when appropriate.

AI failures must degrade gracefully.

---

# 12. PERFORMANCE RULES

Target approximately 10,000 active users for the prototype.

Required:
- Redis caching
- Bucket4j rate limiting
- server-side pagination
- DB indexes
- bounded worker concurrency
- asynchronous expensive operations
- connection pooling

Do not claim scalability based on architecture alone. Load-test it.

---

# 13. ERROR HANDLING

Use a consistent API error model.

Examples:
- validation error
- unauthorized
- forbidden
- not found
- conflict
- invalid state
- rate limited
- dependency unavailable
- internal error

Expose safe user messages.

Keep technical stack traces out of production responses.

---

# 14. OBSERVABILITY

Implement from the beginning:
- health endpoints
- structured logs
- request IDs
- metrics
- job metrics
- DB metrics
- Redis metrics
- AI metrics

Important dashboards:
- API latency
- error rate
- DB pool
- Redis
- bulk jobs
- AI jobs

---

# 15. DEVELOPMENT DATA

Seed realistic demo data only for development/demo environments.

Clearly separate:
- mock/demo identity verification
- production identity verification
- mock AI responses
- real AI service

Never present fake data as real government/citizen information.

---

# 16. TESTING GATE

Do not call a module complete until:
- backend tests pass
- frontend builds
- API validation works
- authorization tests pass
- organization isolation tests pass
- important state transitions are tested
- bulk partial failure is tested
- error states are implemented
- UI follows the design system

---

# 17. FINAL ACCEPTANCE FLOW

The complete demo should support:

Citizen
→ Register/Login
→ Identity verification reference
→ Submit real structured challenge
→ Upload evidence
→ Receive status

Government
→ See review queue
→ Review challenge
→ See AI recommendations
→ Verify/request clarification/reject
→ Prioritize
→ Assign/publish

University
→ Discover challenge
→ Review details
→ Express interest
→ Form project
→ Manage team
→ Track milestones
→ Submit deliverables

Industry
→ Discover relevant opportunities
→ Offer capability/support
→ Collaborate

Government/Organizations
→ Monitor project
→ Pilot
→ Deploy
→ Record impact

All roles
→ Notifications
→ Audit-appropriate history
→ Role-appropriate dashboards

Government/authorized users
→ Select many challenges
→ Run bulk action
→ Job created
→ Progress shown
→ Partial failures reported
→ Retry eligible failures

---

# 18. DO NOT INVENT PRODUCT REQUIREMENTS

If you encounter ambiguity:
1. Check PRD.md.
2. Check DESIGN_SYSTEM.md.
3. Check TECH_STACK.md.
4. Prefer the least complex implementation that preserves the intended workflow.

Do not:
- add unrelated features
- change role model
- create duplicate dashboards
- replace Java backend
- introduce unnecessary infrastructure
- make AI authoritative
- make bulk actions synchronous

---

# 19. HANDOFF EXPECTATION

The final implementation should be:
- functional
- visually coherent
- secure
- testable
- modular
- scalable enough for the prototype target
- inexpensive to deploy
- understandable to another developer

The goal is not to maximize technologies.

The goal is to build the strongest possible platform with the smallest sensible architecture.

---

# 20. COMPLETION STANDARD

Before declaring completion, verify:

### Product
- All core workflows from PRD implemented.

### UX
- Design System applied consistently.

### Backend
- Java/Spring architecture followed.

### Database
- PostgreSQL source of truth.

### Performance
- Redis/cache/rate limits implemented where required.

### Bulk
- Asynchronous job architecture implemented.

### AI
- Separate service boundary and human oversight.

### Security
- Authentication + authorization + organization isolation.

### Operations
- Audit + notifications + observability.

### Quality
- Tests + error handling + responsive UI.

### Deployment
- Dockerized and environment-configurable.

**Do not mark the project "done" because the screens exist. The complete backend workflow and data lifecycle must work.**
