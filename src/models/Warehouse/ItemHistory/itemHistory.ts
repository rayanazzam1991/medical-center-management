import { defaultUser, User } from "../../Others/User/user"
import { defaultItem, Item } from "../Item/item"
import { BaseConsts } from "/@src/utils/consts/base"

export interface itemHistory {
    id?: number
    item: Item
    user?: User
    item_quantity: number
    add_item_cost: number
    note: string
    invoice_number: string
    status: number
    requester_name: string
    created_by?: User
    withdraw_item_price: number
}

export interface ItemHistorySearchFilter {
    item_id?: number
    category_id?: number
    sub_category_id?: number
    date_between?: string
    from?: string
    to?: string
    status?: number
    type?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface addQuantity {
    id?: number
    item_id: number
    item_quantity: number
    add_item_cost: number
    note: string
    invoice_number: string
    status: number
}
export interface withdrawQuantity {
    id?: number
    item_id: number
    item_quantity: number
    withdraw_item_price: number
    user_id: number
    requester_name: string
    requester_type: string
    note: string
    status: number
}
export interface ChangeItemHistoryStatus {
    id?: number
    status?: number
}

export const defaultItemHistory: itemHistory = {
    id: 0,
    item: defaultItem,
    user: defaultUser,
    item_quantity: 0,
    add_item_cost: 0,
    note: '',
    invoice_number: '',
    requester_name: '',
    created_by: defaultUser,
    withdraw_item_price: 0,
    status: 1
}
export const defaultItemHistorySearchFilter: ItemHistorySearchFilter = {
    item_id: undefined,
    category_id: undefined,
    sub_category_id: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    status: undefined,
    type: undefined,
    page: undefined,
    per_page: undefined,
    order_by: 'created_at',
    order: 'desc',
}
export const defaultAddQuantityItem: addQuantity = {
    id: 0,
    item_id: 0,
    item_quantity: 0,
    add_item_cost: 0,
    note: '',
    invoice_number: '',
    status: 1

}

export const defaultWithdrawQuantityItem: withdrawQuantity = {
    id: 0,
    item_id: 0,
    item_quantity: 0,
    withdraw_item_price: 0,
    user_id: 0,
    requester_name: '',
    requester_type: '',
    note: '',
    status: 1

}

export const defaultChangeItemHistoryStatus: ChangeItemHistoryStatus = {
    id: undefined,
    status: undefined
}
const ItemHsitoryConsts = BaseConsts
export { ItemHsitoryConsts }