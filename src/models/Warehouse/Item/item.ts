import { User } from "../../Others/User/user"
import { Category, defaultCategory } from "../Category/category"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Item {
    id?: number
    name: string
    quantity: number
    min_quantity?: number
    price: number
    cost: number
    category: Category
    created_by?: User
    description?: string
    status: number
}

export interface CreateUpdateItem {
    id?: number
    name: string
    quantity: number
    min_quantity?: number
    price: number
    cost: number
    category_id: number
    description?: string
    status: number

}
export interface ChangeItemStatus {
    id?: number
    status?: number
}
export interface ItemSearchFilter {
    name?: string
    sub_category_id?: number
    category_id?: number
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export const defaultItem: Item = {
    id: 0,
    name: '',
    quantity: 0,
    min_quantity: 0,
    price: 0,
    cost: 0,
    description: '',
    category: defaultCategory,
    status: 1,
}

export const defaultCreateUpdateItem: CreateUpdateItem = {
    id: 0,
    name: '',
    quantity: 0,
    min_quantity: 0,
    price: 0,
    cost: 0,
    category_id: 0,
    description: '',
    status: 0,
}

export const defaultItemSearchFilter: ItemSearchFilter = {
    name: undefined,
    sub_category_id: undefined,
    category_id: undefined,
    status: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
}
export const defaultChangeItemStatus: ChangeItemStatus = {
    id: undefined,
    status: undefined
}
const ItemConsts = BaseConsts
export { ItemConsts }