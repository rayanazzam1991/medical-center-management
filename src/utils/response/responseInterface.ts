import { Pagination } from "./paginationInterface"
export interface CustomResponse {
    success: boolean
    error_code : string
    message: string
    data : Array<any>
    pagination : Pagination
  }
  