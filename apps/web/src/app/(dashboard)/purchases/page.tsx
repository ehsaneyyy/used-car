"use client"

import { useState } from "react"
import { Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { PurchaseForm } from "@/features/purchases/components/purchase-form"
import { usePurchases } from "@/features/purchases/hooks/use-purchases"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function PurchasesPage() {
  const [showForm, setShowForm] = useState(false)
  const { data, isLoading } = usePurchases({ per_page: 50 })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Track all your vehicle purchases"
        action={{
          label: "Record Purchase",
          onClick: () => setShowForm(true),
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-8 w-8" />}
          title="No purchases recorded"
          description="Record your first vehicle purchase to get started"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record Purchase
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">
                    {purchase.vehicle_id}
                  </TableCell>
                  <TableCell>{purchase.seller_name}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(purchase.purchase_price)}
                  </TableCell>
                  <TableCell>{formatDate(purchase.purchase_date)}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {purchase.notes || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PurchaseForm open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
