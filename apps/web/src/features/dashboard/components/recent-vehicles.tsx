import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Vehicle } from "@/types"

interface RecentVehiclesProps {
  vehicles: Vehicle[] | undefined
  isLoading: boolean
}

const statusColors: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  reserved: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  sold: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  in_transit: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  in_service: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  archived: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
}

export function RecentVehicles({ vehicles, isLoading }: RecentVehiclesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Vehicles</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/vehicles">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!vehicles || vehicles.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No vehicles yet
          </p>
        ) : (
          <div className="space-y-3">
            {vehicles.slice(0, 5).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vehicle.mileage.toLocaleString()} miles · {vehicle.color}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={statusColors[vehicle.status]}
                  >
                    {vehicle.status.replace("_", " ")}
                  </Badge>
                  <p className="text-sm font-semibold">
                    {formatCurrency(vehicle.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
