import { User } from "../../Others/User/user"
import { CreateInventoryItemHistoryMovement, defaultCreateInventoryItemHistoryMovement } from "../ItemHistory/inventoryItemHistory"
import { BaseConsts } from "/@src/utils/consts/base"

export interface InventoryItem {
    id?: number
    quantity: number
    min_quantity: number
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
    action_by: undefined,
    updated_at: ''

}
export const defaultCreateInventoryItem: CreateInventoryItem = {
    quantity: 0,
    inventory_id: 0,
    item_id: 0,
    inventoryItemHistories: defaultCreateInventoryItemHistoryMovement
}
const InventoryItemConsts = BaseConsts
export { InventoryItemConsts }
