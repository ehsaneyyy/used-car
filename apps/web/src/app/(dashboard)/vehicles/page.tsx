"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Plus, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { VehicleFilters } from "@/features/vehicles/components/vehicle-filters"
import { VehicleStatusBadge } from "@/features/vehicles/components/vehicle-status-badge"
import { EmptyState } from "@/components/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useVehicles } from "@/features/vehicles/hooks/use-vehicles"
import { formatCurrency } from "@/lib/utils"

export default function VehiclesListPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)

  const filters = {
    search,
    status: status === "all" ? "" : status,
    page,
    per_page: 12,
  }

  const { data, isLoading } = useVehicles(filters)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value)
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setSearch("")
    setStatus("all")
    setPage(1)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description={`${data?.total ?? 0} vehicles in your inventory`}
        action={{
          label: "Add Vehicle",
          onClick: () => {},
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <VehicleFilters
        filters={{ search, status }}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onReset={handleReset}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-3">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          icon={<Car className="h-8 w-8" />}
          title="No vehicles found"
          description={
            search || status !== "all"
              ? "Try adjusting your filters"
              : "Add your first vehicle to get started"
          }
          action={
            !search && status === "all" ? (
              <Button asChild>
                <Link href="/vehicles/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="mb-3 aspect-[16/10] overflow-hidden rounded-lg bg-muted">
                  {vehicle.primary_photo_url ? (
                    <img
                      src={vehicle.primary_photo_url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Car className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <VehicleStatusBadge
                      status={vehicle.status}
                      className="shrink-0"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.mileage.toLocaleString()} miles · {vehicle.color} ·{" "}
                    {vehicle.fuel_type}
                  </p>
                  <div className="flex items-center justify-between border-t pt-2">
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(vehicle.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.photos_count} photos
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {data.total_pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                disabled={page === data.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
