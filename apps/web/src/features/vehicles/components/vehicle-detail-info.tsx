import { Card, CardContent } from "@/components/ui/card"
import { VehicleStatusBadge } from "./vehicle-status-badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Calendar,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Hash,
  MapPin,
} from "lucide-react"
import type { Vehicle } from "@/types"

interface VehicleDetailInfoProps {
  vehicle: Vehicle
}

const infoItems = [
  { icon: Hash, label: "VIN", key: "vin" },
  { icon: Calendar, label: "Year", key: "year" },
  { icon: Palette, label: "Color", key: "color" },
  { icon: Gauge, label: "Mileage", key: "mileage", format: "mileage" },
  { icon: Fuel, label: "Fuel", key: "fuel_type" },
  { icon: Settings, label: "Transmission", key: "transmission" },
  { icon: MapPin, label: "Body", key: "body_type" },
]

export function VehicleDetailInfo({ vehicle }: VehicleDetailInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-sm text-muted-foreground">
              {vehicle.license_plate && `${vehicle.license_plate} · `}
              {vehicle.engine_size && `${vehicle.engine_size} · `}
              Added {formatDate(vehicle.created_at)}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Selling Price</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Cost</p>
            <p className="text-xl font-bold">{formatCurrency(vehicle.cost)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Profit Margin</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {vehicle.cost > 0
                ? `${(((vehicle.price - vehicle.cost) / vehicle.cost) * 100).toFixed(1)}%`
                : "—"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {infoItems.map((item) => (
            <div key={item.key} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="rounded-md bg-muted p-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">
                  {item.format === "mileage"
                    ? `${vehicle[item.key as keyof Vehicle]?.toLocaleString()} mi`
                    : String(vehicle[item.key as keyof Vehicle] || "—")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {vehicle.description && (
          <div className="mt-4 rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{vehicle.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
