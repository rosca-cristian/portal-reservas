import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import type { AuditLogEntry, AuditActionType } from '@/types/auditLog'

interface AuditLogTableProps {
  auditLog: AuditLogEntry[]
  loading: boolean
  onRefresh: () => void
}

const actionColors: Record<AuditActionType, string> = {
  CREATED: 'bg-green-100 text-green-800',
  MODIFIED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-orange-100 text-orange-800',
  JOINED: 'bg-purple-100 text-purple-800',
  ADMIN_CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
}

const formatAction = (action: AuditActionType): string => {
  return action.replace('_', ' ')
}

export default function AuditLogTable({ auditLog, loading, onRefresh }: AuditLogTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (auditLog.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No audit log entries found</p>
        <Button onClick={onRefresh} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Reservation ID</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLog.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="text-sm">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{entry.userName}</div>
                <div className="text-sm text-gray-500">{entry.userId}</div>
              </TableCell>
              <TableCell>
                <Badge className={entry.userRole === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                  {entry.userRole}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={actionColors[entry.action] || 'bg-gray-100 text-gray-800'}>
                  {formatAction(entry.action)}
                </Badge>
              </TableCell>
              <TableCell>
                <a
                  href={`/admin/reservations?id=${entry.reservationId}`}
                  className="text-blue-600 hover:underline"
                >
                  {entry.reservationId}
                </a>
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  <div>{entry.details}</div>
                  {entry.metadata?.reason && (
                    <div className="text-sm text-gray-500 mt-1">
                      Reason: {entry.metadata.reason}
                    </div>
                  )}
                  {entry.metadata?.notes && (
                    <div className="text-sm text-gray-500">
                      Notes: {entry.metadata.notes}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
