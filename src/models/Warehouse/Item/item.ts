import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { User } from "../../Others/User/user"
import { Category, defaultCategory } from "../Category/category"
import { defaultItemsHasInventory, ItemsHasInventory } from "../Inventory/inventory"
import { BaseConsts } from "/@src/utils/consts/base"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})
export interface Item {
    id?: number
    name: string
    price?: number
    cost: number
    category: Category
    created_by?: User
    description?: string
    status: number
    is_for_sale?: number
    quantity_in_main_inventory: number
}
export interface ItemInInventory {
    id: number
    name: string
    price: number
    cost: number
    category: Category
    quantity: number
    created_at : string
}
export interface ItemsInInventory {
    inventory: ItemsHasInventory
    items: ItemInInventory[]
}

export interface CreateUpdateItem {
    id?: number
    name: string
    price?: number
    cost: number
    category_id: number
    description?: string
    status: number
    is_for_sale?: number


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
    is_for_sale?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface ItemsInInventorySearchFilter {
    category_id?: number
    parent_category_id?: number
    item_name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}



export const defaultItem: Item = {
    id: 0,
    name: '',
    price: undefined,
    cost: 0,
    description: '',
    category: defaultCategory,
    is_for_sale: undefined,
    status: 1,
    quantity_in_main_inventory: 0
}
export const defaultItemsInInventory: ItemsInInventory = {
    inventory: defaultItemsHasInventory,
    items: [],
}

export const defaultCreateUpdateItem: CreateUpdateItem = {
    id: 0,
    name: '',
    price: undefined,
    cost: 0,
    category_id: 0,
    description: '',
    is_for_sale: undefined,
    status: 1,
}

export const defaultItemSearchFilter: ItemSearchFilter = {
    name: undefined,
    sub_category_id: undefined,
    category_id: undefined,
    status: undefined,
    is_for_sale: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
}
export const defaultChangeItemStatus: ChangeItemStatus = {
    id: undefined,
    status: undefined
}
export const defaultItemsInInventorySearchFilter: Partial<ItemsInInventorySearchFilter> = {}




class ItemConsts extends BaseConsts {
    static readonly IS_FORE_SALE = 1
    static readonly IS_NOT_FORE_SALE = 0

    public static showForSale(type: number | undefined): string {
        if (type === ItemConsts.IS_FORE_SALE)
            return i18n.global.t('item.form.yes')

        if (type === ItemConsts.IS_NOT_FORE_SALE)
            return i18n.global.t('item.form.no')
        return ''
    }
}
export { ItemConsts }