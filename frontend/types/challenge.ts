export enum ChallengeStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  CLARIFICATION_REQUIRED = 'CLARIFICATION_REQUIRED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  CLASSIFIED = 'CLASSIFIED',
  PRIORITIZED = 'PRIORITIZED',
  ROUTED = 'ROUTED',
  PUBLISHED = 'PUBLISHED',
  INTERESTED = 'INTERESTED',
  ACCEPTED = 'ACCEPTED',
  PROJECT_FORMED = 'PROJECT_FORMED',
  IN_PROGRESS = 'IN_PROGRESS',
  PILOT = 'PILOT',
  DEPLOYED = 'DEPLOYED',
  IMPACT_MEASURED = 'IMPACT_MEASURED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export enum ChallengePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ChallengeListItem {
 id: string;
 referenceNumber: string;
 title: string;
 category: string;
 stateProvince: string;
 city: string;
 status: ChallengeStatus;
 priority: ChallengePriority | null;
 submittedBy: string;
 submittedAt: string;
 updatedAt: string;
 isPublic: boolean;
}

export interface EvidenceItem {
 id: string;
 fileId: string;
 fileName: string;
 description: string | null;
 uploadedAt: string;
}

export interface HistoryItem {
 id: string;
 fromStatus: string | null;
 toStatus: string;
 action: string;
 actorEmail: string | null;
 notes: string | null;
 createdAt: string;
}

export interface AiAnalysisSummary {
 status: string;
 suggestedCategory: string | null;
 suggestedPriority: string | null;
 summary: string | null;
 explanation: string | null;
 confidenceScore: number | null;
 humanOverride: boolean;
}

export interface ChallengeDetailResponse {
 id: string;
 referenceNumber: string;
 title: string;
 description: string;
 category: string;
 subCategory: string | null;
 locationDescription: string | null;
 stateProvince: string | null;
 city: string | null;
 pincode: string | null;
 latitude: number | null;
 longitude: number | null;
 affectedPopulationEstimate: number | null;
 affectedPopulationNotes: string | null;
 urgency: string | null;
 expectedOutcome: string | null;
 consentGiven: boolean;
 status: ChallengeStatus;
 priority: ChallengePriority | null;
 submittedBy: string;
 submittedAt: string;
 verifiedAt: string | null;
 rejectionReason: string | null;
 clarificationRequest: string | null;
 isPublic: boolean;
 createdAt: string;
 updatedAt: string;
 evidence: EvidenceItem[];
 history: HistoryItem[];
 aiAnalysis: AiAnalysisSummary | null;
 validActions: string[];
}

export interface SubmitChallengeRequest {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  urgency?: string;
  locationDescription?: string;
  stateProvince: string;
  city: string;
  pincode: string;
  affectedPopulationEstimate?: number;
  affectedPopulationNotes?: string;
  expectedOutcome?: string;
  consentGiven: boolean;
}
