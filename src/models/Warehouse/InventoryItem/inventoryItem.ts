import { User } from "../../Others/User/user"
import { CreateInventoryItemHistoryMovement, defaultCreateInventoryItemHistoryMovement } from "../ItemHistory/inventoryItemHistory"
import { BaseConsts } from "/@src/utils/consts/base"

export interface InventoryItem {
    id?: number
    quantity: number
    min_quantity: number
    item: string
    item_id: number
    action_by?: User
    updated_at: string
}

export interface CreateInventoryItem {
    quantity: number
    inventory_id: number
    item_id: number
    inventoryItemHistories: CreateInventoryItemHistoryMovement
}

export const defaultInventoryItem: InventoryItem = {
    id: 0,
    quantity: 0,
    min_quantity: 0,
    item: '',
    item_id: 0,
    action_by: undefined,
    updated_at: ''

}
export const defaultCreateInventoryItem: CreateInventoryItem = {
    quantity: 0,
    inventory_id: 0,
    item_id: 0,
    inventoryItemHistories: defaultCreateInventoryItemHistoryMovement
}

export interface InventoryItemByInventorySearchFilter {
    category_id?: number
    parent_category_id?: number
    item_name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface InventoryItemByInventorySearchFilter {
    category_id?: number
    parent_category_id?: number
    item_name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultInventoryItemByInventorySearchFilter: Partial<InventoryItemByInventorySearchFilter> = {}


const InventoryItemConsts = BaseConsts
export { InventoryItemConsts }
