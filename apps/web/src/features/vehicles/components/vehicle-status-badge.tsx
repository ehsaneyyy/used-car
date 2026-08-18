import { Badge } from "@/components/ui/badge"
import type { VehicleStatus } from "@/types"

const statusConfig: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  reserved: {
    label: "Reserved",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  sold: {
    label: "Sold",
    className: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  },
  in_transit: {
    label: "In Transit",
    className: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  },
  in_service: {
    label: "In Service",
    className: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  },
  archived: {
    label: "Archived",
    className: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
  },
}

interface VehicleStatusBadgeProps {
  status: VehicleStatus
  className?: string
}

export function VehicleStatusBadge({
  status,
  className,
}: VehicleStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.available

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  )
}
