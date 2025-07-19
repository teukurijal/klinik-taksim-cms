export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  code?: string
  success: boolean
  message?: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}