# SIH #43 — TECH STACK & TECHNICAL ARCHITECTURE

## 0. Architectural Decision

Use a **Java-first modular monolith** for the core platform.

Recommended:
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA/Hibernate
- PostgreSQL
- Flyway
- Redis
- Bucket4j
- Next.js/React/TypeScript
- Tailwind CSS/shadcn/ui
- TanStack Table
- Recharts
- Python/FastAPI for AI workloads only
- S3-compatible object storage
- Docker
- Caddy/Nginx
- GitHub Actions
- Spring Actuator + Micrometer + Prometheus + Grafana

Do NOT start with microservices, Kubernetes, Kafka or a dedicated search cluster.

---

# 1. Architecture

Initial:
Internet
→ Reverse Proxy
→ Next.js frontend
→ Spring Boot modular monolith
→ PostgreSQL
→ Redis
→ Object Storage

Spring Boot
→ Background workers
→ Python/FastAPI AI service when required

The Java application owns business rules, authorization, lifecycle and transactions.

Python owns AI/model-specific processing.

---

# 2. Why Java

Java/Spring is a strong fit for:
- enterprise APIs
- authentication/RBAC
- concurrency
- transactions
- bulk processing
- background jobs
- database integration
- observability
- long-lived maintainability

Java 21 is the baseline.

---

# 3. Backend Modules

Suggested modules:
- identity
- users
- organizations
- challenges
- projects
- collaboration
- ai
- notifications
- analytics
- files
- audit
- bulk
- administration

Keep boundaries clean so modules can be extracted later if justified.

---

# 4. Frontend

Next.js + React + TypeScript.

UI:
- Tailwind CSS
- shadcn/ui

Data:
- TanStack Table
- TanStack Query or equivalent server-state layer

Charts:
- Recharts

Requirements:
- server-side pagination
- server-side filtering/sorting
- debounced search
- reusable table components
- reusable bulk toolbar
- shared form/dialog primitives

---

# 5. API

REST JSON:
- `/api/v1/...`

Use:
- DTOs
- Bean Validation
- centralized exception handling
- consistent error responses
- OpenAPI
- pagination metadata
- idempotency keys where appropriate

Never expose JPA entities directly.

Example error:
{
  "code": "CHALLENGE_INVALID_STATE",
  "message": "Challenge cannot be verified from its current state.",
  "requestId": "..."
}

---

# 6. PostgreSQL

PostgreSQL is the authoritative transactional database.

Use:
- normalized relational tables
- foreign keys
- transactions
- indexes
- JSONB only for flexible metadata
- full-text search initially
- trigram indexes where useful
- connection pooling

Do not use MongoDB as the primary store for this product.

---

# 7. Core Schema

Identity:
- users
- citizen_profiles
- sessions/identity references

Organizations:
- organizations
- organization_members
- organization_roles

Challenges:
- challenges
- challenge_evidence
- challenge_ai_analysis
- challenge_assignments
- challenge_history

Projects:
- projects
- project_members
- milestones
- deliverables
- project_updates

Collaboration:
- collaborations
- collaboration_requests

Impact:
- impact_metrics
- impact_reports

Operations:
- bulk_operations
- bulk_operation_items
- audit_events

Files:
- file_metadata
- file_access_records

Notifications:
- notifications
- notification_preferences

---

# 8. PostgreSQL Indexing

Index based on actual queries.

Likely indexes:
- challenges(status)
- challenges(priority)
- challenges(category)
- challenges(organization_id)
- challenges(created_at)
- challenges(updated_at)
- challenges(location/geography fields as required)
- assignments(organization_id, status)
- projects(status, organization_id)
- milestones(due_date, status)
- notifications(user_id, read_at)
- audit_events(target_id, created_at)

Composite indexes should be based on query plans, not guesswork.

---

# 9. Redis

Use Redis for:
- cache
- distributed rate limiting
- short-lived idempotency keys
- transient locks
- job/progress state
- selected short-lived session state

Do NOT use Redis as the source of truth for challenges/projects/audit.

Use TTLs intentionally.

---

# 10. Caching

Two levels where useful:
- Caffeine local cache
- Redis distributed cache

Cache:
- dashboard aggregates
- low-volatility reference data
- selected organization metadata
- expensive read results

Never cache security-sensitive data without correct user/org scope.

Invalidate/version keys after important writes.

---

# 11. Rate Limiting

Use Bucket4j.

Redis provides shared/distributed state when multiple Spring Boot instances run.

Policies:
- anonymous/IP
- authenticated/user
- organization
- expensive endpoint
- AI endpoint
- bulk operation creation

Return HTTP 429 when exceeded.

Do not let rate-limit failures crash requests.

---

# 12. Bulk Architecture

HTTP request:
1. Authenticate.
2. Authorize.
3. Validate request.
4. Create bulk job.
5. Return job ID.

Worker:
1. Fetch bounded batch.
2. Validate current item state.
3. Apply transaction.
4. Record item result.
5. Update progress.
6. Continue.
7. Complete job.
8. Audit.

Properties:
- idempotent where possible
- retryable
- bounded concurrency
- partial failure support
- cancellation support where safe

UI:
- floating toolbar
- confirmation
- progress
- job details
- retry failed eligible items

---

# 13. Async Work

Use background processing for:
- bulk operations
- AI inference
- exports
- reports
- notification fan-out
- file processing
- scheduled aggregates

Never perform large expensive work synchronously in an HTTP request.

For the prototype, keep job infrastructure simple. Introduce Kafka/RabbitMQ/etc. only if actual workload requires durable messaging beyond the chosen Redis-backed pattern.

---

# 14. AI Service

Python + FastAPI.

Flow:
Spring Boot
→ AI job/request
→ Python service
→ model/inference
→ result
→ Spring Boot
→ PostgreSQL

