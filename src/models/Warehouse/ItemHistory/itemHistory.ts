import { defaultUser, User } from "../../Others/User/user"
import { defaultItem, Item } from "../Item/item"
import { BaseConsts } from "/@src/utils/consts/base"

export interface itemHistory {
    id?: number
    item: Item
    item_quantity: number
    add_item_cost: number
    note: string
    invoice_number: string
    status: number
    requester_name: string
    created_by?: User
    withdraw_item_price: number
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
export interface ChangeItemHistoryStatus {
    id?: number
    status?: number
}

export const defaultItemHistory: itemHistory = {
    id: 0,
    item: defaultItem,
    item_quantity: 0,
    add_item_cost: 0,
    note: '',
    invoice_number: '',
    requester_name: '',
    created_by: defaultUser,
    withdraw_item_price: 0,
    status: 1
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

export const defaultChangeItemHistoryStatus: ChangeItemHistoryStatus = {
    id: undefined,
    status: undefined
}
const ItemHsitoryConsts = BaseConsts
export { ItemHsitoryConsts }