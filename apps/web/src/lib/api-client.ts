import axios from "axios"
import { toast } from "sonner"
import { setupMockInterceptor } from "./mock-interceptor"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
})

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
  setupMockInterceptor(apiClient)
}

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.detail || error.message

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token")
        window.location.href = "/login"
      }
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action")
    } else if (status === 404) {
      toast.error("Resource not found")
    } else if (status && status >= 500) {
      toast.error("Something went wrong. Please try again.")
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  }
)
