export enum BulkOperationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
}

export interface BulkOperation {
  id: string;
  operationType: string;
  status: BulkOperationStatus;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface BulkOperationItem {
  id: string;
  bulkOperationId: string;
  targetId: string;
  status: string;
  errorDetail?: string;
}
