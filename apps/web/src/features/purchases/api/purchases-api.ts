import { apiClient } from "@/lib/api-client"
import type { VehiclePurchase, PaginatedResponse } from "@/types"

export async function getPurchases(
  params: Record<string, any> = {}
): Promise<PaginatedResponse<VehiclePurchase>> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const response = await apiClient.get(`/purchases?${searchParams.toString()}`)
  return response.data
}

export async function createPurchase(
  data: Partial<VehiclePurchase>
): Promise<VehiclePurchase> {
  const response = await apiClient.post("/purchases", data)
  return response.data
}

export async function deletePurchase(id: string): Promise<void> {
  await apiClient.delete(`/purchases/${id}`)
}
