"use client"

import { useState } from "react"
import { Plus, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { ExpenseForm } from "@/features/expenses/components/expense-form"
import { useExpenses } from "@/features/expenses/hooks/use-expenses"
import { formatCurrency, formatDate } from "@/lib/utils"

const categoryLabels: Record<string, string> = {
  repair: "Repair",
  maintenance: "Maintenance",
  cleaning: "Cleaning",
  transport: "Transport",
  registration: "Registration",
  insurance: "Insurance",
  storage: "Storage",
  marketing: "Marketing",
  other: "Other",
}

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState("all")
  const { data, isLoading } = useExpenses({
    per_page: 50,
    ...(category !== "all" ? { category } : {}),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track all your vehicle expenses"
        action={{
          label: "Add Expense",
          onClick: () => setShowForm(true),
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex items-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : !data?.items || data.items.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No expenses recorded"
          description="Record your first expense to start tracking costs"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.vehicle_id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabels[expense.category] || expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.vendor || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ExpenseForm open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
