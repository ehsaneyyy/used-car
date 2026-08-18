"use client"

import { useQuery } from "@tanstack/react-query"
import {
  getDashboardStats,
  getMonthlyData,
  getRecentActivity,
} from "../api/dashboard-api"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  })
}

export function useMonthlyData() {
  return useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: getMonthlyData,
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: getRecentActivity,
  })
}
