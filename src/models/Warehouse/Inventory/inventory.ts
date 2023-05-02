import { defaultUser, User } from "../../Others/User/user"
import { defaultInventoryItem, InventoryItem } from "../InventoryItem/inventoryItem"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Inventory {
    id?: number
    name: string
    status: number
    contractor_name?: string
    inventory_items: InventoryItem[]
    employee_id?: number
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
    employee_id: 0,
    items_count: 0,
    inventory_items: [],
    created_at: '',
    last_updated_at: '',
    last_action_by: defaultUser
}


export interface ItemsHasInventory {
    id?: number
    name: string
    status: number
    contractor_name?: string
    employee_id?: number
    items_count: number
    items_quantity_count: number
    last_updated_at: string
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
export const defaultItemsHasInventory: ItemsHasInventory = {
    name: '',
    status: 1,
    items_count: 0,
    items_quantity_count: 0,
    last_updated_at: '',
    employee_id: 0,
    contractor_name: '',
    id: 0
}

const InventoryConsts = BaseConsts
export { InventoryConsts }