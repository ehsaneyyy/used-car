import { apiClient } from "@/lib/api-client"
import type { VehicleExpense, PaginatedResponse } from "@/types"

export async function getExpenses(
  params: Record<string, any> = {}
): Promise<PaginatedResponse<VehicleExpense>> {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const response = await apiClient.get(`/expenses?${searchParams.toString()}`)
  return response.data
}

export async function createExpense(
  data: Partial<VehicleExpense>
): Promise<VehicleExpense> {
  const response = await apiClient.post("/expenses", data)
  return response.data
}

export async function deleteExpense(id: string): Promise<void> {
  await apiClient.delete(`/expenses/${id}`)
}
