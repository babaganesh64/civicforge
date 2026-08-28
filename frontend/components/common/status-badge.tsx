'use client';
import { Badge } from '@/components/ui/badge';
import { ChallengeStatus, ChallengePriority } from '@/types/challenge';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';

const statusConfig: Record<ChallengeStatus, { label: string; variant: BadgeVariant }> = {
  DRAFT:                  { label: 'Draft',                 variant: 'secondary' },
  SUBMITTED:              { label: 'Submitted',             variant: 'info' },
  UNDER_REVIEW:           { label: 'Under Review',          variant: 'info' },
  CLARIFICATION_REQUIRED: { label: 'Clarification Needed',  variant: 'warning' },
  VERIFIED:               { label: 'Verified',              variant: 'success' },
  REJECTED:               { label: 'Rejected',              variant: 'destructive' },
  CLASSIFIED:             { label: 'Classified',            variant: 'success' },
  PRIORITIZED:            { label: 'Prioritized',           variant: 'success' },
  ROUTED:                 { label: 'Routed',                variant: 'success' },
  PUBLISHED:              { label: 'Published',             variant: 'success' },
  INTERESTED:             { label: 'Interested',            variant: 'info' },
  ACCEPTED:               { label: 'Accepted',              variant: 'success' },
  PROJECT_FORMED:         { label: 'Project Formed',        variant: 'success' },
  IN_PROGRESS:            { label: 'In Progress',           variant: 'success' },
  PILOT:                  { label: 'Pilot',                 variant: 'info' },
  DEPLOYED:               { label: 'Deployed',              variant: 'success' },
  IMPACT_MEASURED:        { label: 'Impact Measured',       variant: 'secondary' },
  CLOSED:                 { label: 'Closed',                variant: 'secondary' },
  ARCHIVED:               { label: 'Archived',              variant: 'secondary' },
};

const priorityConfig: Record<ChallengePriority, { label: string; variant: BadgeVariant }> = {
  CRITICAL: { label: 'Critical', variant: 'destructive' },
  HIGH:     { label: 'High',     variant: 'warning' },
  MEDIUM:   { label: 'Medium',   variant: 'default' },
  LOW:      { label: 'Low',      variant: 'secondary' },
};

export function StatusBadge({ status }: { status: ChallengeStatus }) {
  const config = statusConfig[status] ?? { label: status, variant: 'secondary' as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: ChallengePriority }) {
  const config = priorityConfig[priority] ?? { label: priority, variant: 'secondary' as BadgeVariant };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
