import { BaseConsts } from "/@src/utils/consts/base"

export interface National {
  id?: number
  name: string
  status: number
}
export interface NationalSearchFilter {
  name?: string
  status?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export const defaultNational: National = {
  id: 0,
  name: '',
  status: 1,
}

export const defaultNationalSearchFilter: NationalSearchFilter = {
  name: undefined,
  status: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}

const NationalConsts = BaseConsts
export { NationalConsts }
