"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AuthUser {
  id: string
  email: string
  full_name: string
  organization_id: string
  organization_name: string
  branch_id: string | null
  branch_name: string | null
  role: "owner" | "admin" | "manager" | "staff"
  avatar_url: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null })
        localStorage.removeItem("auth-token")
        window.location.href = "/login"
      },
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)
