export enum RequestStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface CollaborationRequest {
  id: string;
  challengeId: string;
  organizationId: string;
  organizationName: string;
  contactPerson: string;
  proposalText: string;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  INITIATED = 'INITIATED',
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  role: string;
  joinedAt: string;
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED'
}

export interface Deliverable {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  fileUrl?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  feedback?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  deliverables: Deliverable[];
}

export interface ImpactMetric {
  id: string;
  projectId: string;
  metricName: string;
  metricValue: string | number;
  unit: string;
  measuredAt: string;
}

export interface Project {
  id: string;
  challengeId: string;
  challengeTitle: string;
  title: string;
  description: string;
  status: ProjectStatus;
  organizationId: string;
  organizationName: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  members: ProjectMember[];
  milestones: Milestone[];
  impactMetrics: ImpactMetric[];
}
