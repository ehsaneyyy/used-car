import { apiClient } from "@/lib/api-client"
import type { DashboardStats, MonthlyData, ActivityItem } from "@/types"

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get("/dashboard/stats")
  return response.data
}

export async function getMonthlyData(): Promise<MonthlyData[]> {
  const response = await apiClient.get("/dashboard/monthly")
  return response.data
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const response = await apiClient.get("/dashboard/activity")
  return response.data
}
