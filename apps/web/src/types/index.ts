export type VehicleStatus =
  | "available"
  | "reserved"
  | "sold"
  | "in_transit"
  | "in_service"
  | "archived"

export type UserRole = "owner" | "admin" | "manager" | "staff"

export type ExpenseType =
  | "repair"
  | "maintenance"
  | "cleaning"
  | "transport"
  | "registration"
  | "insurance"
  | "storage"
  | "marketing"
  | "other"

export interface User {
  id: string
  email: string
  full_name: string
  organization_id: string
  branch_id: string | null
  role: UserRole
  avatar_url: string | null
  is_active: boolean
  created_at: string
}

export interface Organization {
  id: string
  name: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  created_at: string
}

export interface Branch {
  id: string
  organization_id: string
  name: string
  address: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Vehicle {
  id: string
  organization_id: string
  branch_id: string | null
  make: string
  model: string
  year: number
  vin: string
  mileage: number
  price: number
  cost: number
  color: string
  fuel_type: string
  transmission: string
  body_type: string
  engine_size: string | null
  license_plate: string | null
  status: VehicleStatus
  description: string | null
  primary_photo_url: string | null
  photos_count: number
  expenses_total: number
  purchased_at: string | null
  sold_at: string | null
  sold_price: number | null
  created_at: string
  updated_at: string
}

export interface VehiclePhoto {
  id: string
  vehicle_id: string
  url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface VehiclePurchase {
  id: string
  vehicle_id: string
  organization_id: string
  seller_name: string
  seller_phone: string | null
  seller_email: string | null
  purchase_price: number
  purchase_date: string
  notes: string | null
  created_at: string
}

export interface VehicleExpense {
  id: string
  vehicle_id: string
  organization_id: string
  category: ExpenseType
  description: string
  amount: number
  date: string
  vendor: string | null
  receipt_url: string | null
  created_at: string
}

export interface VehicleDocument {
  id: string
  vehicle_id: string
  organization_id: string
  name: string
  type: string
  file_url: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface VehicleStatusHistory {
  id: string
  vehicle_id: string
  from_status: VehicleStatus | null
  to_status: VehicleStatus
  changed_by: string
  changed_by_name: string
  notes: string | null
  created_at: string
}

export interface DashboardStats {
  total_vehicles: number
  active_vehicles: number
  sold_vehicles: number
  reserved_vehicles: number
  total_revenue: number
  total_expenses: number
  total_purchases: number
  monthly_revenue: number
}

export interface MonthlyData {
  month: string
  revenue: number
  expenses: number
  purchases: number
}

export interface ActivityItem {
  id: string
  type: "purchase" | "expense" | "status_change" | "document" | "vehicle_added"
  description: string
  amount?: number
  vehicle_info?: string
  created_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
  organization_name: string
}

export interface AuthResponse {
  access_token: string
  user: User & { organization_name: string; branch_name: string | null }
}