AI:
- classification
- embeddings
- similarity
- duplicate detection
- matching
- summarization
- recommendation

AI result:
- result
- confidence
- explanation
- model/version
- timestamp
- processing status

Do not allow the AI service to bypass Java authorization/business rules.

---

# 15. Search

Phase 1:
- PostgreSQL full-text search
- structured indexes
- optional pg_trgm

Phase 2 only when justified:
- OpenSearch/Elasticsearch
- semantic/vector search infrastructure

Do not add a search cluster merely for appearance.

---

# 16. File Storage

S3-compatible object storage.

PostgreSQL stores:
- file ID
- owner
- organization scope
- object key
- content type
- size
- checksum
- timestamps
- access metadata

Validate:
- type
- size
- filename
- authorization

Use signed/time-limited access where appropriate.

---

# 17. Authentication

Spring Security.

Use OAuth2/OIDC where appropriate.

Aadhaar:
- integrate only through an approved/authorized verification provider/process.
- do not invent an Aadhaar authentication protocol.
- minimize stored identity information.

Security:
- secure session/token lifecycle
- expiration
- revocation
- brute-force protection
- audit security events

---

# 18. Authorization

RBAC + resource-level authorization.

Example:
Government reviewer can review challenges but cannot necessarily administer platform roles.

University user can access only permitted university resources.

Industry user can access only permitted organization resources.

Citizen can access own private submissions.

Server-side authorization is mandatory.

---

# 19. Organization Isolation

Every organization-scoped query must enforce organization membership/scope.

Never trust a client-supplied organization ID.

Privileged cross-organization government access must be explicitly permissioned and audited.

---

# 20. Notifications

Use domain events internally.

Examples:
- ChallengeSubmitted
- ChallengeVerified
- ClarificationRequested
- ChallengeAssigned
- CollaborationRequested
- ProjectCreated
- MilestoneUpdated
- ProjectDeployed
- ImpactUpdated

Notification processing should be asynchronous where fan-out is large.

---

# 21. Audit

Audit:
- consequential status changes
- reviewer actions
- AI overrides
- assignments
- bulk jobs
- role changes
- organization changes
- project lifecycle
- administrative actions

Include:
- actor
- organization
- action
- target
- timestamp
- result
- request/correlation ID
- metadata

Never log secrets, tokens or unnecessary identity numbers.

---

# 22. Observability

Spring Boot Actuator
+ Micrometer
+ Prometheus
+ Grafana

Metrics:
- request latency p50/p95/p99
- throughput
- errors
- DB pool
- DB slow queries
- Redis latency/hit rate/memory
- worker queue depth
- job duration
- retries
- AI latency/failure

Use structured logs.

Add OpenTelemetry tracing when distributed components justify it.

---

# 23. Deployment

Prototype:
- Docker
- reverse proxy
- Next.js
- Spring Boot
- PostgreSQL
- Redis
- object storage
- optional Python AI service

Separate:
- dev
- staging
- demo/production

Externalize secrets.

HTTPS required.

---

# 24. Scaling

Stage 1:
1 Spring Boot instance
+ PostgreSQL
+ Redis

Stage 2:
2+ Spring Boot instances
+ load balancer
+ shared Redis

Stage 3:
dedicated workers

Stage 4:
dedicated search

Stage 5:
dedicated AI inference infrastructure

Scale based on measured bottlenecks.

---

# 25. What Not To Use Initially

- Kubernetes
- Kafka
- service mesh
- microservice per domain
- Elasticsearch/OpenSearch
- dedicated vector DB
- GPU servers without need
- multiple transactional databases

These can be introduced later based on evidence.

---

# 26. Security Baseline

- HTTPS
- CORS allowlist
- CSP/security headers
- input validation
- output encoding
- secure cookies/tokens
- CSRF protection where applicable
- rate limiting
- upload validation
- secret management
- encrypted backups
- least privilege
- dependency scanning
- container scanning

---

# 27. Testing

Unit:
- business rules
- state transitions

Integration:
- PostgreSQL repositories
- Redis behavior
- service workflows

Security:
- RBAC
- organization isolation
- privilege escalation

API:
- validation
- error envelopes
- contracts

Bulk:
- success
- partial failure
- retry
- idempotency
- concurrency

Load:
- search/list
- login/auth flows
- bulk job creation
- rate limits

E2E:
Citizen submission
→ Government verification
→ Discovery
→ University/Industry interest
→ Project
→ Milestones
→ Deployment
→ Impact

---

# 28. Suggested Repository

/backend
  /src/main/java/.../
    identity/
    users/
    organizations/
    challenges/
    projects/
    collaboration/
    ai/
    notifications/
    analytics/
    files/
    audit/
    bulk/
    administration/
  /src/main/resources/
    /db/migration/

/frontend
  /app
  /components
  /features
  /lib
  /hooks
  /types

/ai-service
  /app
    /api
    /models
    /pipelines
    /embeddings
    /services

/docs
  PRD.md
  DESIGN_SYSTEM.md
  TECH_STACK.md
  MASTER_BUILD_SPEC.md

---

# 29. Cost Strategy

Cheapest strong architecture:
- one modular backend
- one PostgreSQL
- one Redis
- one object store
- one frontend deployment
- optional AI service

Avoid paying for distributed infrastructure before actual demand exists.

Use vertical scaling first, then horizontal scaling.

---

# 30. Engineering Principles

- Correctness before cleverness.
- Security at the server boundary.
- Database is source of truth.
- Redis is acceleration/transient state.
- AI is assistive.
- Async for expensive work.
- Bulk actions are jobs.
- Every consequential operation is auditable.
- Avoid unnecessary infrastructure.
- Design for 10K active users without buying infrastructure for 10K users on day one.
