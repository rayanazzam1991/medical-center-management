import { defaultUser, User } from "../../Others/User/user"
import { defaultInventory, Inventory } from "../Inventory/inventory"
import { defaultInventoryItem, InventoryItem } from "../InventoryItem/inventoryItem"
import { defaultItem, Item } from "../Item/item"
import { BaseConsts } from "/@src/utils/consts/base"

export interface inventoryItemHistory {
    id?: number
    item: string
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

export interface InventoryItemHistorySearchFilter {
    item_id?: number
    from_inventory?: number
    to_inventory?: number
    date_between?: string
    action?: string
    movement_type?: string
    requester_name?: string
    action_by?: number
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
    user_id: number
    requester_name: string
    note: string
    status: number
}
export interface ChangeItemHistoryStatus {
    id?: number
    status?: number
}
export interface CreateInventoryItemHistoryMovement {
    from_inventory: Inventory
    to_inventory: Inventory
    note?: string
}

export const defaultCreateInventoryItemHistoryMovement: CreateInventoryItemHistoryMovement = {
    from_inventory: defaultInventory,
    to_inventory: defaultInventory,
    note: ''
}

export const defaultInventoryItemHistory: inventoryItemHistory = {
    id: 0,
    item: '',
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
export const defaultInventoryItemHistorySearchFilter: InventoryItemHistorySearchFilter = {
    item_id: undefined,
    from_inventory: undefined,
    to_inventory: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    status: undefined,
    type: undefined,
    page: undefined,
    per_page: undefined,
    order_by: 'created_at',
    order: 'desc',
    action: undefined,
    action_by: undefined,
    movement_type: undefined,
    requester_name: undefined
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
    user_id: 0,
    requester_name: '',
    note: '',
    status: 1

}

export const defaultChangeItemHistoryStatus: ChangeItemHistoryStatus = {
    id: undefined,
    status: undefined
}
const ItemHsitoryConsts = BaseConsts
export { ItemHsitoryConsts }