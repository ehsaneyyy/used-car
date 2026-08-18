"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useVehicleStatusHistory, useUpdateVehicleStatus } from "../hooks/use-vehicles"
import { formatDate } from "@/lib/utils"
import type { VehicleStatus } from "@/types"

interface VehicleDetailSidebarProps {
  vehicleId: string
  currentStatus: VehicleStatus
}

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "in_transit", label: "In Transit" },
  { value: "in_service", label: "In Service" },
  { value: "archived", label: "Archived" },
]

export function VehicleDetailSidebar({
  vehicleId,
  currentStatus,
}: VehicleDetailSidebarProps) {
  const [newStatus, setNewStatus] = useState<VehicleStatus>(currentStatus)
  const [notes, setNotes] = useState("")
  const updateStatus = useUpdateVehicleStatus(vehicleId)
  const { data: history, isLoading } = useVehicleStatusHistory(vehicleId)

  const handleUpdate = () => {
    updateStatus.mutate(
      { status: newStatus, notes: notes || undefined },
      {
        onSuccess: () => setNotes(""),
      }
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select
            value={newStatus}
            onValueChange={(v) => setNewStatus(v as VehicleStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add a note (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
          <Button
            className="w-full"
            onClick={handleUpdate}
            disabled={updateStatus.isPending || newStatus === currentStatus}
          >
            Update Status
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No status changes yet</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {entry.from_status && (
                        <>
                          <Badge variant="outline" className="text-[10px]">
                            {entry.from_status.replace("_", " ")}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                        </>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {entry.to_status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.changed_by_name} · {formatDate(entry.created_at)}
                    </p>
                    {entry.notes && (
                      <p className="mt-1 text-xs">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
