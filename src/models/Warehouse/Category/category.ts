import { BaseConsts } from "/@src/utils/consts/base"

export interface Category {
    id?: number
    name: string
    icon: string
    parent_id: 0
    status: number
}
export interface CategorySearchFilter {
    name?: string
    icon?: string
    parent_id?: 0
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultCategory: Category = {
    id: 0,
    name: '',
    icon: '',
    parent_id: 0,
    status: 1,
}

export const defaultCategorySearchFilter: CategorySearchFilter = {
    name: undefined,
    icon: undefined,
    parent_id: undefined,
    status: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}

// const CategoryConsts = BaseConsts
// export { CategoryConsts }