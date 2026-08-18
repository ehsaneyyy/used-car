import { apiClient } from "@/lib/api-client"
import type { Organization, Branch, User } from "@/types"

export async function getOrganization(): Promise<Organization> {
  const response = await apiClient.get("/organizations/current")
  return response.data
}

export async function updateOrganization(
  data: Partial<Organization>
): Promise<Organization> {
  const response = await apiClient.patch("/organizations/current", data)
  return response.data
}

export async function getBranches(): Promise<Branch[]> {
  const response = await apiClient.get("/branches")
  return response.data
}

export async function createBranch(data: Partial<Branch>): Promise<Branch> {
  const response = await apiClient.post("/branches", data)
  return response.data
}

export async function updateBranch(
  id: string,
  data: Partial<Branch>
): Promise<Branch> {
  const response = await apiClient.patch(`/branches/${id}`, data)
  return response.data
}

export async function deleteBranch(id: string): Promise<void> {
  await apiClient.delete(`/branches/${id}`)
}

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get("/users")
  return response.data
}

export async function inviteUser(data: {
  email: string
  role: string
  branch_id?: string
}): Promise<User> {
  const response = await apiClient.post("/users/invite", data)
  return response.data
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<User> {
  const response = await apiClient.patch(`/users/${userId}/role`, { role })
  return response.data
}

export async function deactivateUser(userId: string): Promise<void> {
  await apiClient.patch(`/users/${userId}/deactivate`)
}
