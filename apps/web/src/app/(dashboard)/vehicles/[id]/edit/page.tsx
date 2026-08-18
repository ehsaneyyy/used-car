"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { VehicleForm } from "@/features/vehicles/components/vehicle-form"
import { useVehicle, useUpdateVehicle } from "@/features/vehicles/hooks/use-vehicles"
import Link from "next/link"

export default function EditVehiclePage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const { data: vehicle, isLoading } = useVehicle(vehicleId)
  const updateMutation = useUpdateVehicle()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">Vehicle not found</h2>
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
        <PageHeader
          title="Edit Vehicle"
          description={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        />
      </div>
      <Card>
        <CardContent className="p-6">
          <VehicleForm
            initialData={vehicle}
            onSubmit={(data) =>
              updateMutation.mutate(
                { id: vehicleId, data },
                { onSuccess: () => router.push(`/vehicles/${vehicleId}`) }
              )
            }
            isPending={updateMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
