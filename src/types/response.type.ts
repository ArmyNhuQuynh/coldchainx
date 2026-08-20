export type BaseResponse<T> = {
  success: boolean
  message: string
  data: T
  statusCode?: number
  errors?: Record<string, string[]> | string[] | null
};

export type PaginationResponse<T> = {
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  data: T[];
}

export type ErrorResponse<T> = BaseResponse<T>
