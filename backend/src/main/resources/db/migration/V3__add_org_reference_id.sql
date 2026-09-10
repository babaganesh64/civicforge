ALTER TABLE organizations ADD COLUMN reference_id VARCHAR(50);
UPDATE organizations SET reference_id = 'ORG-' || upper(substring(cast(id as text) from 1 for 6)) WHERE reference_id IS NULL;
ALTER TABLE organizations ADD CONSTRAINT uk_organizations_reference_id UNIQUE (reference_id);
ALTER TABLE challenges ADD COLUMN assigned_org_id UUID REFERENCES organizations(id);
