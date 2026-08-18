"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclePhotos,
  uploadVehiclePhoto,
  deleteVehiclePhoto,
  getVehicleStatusHistory,
  updateVehicleStatus,
} from "../api/vehicles-api"
import type { VehicleStatus } from "@/types"

interface VehicleListFilters {
  search?: string
  status?: string
  make?: string
  year_from?: number
  year_to?: number
  price_min?: number
  price_max?: number
  sort?: string
  order?: "asc" | "desc"
  page?: number
  per_page?: number
}

export function useVehicles(filters: VehicleListFilters = {}) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => getVehicles(filters),
  })
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  })
}

export function useCreateVehicle() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle added successfully")
      router.push(`/vehicles/${data.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create vehicle")
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      updateVehicle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      queryClient.invalidateQueries({ queryKey: ["vehicles", id] })
      toast.success("Vehicle updated successfully")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update vehicle")
    },
  })
}

export function useDeleteVehicle() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle deleted")
      router.push("/vehicles")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete vehicle")
    },
  })
}

export function useVehiclePhotos(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicles", vehicleId, "photos"],
    queryFn: () => getVehiclePhotos(vehicleId),
    enabled: !!vehicleId,
  })
}

export function useUploadVehiclePhoto(vehicleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      uploadVehiclePhoto(vehicleId, file, caption),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", vehicleId, "photos"],
      })
      toast.success("Photo uploaded")
    },
    onError: () => {
      toast.error("Failed to upload photo")
    },
  })
}

export function useDeleteVehiclePhoto(vehicleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: string) => deleteVehiclePhoto(vehicleId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", vehicleId, "photos"],
      })
      toast.success("Photo deleted")
    },
  })
}

export function useVehicleStatusHistory(vehicleId: string) {
  return useQuery({
    queryKey: ["vehicles", vehicleId, "status-history"],
    queryFn: () => getVehicleStatusHistory(vehicleId),
    enabled: !!vehicleId,
  })
}

export function useUpdateVehicleStatus(vehicleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      status,
      notes,
    }: {
      status: VehicleStatus
      notes?: string
    }) => updateVehicleStatus(vehicleId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", vehicleId],
      })
      queryClient.invalidateQueries({
        queryKey: ["vehicles", vehicleId, "status-history"],
      })
      toast.success("Status updated")
    },
  })
}
