import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { User } from "../../Others/User/user"
import { Category, defaultCategory } from "../Category/category"
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
    is_for_sale?: boolean
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