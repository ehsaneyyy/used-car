"use client"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VehicleForm } from "@/features/vehicles/components/vehicle-form"
import { useCreateVehicle } from "@/features/vehicles/hooks/use-vehicles"

export default function NewVehiclePage() {
  const createMutation = useCreateVehicle()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Vehicle"
        description="Add a new vehicle to your inventory"
      />
      <Card>
        <CardContent className="p-6">
          <VehicleForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
