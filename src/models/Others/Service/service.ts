import { ServiceProvider } from "../../Sales/ServiceProvider/serviceProvider"
import { defaultItem, Item } from "../../Warehouse/Item/item"
import { BaseConsts } from "/@src/utils/consts/base"
import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})

export interface Service {
  id?: number
  name: string
  status: number
  description?: string
  service_price?: number
  duration_minutes?: number
  has_item: boolean
  service_items: ServiceItem[],
  quantity_item: number
}
export interface ServiceItem {
  item: Item
  quantity: number
}
export interface CreateService {
  id?: number
  name: string
  status: number
  description?: string
  service_price?: number
  duration_minutes?: number
  has_item: boolean
  service_items: CreateServiceItem[],
  quantity_item: number
}
export interface CreateServiceItem {
  item_id?: number
  quantity: number
}
export interface CreateServiceItemHelper {
  item_id?: number
  quantity: number
  isNew: boolean
}
export interface ServiceWithProvider {
  id: number
  name: string
  status: number
  description?: string
  service_price?: number
  duration_minutes?: number
  providers: ServiceProvider[]
}
export interface ServiceSearchFilter {
  name?: string
  status?: number
  service_price?: number
  duration_minutes?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}
export const defaultService: Service = {
  id: undefined,
  name: '',
  status: 1,
  description: '',
  duration_minutes: undefined,
  service_price: undefined,
  has_item: false,
  quantity_item: 0,
  service_items: []
}
export const defaultCreateService: CreateService = {
  id: undefined,
  name: '',
  status: 1,
  description: '',
  duration_minutes: undefined,
  service_price: undefined,
  has_item: false,
  quantity_item: 0,
  service_items: []
}
export const defaultServiceWithProvider: ServiceWithProvider = {
  id: 0,
  name: '',
  status: 1,
  description: '',
  duration_minutes: undefined,
  service_price: undefined,
  providers: []
}
export const defaultServiceSearchFilter: ServiceSearchFilter = {
  name: undefined,
  status: undefined,
  duration_minutes: undefined,
  service_price: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}
class ServiceConsts extends BaseConsts {
  static readonly PRICE_DOLLAR = 'USD'
  static readonly PRICE_DINAR = 'IQD'
  static readonly IS_HAS_ITEM = 1
  static readonly IS_NOT_HAS_ITEM = 0

  public static showHasItem(type: number | undefined): string {
    if (type === ServiceConsts.IS_HAS_ITEM)
      return i18n.global.t('service.form.yes')

    if (type === ServiceConsts.IS_NOT_HAS_ITEM)
      return i18n.global.t('service.form.no')
    return ''
  }
}

export { ServiceConsts }
