export type AuditActionType =
  | 'CREATED'
  | 'MODIFIED'
  | 'CANCELLED'
  | 'JOINED'
  | 'ADMIN_CANCELLED'
  | 'COMPLETED'

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: 'admin' | 'user'
  action: AuditActionType
  reservationId: string
  details: string
  metadata?: {
    reason?: string
    notes?: string
    previousStatus?: string
    newStatus?: string
  }
}

export interface AuditLogFilters {
  dateFrom?: string
  dateTo?: string
  actionType?: AuditActionType[]
  user?: string
  page?: number
  limit?: number
}
