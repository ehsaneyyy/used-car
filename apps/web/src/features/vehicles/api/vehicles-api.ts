import { apiClient } from "@/lib/api-client"
import type { Vehicle, VehiclePhoto, VehicleStatusHistory, PaginatedResponse } from "@/types"

interface VehicleFilters {
  search?: string
  status?: string
  make?: string
  year_from?: number
  year_to?: number
  price_min?: number
  price_max?: number
  sort?: string
  order?: "asc" | "desc"
  page?: number
  per_page?: number
}

export async function getVehicles(
  filters: VehicleFilters = {}
): Promise<PaginatedResponse<Vehicle>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.append(key, String(value))
    }
  })
  const response = await apiClient.get(`/vehicles?${params.toString()}`)
  return response.data
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const response = await apiClient.get(`/vehicles/${id}`)
  return response.data
}

export async function createVehicle(
  data: Partial<Vehicle>
): Promise<Vehicle> {
  const response = await apiClient.post("/vehicles", data)
  return response.data
}

export async function updateVehicle(
  id: string,
  data: Partial<Vehicle>
): Promise<Vehicle> {
  const response = await apiClient.patch(`/vehicles/${id}`, data)
  return response.data
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`)
}

export async function getVehiclePhotos(
  vehicleId: string
): Promise<VehiclePhoto[]> {
  const response = await apiClient.get(`/vehicles/${vehicleId}/photos`)
  return response.data
}

export async function uploadVehiclePhoto(
  vehicleId: string,
  file: File,
  caption?: string
): Promise<VehiclePhoto> {
  const formData = new FormData()
  formData.append("file", file)
  if (caption) formData.append("caption", caption)
  const response = await apiClient.post(
    `/vehicles/${vehicleId}/photos`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )
  return response.data
}

export async function deleteVehiclePhoto(
  vehicleId: string,
  photoId: string
): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}/photos/${photoId}`)
}

export async function getVehicleStatusHistory(
  vehicleId: string
): Promise<VehicleStatusHistory[]> {
  const response = await apiClient.get(
    `/vehicles/${vehicleId}/status-history`
  )
  return response.data
}

export async function updateVehicleStatus(
  vehicleId: string,
  status: string,
  notes?: string
): Promise<void> {
  await apiClient.patch(`/vehicles/${vehicleId}/status`, {
    status,
    notes,
  })
}
