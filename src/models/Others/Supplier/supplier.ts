import { City } from "../City/city"
import { User } from "../User/user"
import { BaseConsts } from "/@src/utils/consts/base"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})
export interface Supplier {
  id?: number
  name: string
  phone_number: string
  status: number
  city?: City
  created_by?: User
  address: string
  notes: string
  created_at: string


}

export interface CreateUpdateSupplier {
  id?: number
  name: string
  phone_number: string
  status: number
  city_id?: number
  created_by?: User
  address: string
  notes: string
}

export interface SupplierSearchFilter {
  name?: string
  phone_number?: string
  status?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export const defaultSupplier: Supplier = {
  id: 0,
  name: '',
  phone_number: '',
  status: 0,
  city: undefined,
  created_by: undefined,
  address: '',
  notes: '',
  created_at: ''
}

export const defaultCreateUpdateSupplier: CreateUpdateSupplier = {
  id: undefined,
  name: '',
  phone_number: '',
  status: 0,
  city_id: undefined,
  created_by: undefined,
  address: '',
  notes: ''
}
//export const defaultSupplierSearchFilter = <Partial<CreateUpdateSupplier>>{}
export const defaultSupplierSearchFilter: SupplierSearchFilter = {
  name: undefined,
  phone_number: undefined,
  status: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}


class SupplierConsts {
  static readonly INACTIVE = 0
  static readonly ACTIVE = 1
  static readonly NOT_RECOMMENDED = 2


  public static getSupplierStatusColor(status: number) {
    if (status == this.ACTIVE) return 'success'
    if (status == this.INACTIVE) return 'danger'
    if (status == this.NOT_RECOMMENDED) return 'info'
  }
  public static getSupplierStatusName(status: number) {
    if (status == this.ACTIVE)
      return i18n.global.t('status.active')
    if (status == this.INACTIVE)
      return i18n.global.t('status.inactive')
    if (status == this.NOT_RECOMMENDED)
      return i18n.global.t('status.not_recommended')
    return ''
  }
}
export { SupplierConsts }

