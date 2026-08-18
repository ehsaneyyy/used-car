import { apiClient } from "@/lib/api-client"
import type { VehicleDocument, PaginatedResponse } from "@/types"

export async function getDocuments(
  params: Record<string, any> = {}
): Promise<PaginatedResponse<VehicleDocument>> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const response = await apiClient.get(`/documents?${searchParams.toString()}`)
  return response.data
}

export async function uploadDocument(
  vehicleId: string,
  file: File,
  name: string
): Promise<VehicleDocument> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("name", name)
  formData.append("vehicle_id", vehicleId)
  const response = await apiClient.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export async function deleteDocument(id: string): Promise<void> {
  await apiClient.delete(`/documents/${id}`)
}
