import { apiClient } from "@/lib/api-client"
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types"

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/login", data)
  return response.data
}

export async function registerUser(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/register", data)
  return response.data
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me")
  return response.data
}

export async function refreshToken() {
  const response = await apiClient.post("/auth/refresh")
  return response.data
}
