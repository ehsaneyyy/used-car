"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { VehicleDetailInfo } from "@/features/vehicles/components/vehicle-detail-info"
import { VehicleDetailSidebar } from "@/features/vehicles/components/vehicle-detail-sidebar"
import { VehiclePhotoGallery } from "@/features/vehicles/components/vehicle-photo-gallery"
import { DeleteVehicleDialog } from "@/features/vehicles/components/delete-vehicle-dialog"
import { useVehicle, useDeleteVehicle } from "@/features/vehicles/hooks/use-vehicles"
import Link from "next/link"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const { data: vehicle, isLoading } = useVehicle(vehicleId)
  const deleteMutation = useDeleteVehicle()
  const [showDelete, setShowDelete] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">Vehicle not found</h2>
        <p className="text-muted-foreground">
          This vehicle may have been deleted.
        </p>
        <Button asChild className="mt-4">
          <Link href="/vehicles">Back to vehicles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <PageHeader
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            description={`VIN: ${vehicle.vin}`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/vehicles/${vehicleId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <VehicleDetailInfo vehicle={vehicle} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <VehiclePhotoGallery vehicleId={vehicleId} />
        </div>
        <div>
          <VehicleDetailSidebar
            vehicleId={vehicleId}
            currentStatus={vehicle.status}
          />
        </div>
      </div>

      <DeleteVehicleDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={() => deleteMutation.mutate(vehicleId)}
        isPending={deleteMutation.isPending}
        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />
    </div>
  )
}
