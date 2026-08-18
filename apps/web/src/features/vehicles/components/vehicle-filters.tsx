"use client"

import { SearchInput } from "@/components/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface VehicleFiltersProps {
  filters: {
    search: string
    status: string
  }
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onReset: () => void
}

export function VehicleFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onReset,
}: VehicleFiltersProps) {
  const hasActiveFilters = filters.status !== "all"

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchInput
        placeholder="Search vehicles..."
        value={filters.search}
        onChange={onSearchChange}
        className="w-full sm:max-w-xs"
      />
      <Select
        value={filters.status}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
          <SelectItem value="in_service">In Service</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
