-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- CITIZEN, UNIVERSITY_ADMIN, etc.
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_verification_reference VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Citizen profiles
CREATE TABLE citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    org_type VARCHAR(50) NOT NULL, -- GOVERNMENT, UNIVERSITY, INDUSTRY
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    website VARCHAR(500),
    description TEXT,
    geography VARCHAR(255),
    domains JSONB,
    capabilities JSONB,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    metadata JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- GOVERNMENT_REVIEWER, GOVERNMENT_MANAGER, UNIVERSITY_ADMIN, etc.
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Challenges
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    location_description VARCHAR(500),
    state_province VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    affected_population_estimate INTEGER,
    affected_population_notes TEXT,
    urgency VARCHAR(50),
    expected_outcome TEXT,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    priority VARCHAR(50),
    submitted_by UUID NOT NULL REFERENCES users(id),
    submitted_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    clarification_request TEXT,
    tags JSONB,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenge evidence (file attachments)
CREATE TABLE challenge_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    file_id UUID NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    description TEXT,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenge AI analysis
CREATE TABLE challenge_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    job_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    suggested_category VARCHAR(100),
    suggested_priority VARCHAR(50),
    summary TEXT,
    tags JSONB,
    similarity_candidates JSONB,
    suggested_organizations JSONB,
    explanation TEXT,
    confidence_score DECIMAL(5,4),
    model_id VARCHAR(100),
    model_version VARCHAR(50),
    -- Human override fields
    human_override BOOLEAN NOT NULL DEFAULT FALSE,
    override_by UUID REFERENCES users(id),
    override_at TIMESTAMPTZ,
    override_notes TEXT,
    -- Timestamps
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    raw_response JSONB
);

-- Challenge assignments
CREATE TABLE challenge_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assignment_type VARCHAR(50) NOT NULL, -- PRIMARY, COLLABORATOR
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    UNIQUE(challenge_id, organization_id)
);

-- Challenge history (audit trail)
CREATE TABLE challenge_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id),
    actor_email VARCHAR(255),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File metadata
CREATE TABLE file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    original_filename VARCHAR(500) NOT NULL,
    stored_key VARCHAR(1000) NOT NULL UNIQUE,
    bucket_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(128),
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
    purpose VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id),
    lead_organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    health VARCHAR(50) DEFAULT 'ON_TRACK',
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(100) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    progress_percent INTEGER DEFAULT 0,
    blockers TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deliverables
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_id UUID REFERENCES file_metadata(id),
    submitted_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collaboration requests
CREATE TABLE collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id),
    project_id UUID REFERENCES projects(id),
    requesting_org_id UUID NOT NULL REFERENCES organizations(id),
    target_org_id UUID REFERENCES organizations(id),
    type VARCHAR(50) NOT NULL, -- INTEREST, OFFER, REQUEST
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Impact metrics
CREATE TABLE impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(100),
    description TEXT,
    recorded_by UUID NOT NULL REFERENCES users(id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    target_url VARCHAR(1000),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bulk operations
CREATE TABLE bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_org_id UUID REFERENCES organizations(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_count INTEGER NOT NULL DEFAULT 0,
    processed_count INTEGER NOT NULL DEFAULT 0,
    succeeded_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    skipped_count INTEGER NOT NULL DEFAULT 0,
    parameters JSONB,
    failure_summary JSONB,
    audit_reference UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Bulk operation items
CREATE TABLE bulk_operation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID NOT NULL REFERENCES bulk_operations(id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    error_code VARCHAR(100),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    processed_at TIMESTAMPTZ,
    metadata JSONB
);

-- Audit events (append-only)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(255),
    actor_email VARCHAR(255),
    actor_org_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    result VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    request_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_priority ON challenges(priority);
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_challenges_submitted_by ON challenges(submitted_by);
CREATE INDEX idx_challenges_created_at ON challenges(created_at);
CREATE INDEX idx_challenges_updated_at ON challenges(updated_at);
CREATE INDEX idx_challenges_status_priority ON challenges(status, priority);
CREATE INDEX idx_challenge_assignments_org_id ON challenge_assignments(organization_id, status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_lead_org ON projects(lead_organization_id, status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_audit_events_target ON audit_events(target_type, target_id, created_at DESC);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id, created_at DESC);
CREATE INDEX idx_org_members_user ON organization_members(user_id, status);
CREATE INDEX idx_org_members_org ON organization_members(organization_id, status);
CREATE INDEX idx_bulk_items_operation ON bulk_operation_items(bulk_operation_id, status);
CREATE INDEX idx_file_metadata_owner ON file_metadata(owner_id);

-- Full-text search index on challenges
CREATE INDEX idx_challenges_fts ON challenges USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
);

-- Trigram index for fuzzy title search
CREATE INDEX idx_challenges_title_trgm ON challenges USING GIN (title gin_trgm_ops);