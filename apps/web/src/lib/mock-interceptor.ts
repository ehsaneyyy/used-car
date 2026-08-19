import {
  MOCK_USER,
  MOCK_VEHICLES,
  MOCK_MONTHLY_DATA,
  MOCK_ACTIVITIES,
  MOCK_BRANCHES,
  MOCK_ORG,
  MOCK_USERS,
  MOCK_PURCHASES,
  MOCK_EXPENSES,
  MOCK_DOCUMENTS,
} from "./mock-data"

const MOCK_TOKEN = "mock-jwt-token-doedealers-2024"

function delay(ms: number = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function paginate<T>(items: T[], params: URLSearchParams) {
  const page = parseInt(params.get("page") || "1")
  const perPage = parseInt(params.get("per_page") || "20")
  const start = (page - 1) * perPage
  const end = start + perPage
  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    per_page: perPage,
    total_pages: Math.ceil(items.length / perPage),
  }
}

function filterVehicles(params: URLSearchParams) {
  let filtered = [...MOCK_VEHICLES]

  const search = params.get("search")
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q)
    )
  }

  const status = params.get("status")
  if (status) {
    filtered = filtered.filter((v) => v.status === status)
  }

  const make = params.get("make")
  if (make) {
    filtered = filtered.filter(
      (v) => v.make.toLowerCase() === make.toLowerCase()
    )
  }

  const sort = params.get("sort")
  const order = params.get("order") || "desc"
  if (sort) {
    filtered.sort((a: any, b: any) => {
      const aVal = a[sort]
      const bVal = b[sort]
      if (order === "asc") return aVal > bVal ? 1 : -1
      return aVal < bVal ? 1 : -1
    })
  }

  return filtered
}

type MockHandler = {
  method: string
  pattern: RegExp
  handler: (params: any, body?: any, match?: RegExpMatchArray) => Promise<any>
}

