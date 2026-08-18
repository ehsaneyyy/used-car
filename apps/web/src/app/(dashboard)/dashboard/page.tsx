"use client"

import { useAuthStore } from "@/stores/auth-store"
import { PageHeader } from "@/components/page-header"
import { StatsCards } from "@/features/dashboard/components/stats-cards"
import { ChartsOverview } from "@/features/dashboard/components/charts-overview"
import { RecentActivity } from "@/features/dashboard/components/recent-activity"
import { RecentVehicles } from "@/features/dashboard/components/recent-vehicles"
import {
  useDashboardStats,
  useMonthlyData,
  useRecentActivity,
} from "@/features/dashboard/hooks/use-dashboard"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Vehicle } from "@/types"

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyData()
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity()

  const { data: recentVehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles", { limit: 5, sort: "created_at", order: "desc" }],
    queryFn: async () => {
      const response = await apiClient.get("/vehicles", {
        params: { limit: 5, sort: "created_at", order: "desc" },
      })
      return response.data.items as Vehicle[]
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(" ")[0] || "there"}`}
        description="Here's an overview of your dealership"
      />

      <StatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ChartsOverview data={monthlyData} isLoading={monthlyLoading} />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity activities={activities} isLoading={activitiesLoading} />
        </div>
      </div>

      <RecentVehicles vehicles={recentVehicles} isLoading={vehiclesLoading} />
    </div>
  )
}
