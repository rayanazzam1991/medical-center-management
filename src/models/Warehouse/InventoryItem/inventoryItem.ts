import { User } from "../../Others/User/user"
import { Inventory } from "../Inventory/inventory"
import { CreateInventoryItemHistoryMovement, defaultCreateInventoryItemHistoryMovement } from "../ItemHistory/inventoryItemHistory"
import { BaseConsts } from "/@src/utils/consts/base"

export interface InventoryItem {
    id: number
    quantity: number
    item: string
    item_id: number
    created_at: string
}

export interface CreateInventoryItem {
    quantity: number
    inventory_id: number
    item_id: number
    inventoryItemHistories: CreateInventoryItemHistoryMovement
}
export interface InventoryByItem {
    id: number
    inventory: Inventory
    quantity: number
}
export interface InventoryByItemSearchFilter {
    inventory_name?: string
    quantity?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultInventoryItem: InventoryItem = {
    id: 0,
    quantity: 0,
    item: '',
    item_id: 0,
    created_at: ''

}
export const defaultCreateInventoryItem: CreateInventoryItem = {
    quantity: 0,
    inventory_id: 0,
    item_id: 0,
    inventoryItemHistories: defaultCreateInventoryItemHistoryMovement
}


const InventoryItemConsts = BaseConsts
export { InventoryItemConsts }
