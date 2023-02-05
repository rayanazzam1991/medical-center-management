import { defaultUser, User } from "../../Others/User/user"
import { defaultInventoryItem, InventoryItem } from "../InventoryItem/inventoryItem"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Inventory {
    id?: number
    name: string
    status: number
    contractor_name?: string
    contractor_id?: number
    items_count: number
    created_at: string
    last_updated_at: string
    last_action_by: User
}
export interface InventorySearchFilter {
    name?: string,
    status?: number,
    action_by?: string,
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultInventory: Inventory = {
    id: 0,
    name: '',
    status: 1,
    contractor_name: '',
    contractor_id: 0,
    items_count: 0,
    created_at: '',
    last_updated_at: '',
    last_action_by: defaultUser
}
export const defaultInventorySearchFilter: InventorySearchFilter = {
    name: undefined,
    status: undefined,
    action_by: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}

const InventoryConsts = BaseConsts
export { InventoryConsts }