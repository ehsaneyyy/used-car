"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getOrganization,
  updateOrganization,
  getBranches,
  createBranch,
  deleteBranch,
  getUsers,
  inviteUser,
  updateUserRole,
  deactivateUser,
} from "../api/settings-api"

export function useOrganization() {
  return useQuery({
    queryKey: ["settings", "organization"],
    queryFn: getOrganization,
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "organization"] })
      toast.success("Organization updated")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update")
    },
  })
}

export function useBranches() {
  return useQuery({
    queryKey: ["settings", "branches"],
    queryFn: getBranches,
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branches"] })
      toast.success("Branch created")
    },
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "branches"] })
      toast.success("Branch deleted")
    },
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ["settings", "users"],
    queryFn: getUsers,
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "users"] })
      toast.success("Invitation sent")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to invite user")
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "users"] })
      toast.success("Role updated")
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "users"] })
      toast.success("User deactivated")
    },
  })
}
