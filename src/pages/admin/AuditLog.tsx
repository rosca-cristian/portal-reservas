import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, RefreshCw } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import type { AuditLogEntry, AuditActionType } from '@/types/auditLog'
import { exportToCSV } from '@/utils/exportToCSV'
import AuditLogTable from '@/components/admin/AuditLogTable'

const ACTION_TYPES: AuditActionType[] = ['CREATED', 'MODIFIED', 'CANCELLED', 'JOINED', 'ADMIN_CANCELLED', 'COMPLETED']

export default function AuditLog() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [actionType, setActionType] = useState<string>('')
  const [user, setUser] = useState('')

  const fetchAuditLog = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      if (actionType) params.actionType = actionType
      if (user) params.user = user

      const response = await apiClient.get('/api/admin/audit-log', { params })
      setAuditLog(response.data.data)
    } catch (error) {
      console.error('Error fetching audit log:', error)
      setAuditLog([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLog()
  }, [dateFrom, dateTo, actionType, user])

  const handleExport = () => {
    const exportData = auditLog.map(entry => ({
      Timestamp: new Date(entry.timestamp).toLocaleString(),
      User: entry.userName,
      Role: entry.userRole,
      Action: entry.action,
      'Reservation ID': entry.reservationId,
      Details: entry.details,
      Reason: entry.metadata?.reason || '',
      Notes: entry.metadata?.notes || '',
    }))

    exportToCSV(exportData, `audit-log-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleClearFilters = () => {
    setDateFrom('')
    setDateTo('')
    setActionType('')
    setUser('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <div className="flex gap-2">
          <Button onClick={fetchAuditLog} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger id="actionType">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  {ACTION_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Input
                id="user"
                type="text"
                placeholder="Search by user name..."
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <AuditLogTable auditLog={auditLog} loading={loading} onRefresh={fetchAuditLog} />
    </div>
  )
}
