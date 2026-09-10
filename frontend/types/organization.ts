export interface Organization {
  id: string;
  referenceId: string;
  name: string;
  shortName: string;
  orgType: string;
  verificationStatus: string;
  geography: string;
  contactEmail: string;
  active: boolean;
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
