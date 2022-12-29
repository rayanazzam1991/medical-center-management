import { User } from "../../Others/User/user"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Category {
    id?: number
    name: string
    parent?: Category
    created_by?: User
    status: number
}
export interface CreateUpdateCategory {
    id?: number
    name: string
    parent_id?: number
    created_by?: number
    status: number
}
export interface CategorySearchFilter {
    name?: string
    parent_id?: number
    status?: number
    created_by?: User
    is_main_category?: boolean
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface ChangeCategoryStatus {
    id?: number
    status?: number
}
export const defaultCategory: Category = {
    id: undefined,
    name: '',
    parent: undefined,
    created_by: undefined,
    status: 1,
}

export const defaultCreateUpdateCategory: CreateUpdateCategory = {
    id: 0,
    name: '',
    parent_id: undefined,
    created_by: undefined,
    status: 1,
}
export const defaultCategorySearchFilter: CategorySearchFilter = {
    name: undefined,
    parent_id: undefined,
    status: undefined,
    created_by: undefined,
    is_main_category: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
export const defaultMainCategorySearchFilter: CategorySearchFilter = {
    name: undefined,
    parent_id: undefined,
    status: undefined,
    created_by: undefined,
    is_main_category: true,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}

export const defaultChangeCategoryStatus: ChangeCategoryStatus = {
    id: undefined,
    status: undefined
}
const CategoryConsts = BaseConsts
export { CategoryConsts }