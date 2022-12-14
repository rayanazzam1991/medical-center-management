import { BaseConsts } from "/@src/utils/consts/base"

export interface CustomerGroup {
    id?: number
    name: string
    status: number
}
export interface CustomerGroupSearchFilter {
    name?: string
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export const defaultCustomerGroup: CustomerGroup = {
    id: 0,
    name: '',
    status: 1,
}
  
export const defaultCustomerGroupSearchFilter: CustomerGroupSearchFilter = {
    name: undefined,
    status: undefined,
    page : undefined,
    order : undefined,
    order_by : undefined,
    per_page : undefined
}
const CustomerGroupConsts = BaseConsts
export {CustomerGroupConsts}