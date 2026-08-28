export interface Organization {
  id: string;
  name: string;
  type: string;
  description?: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  joinedAt: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  type: string;
  memberCount: number;
}
