"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginUser, registerUser, getCurrentUser } from "../api/auth-api"
import { useAuthStore } from "@/stores/auth-store"
import type { LoginRequest, RegisterRequest } from "@/types"

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.access_token)
      setAuth(data.access_token, data.user)
      toast.success("Welcome back!")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Invalid email or password"
      toast.error(message)
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (data) => {
      localStorage.setItem("auth-token", data.access_token)
      setAuth(data.access_token, data.user)
      toast.success("Account created successfully!")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail || "Registration failed"
      toast.error(message)
    },
  })
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  return () => {
    queryClient.clear()
    logout()
  }
}
