"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getExpenses, createExpense, deleteExpense } from "../api/expenses-api"

export function useExpenses(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => getExpenses(params),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      toast.success("Expense added")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to add expense")
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
      toast.success("Expense deleted")
    },
  })
}
