import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle } from 'lucide-react'
import type { AdminReservation } from '@/types/reservation'

export const CANCELLATION_REASONS = {
  SPACE_UNAVAILABLE: 'Space Unavailable',
  POLICY_VIOLATION: 'Policy Violation',
  EMERGENCY: 'Emergency',
  OTHER: 'Other',
} as const

interface CancelReservationDialogProps {
  reservation: AdminReservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string, notes: string) => void
}

export default function CancelReservationDialog({
  reservation,
  open,
  onOpenChange,
  onConfirm,
}: CancelReservationDialogProps) {
  const [reason, setReason] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!reason) return

    setSubmitting(true)
    try {
      await onConfirm(reason, notes)
      // Reset form
      setReason('')
      setNotes('')
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setReason('')
    setNotes('')
    onOpenChange(false)
  }

  if (!reservation) return null

  const isGroupReservation = reservation.type === 'group'
  const participantCount = reservation.participants?.length || 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Cancel Reservation
          </DialogTitle>
          <DialogDescription>
            You are about to cancel reservation {reservation.id}.
            {isGroupReservation && ` This will affect ${participantCount} participant(s).`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Cancellation Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CANCELLATION_REASONS).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this cancellation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {isGroupReservation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Group Reservation:</strong> All {participantCount} participant(s) will be notified of this cancellation.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason || submitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {submitting ? 'Cancelling...' : 'Cancel Reservation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
