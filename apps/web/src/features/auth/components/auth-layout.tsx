"use client"

import { Car } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 items-center justify-center bg-muted lg:flex">
        <div className="max-w-md space-y-6 px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Car className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">DoDealers</h1>
          <p className="text-muted-foreground">
            Manage your vehicle inventory, track expenses, and grow your
            dealership — all in one place.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  )
}
