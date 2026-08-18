import { Car, DollarSign, TrendingUp, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"
import type { DashboardStats } from "@/types"

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

const statCards = [
  {
    title: "Total Vehicles",
    key: "total_vehicles" as const,
    icon: Car,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-600/10",
  },
  {
    title: "Active Inventory",
    key: "active_vehicles" as const,
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-600/10",
  },
  {
    title: "Total Revenue",
    key: "total_revenue" as const,
    icon: DollarSign,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-600/10",
    format: "currency" as const,
  },
  {
    title: "Total Purchases",
    key: "total_purchases" as const,
    icon: ShoppingCart,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-600/10",
    format: "currency" as const,
  },
]

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.format === "currency"
                ? formatCurrency(stats?.[card.key] ?? 0)
                : formatNumber(stats?.[card.key] ?? 0)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
