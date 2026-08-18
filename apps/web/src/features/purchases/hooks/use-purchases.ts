"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPurchases, createPurchase, deletePurchase } from "../api/purchases-api"

export function usePurchases(params: Record<string, any> = {}) {
  return useQuery({
    queryKey: ["purchases", params],
    queryFn: () => getPurchases(params),
  })
}

export function useCreatePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      toast.success("Purchase recorded")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to record purchase")
    },
  })
}

export function useDeletePurchase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
      toast.success("Purchase deleted")
    },
  })
}
