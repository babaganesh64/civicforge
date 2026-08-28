export enum BulkOperationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
}

export interface BulkJobRequest {
  operationType: string;
  itemIds: string[];
  parameters?: Record<string, any>;
}

export interface BulkJobResponse {
  id: string;
  operationType: string;
  status: BulkOperationStatus;
  totalItems: number;
  successCount: number;
  errorCount: number;
  requestedAt: string;
  completedAt?: string;
}
