import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Receipt,
  RefreshCw,
  FileText,
  Plus,
} from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { ActivityItem } from "@/types"

interface RecentActivityProps {
  activities: ActivityItem[] | undefined
  isLoading: boolean
}

const activityIcons = {
  purchase: ShoppingCart,
  expense: Receipt,
  status_change: RefreshCw,
  document: FileText,
  vehicle_added: Plus,
}

const activityColors = {
  purchase: "text-emerald-600 dark:text-emerald-400",
  expense: "text-red-600 dark:text-red-400",
  status_change: "text-blue-600 dark:text-blue-400",
  document: "text-violet-600 dark:text-violet-400",
  vehicle_added: "text-amber-600 dark:text-amber-400",
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {(!activities || activities.length === 0) && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No recent activity
          </p>
        )}
        {activities && activities.length > 0 && (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              const color = activityColors[activity.type]
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full bg-muted p-1.5`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(activity.created_at)}</span>
                      {activity.amount !== undefined && (
                        <>
                          <span>·</span>
                          <span className="font-medium">
                            {formatCurrency(activity.amount)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