const handlers: MockHandler[] = [
  {
    method: "POST",
    pattern: /\/api\/v1\/auth\/login/,
    handler: async (_params, body) => {
      await delay(500)
      if (body?.email && body?.password) {
        return {
          access_token: MOCK_TOKEN,
          user: MOCK_USER,
        }
      }
      throw { response: { data: { detail: "Invalid credentials" }, status: 401 } }
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/auth\/register/,
    handler: async (_params, body) => {
      await delay(500)
      return {
        access_token: MOCK_TOKEN,
        user: { ...MOCK_USER, ...body },
      }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/auth\/me/,
    handler: async () => {
      await delay(200)
      return MOCK_USER
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/dashboard\/stats/,
    handler: async () => {
      await delay(300)
      return {
        total_vehicles: MOCK_VEHICLES.length,
        active_vehicles: MOCK_VEHICLES.filter(
          (v) => v.status === "available"
        ).length,
        sold_vehicles: MOCK_VEHICLES.filter((v) => v.status === "sold").length,
        reserved_vehicles: MOCK_VEHICLES.filter(
          (v) => v.status === "reserved"
        ).length,
        total_revenue: MOCK_VEHICLES.filter((v) => v.sold_price).reduce(
          (sum, v) => sum + (v.sold_price || 0),
          0
        ),
        total_expenses: MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0),
        total_purchases: MOCK_PURCHASES.reduce(
          (sum, p) => sum + p.purchase_price,
          0
        ),
        monthly_revenue: MOCK_ACTIVITIES.length * 15000,
      }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/dashboard\/monthly/,
    handler: async () => {
      await delay(200)
      return MOCK_MONTHLY_DATA
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/dashboard\/activity/,
    handler: async () => {
      await delay(200)
      return MOCK_ACTIVITIES
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/vehicles\/([^/]+)\/status-history/,
    handler: async () => {
      await delay(200)
      return [
        {
          id: "sh-1",
          vehicle_id: "v-1",
          from_status: null,
          to_status: "available",
          changed_by: "user-1",
          changed_by_name: "John Doe",
          notes: "Vehicle added to inventory",
          created_at: "2024-08-15T10:30:00Z",
        },
      ]
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/vehicles\/([^/]+)\/photos/,
    handler: async () => {
      await delay(200)
      return []
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/vehicles\/([^/]+)/,
    handler: async (_params, _body, match) => {
      await delay(200)
      const id = match![1]
      const vehicle = MOCK_VEHICLES.find((v) => v.id === id)
      if (!vehicle) {
        throw { response: { data: { detail: "Not found" }, status: 404 } }
      }
      return vehicle
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/vehicles/,
    handler: async (params) => {
      await delay(300)
      const filtered = filterVehicles(params)
      return paginate(filtered, params)
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/vehicles/,
    handler: async (_params, body) => {
      await delay(500)
      return {
        id: `v-${Date.now()}`,
        ...body,
        status: "available",
        photos_count: 0,
        expenses_total: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
  },
  {
    method: "PATCH",
    pattern: /\/api\/v1\/vehicles\/([^/]+)\/status/,
    handler: async (_params, body) => {
      await delay(300)
      return { success: true }
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/vehicles\/([^/]+)\/photos/,
    handler: async () => {
      await delay(500)
      return { id: `ph-${Date.now()}`, url: "#", created_at: new Date().toISOString() }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/vehicles\/([^/]+)\/photos\/([^/]+)/,
    handler: async () => {
      await delay(200)
      return { success: true }
    },
  },
  {
    method: "PATCH",
    pattern: /\/api\/v1\/vehicles\/([^/]+)/,
    handler: async (_params, body) => {
      await delay(400)
      return { ...body, updated_at: new Date().toISOString() }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/vehicles\/([^/]+)/,
    handler: async () => {
      await delay(300)
      return { success: true }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/purchases/,
    handler: async (params) => {
      await delay(200)
      return paginate(MOCK_PURCHASES, params)
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/purchases/,
    handler: async (_params, body) => {
      await delay(400)
      return { id: `p-${Date.now()}`, ...body, created_at: new Date().toISOString() }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/purchases\/([^/]+)/,
    handler: async () => {
      await delay(200)
      return { success: true }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/expenses/,
    handler: async (params) => {
      await delay(200)
      let filtered = [...MOCK_EXPENSES]
      const category = params.get("category")
      if (category) {
        filtered = filtered.filter((e) => e.category === category)
      }
      return paginate(filtered, params)
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/expenses/,
    handler: async (_params, body) => {
      await delay(400)
      return { id: `e-${Date.now()}`, ...body, created_at: new Date().toISOString() }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/expenses\/([^/]+)/,
    handler: async () => {
      await delay(200)
      return { success: true }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/documents/,
    handler: async (params) => {
      await delay(200)
      return paginate(MOCK_DOCUMENTS, params)
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/documents/,
    handler: async () => {
      await delay(500)
      return {
        id: `d-${Date.now()}`,
        name: "Uploaded Document",
        type: "pdf",
        file_url: "#",
        file_size: 100000,
        created_at: new Date().toISOString(),
      }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/documents\/([^/]+)/,
    handler: async () => {
      await delay(200)
      return { success: true }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/organizations\/current/,
    handler: async () => {
      await delay(200)
      return MOCK_ORG
    },
  },
  {
    method: "PATCH",
    pattern: /\/api\/v1\/organizations\/current/,
    handler: async (_params, body) => {
      await delay(400)
      return { ...MOCK_ORG, ...body }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/branches/,
    handler: async () => {
      await delay(200)
      return MOCK_BRANCHES
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/branches/,
    handler: async (_params, body) => {
      await delay(400)
      return {
        id: `branch-${Date.now()}`,
        organization_id: "org-1",
        is_active: true,
        ...body,
        created_at: new Date().toISOString(),
      }
    },
  },
  {
    method: "DELETE",
    pattern: /\/api\/v1\/branches\/([^/]+)/,
    handler: async () => {
      await delay(200)
      return { success: true }
    },
  },
  {
    method: "GET",
    pattern: /\/api\/v1\/users/,
    handler: async () => {
      await delay(200)
      return MOCK_USERS
    },
  },
  {
    method: "POST",
    pattern: /\/api\/v1\/users\/invite/,
    handler: async (_params, body) => {
      await delay(400)
      return {
        id: `user-${Date.now()}`,
        ...body,
        is_active: false,
        created_at: new Date().toISOString(),
      }
    },
  },
  {
    method: "PATCH",
    pattern: /\/api\/v1\/users\/([^/]+)\/role/,
    handler: async () => {
      await delay(300)
      return { success: true }
    },
  },
  {
    method: "PATCH",
    pattern: /\/api\/v1\/users\/([^/]+)\/deactivate/,
    handler: async () => {
      await delay(300)
      return { success: true }
    },
  },
]

function matchRoute(
  method: string,
  url: string
): { handler: MockHandler; match: RegExpMatchArray; params: URLSearchParams } | null {
  const [path, queryString] = url.split("?")
  const params = new URLSearchParams(queryString || "")

  for (const handler of handlers) {
    if (handler.method === method) {
      const match = path.match(handler.pattern)
      if (match) {
        return { handler, match, params }
      }
    }
  }
  return null
}

export function setupMockInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.request.use(async (config: any) => {
    if (typeof window === "undefined") return config

    const urlPath = config.url || ""
    const fullUrl = urlPath.startsWith("/api/v1") ? urlPath : `/api/v1${urlPath}`

    const method = (config.method || "GET").toUpperCase()
    const body = typeof config.data === "string" ? JSON.parse(config.data) : config.data

    const route = matchRoute(method, fullUrl)
    if (route) {
      try {
        const data = await route.handler.handler(route.params, body, route.match)
        config.adapter = () => {
          return Promise.resolve({
            data,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          })
        }
      } catch (error: any) {
        const err = error instanceof Error ? error : new Error(error?.response?.data?.detail || "Mock error")
        ;(err as any).response = error.response || {
          data: { detail: "Mock error" },
          status: error.status || 500,
        }
        config.adapter = () => Promise.reject(err)
      }
    }

    return config
  })
}
