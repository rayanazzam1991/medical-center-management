import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { CreateRecords, createRecordsWithDefault } from "../../Accounting/Transaction/record"
import { Customer } from "../../CRM/Customer/customer"
import { Employee } from "../../Employee/employee"
import { Media } from "../../Others/Media/media"
import { Supplier } from "../../Others/Supplier/supplier"
import { defaultUser, User } from "../../Others/User/user"
import { defaultInventory, Inventory } from "../Inventory/inventory"
import { BaseConsts } from "/@src/utils/consts/base"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface inventoryItemHistory {
    id: number
    item: string
    item_quantity: number
    note: string
    action_by: User
    from_inventory?: string
    to_inventory?: string
    created_at: string
    type: number
    action: number
    invoice_number?: string
    files?: Media[]
    causer?: Employee | Supplier | Customer

}

export interface InventoryItemHistorySearchFilter {
    item_id?: number
    supplier_name? : string
    from_inventory?: number
    to_inventory?: number
    date_between?: string
    action?: number
    type?: number
    action_by?: number
    from?: string
    to?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    status?: number
}
export interface addQuantity {
    id?: number
    item_id: number
    item_quantity: number
    add_item_cost: number
    note?: string
    invoice_number?: string
    status: number
    causerable_account_id: number
    record: CreateRecords
}
export interface withdrawQuantity {
    id?: number
    item_id: number
    item_quantity: number
    note?: string
    status: number
    causerable_id: number
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
    item_quantity: 0,
    note: '',
    from_inventory: undefined,
    to_inventory: undefined,
    action: 1,
    action_by: defaultUser,
    created_at: '',
    type: 1,
    causer: undefined,
    files: []
}
export const defaultInventoryItemHistorySearchFilter: InventoryItemHistorySearchFilter = {
    item_id: undefined,
    from_inventory: undefined,
    to_inventory: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    type: undefined,
    page: undefined,
    per_page: undefined,
    order_by: 'created_at',
    order: 'desc',
    action: undefined,
    action_by: undefined,
    status: undefined

}
export const defaultAddQuantityItem: addQuantity = {
    id: undefined,
    item_id: 0,
    item_quantity: 0,
    add_item_cost: 0,
    note: undefined,
    invoice_number: undefined,
    status: 1,
    causerable_account_id: 0,
    record: createRecordsWithDefault

}

export const defaultWithdrawQuantityItem: withdrawQuantity = {
    id: undefined,
    item_id: 0,
    item_quantity: 0,
    note: undefined,
    status: 1,
    causerable_id: 0

}

export const defaultChangeItemHistoryStatus: ChangeItemHistoryStatus = {
    id: undefined,
    status: undefined
}
class InventoryItemHistoryConsts {
    static readonly ACTIVE_ITEM_HISTORY = 1;
    static readonly INACTIVE_ITEM_HISTORY = 0;
    static readonly EXTERNAL_TYPE_HISTORY = 1;
    static readonly INTERNAL_TYPE_HISTORY = 2;
    static readonly ADD_QUANTITY = 1;
    static readonly WITHDRAW_QUANTITY = 2;
    static readonly SELL_QUANTITY = 3;
    static readonly WITHDRAW_FROM_MAIN_INVENTORY = 4;
    static readonly RETURN_TO_MAIN_INVENTORY = 5;

    static readonly TYPES = [this.INTERNAL_TYPE_HISTORY, this.EXTERNAL_TYPE_HISTORY]
    static readonly ACTIONS = [this.ADD_QUANTITY, this.WITHDRAW_QUANTITY, this.SELL_QUANTITY, this.WITHDRAW_FROM_MAIN_INVENTORY, this.RETURN_TO_MAIN_INVENTORY]
    public static getStatusName(status: number) {
        if (status == this.ACTIVE_ITEM_HISTORY)
            return i18n.global.t('status.active')
        if (status == this.INACTIVE_ITEM_HISTORY)
            return i18n.global.t('status.inactive')
        else return '';
    }
    public static getTypeName(type: number) {
        if (type == this.EXTERNAL_TYPE_HISTORY)
            return i18n.global.t('inventory_item_history_types.external')
        if (type == this.INTERNAL_TYPE_HISTORY)
            return i18n.global.t('inventory_item_history_types.internal')
        else return '';
    }
    public static getActionName(action: number) {
        if (action == this.ADD_QUANTITY)
            return i18n.global.t('inventory_item_history_actions.add_quantity')
        if (action == this.WITHDRAW_QUANTITY)
            return i18n.global.t('inventory_item_history_actions.withdraw_quantity')
        if (action == this.SELL_QUANTITY)
            return i18n.global.t('inventory_item_history_actions.sell_quantity')
        if (action == this.WITHDRAW_FROM_MAIN_INVENTORY)
            return i18n.global.t('inventory_item_history_actions.withdraw_from_main_inventory')
        if (action == this.RETURN_TO_MAIN_INVENTORY)
            return i18n.global.t('inventory_item_history_actions.return_to_main_inventory')
        else return '';
    }


}
export { InventoryItemHistoryConsts }
