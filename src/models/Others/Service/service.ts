import { ServiceProvider } from "../../Sales/ServiceProvider/serviceProvider"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Service {
    id?: number
    name: string
    status: number
    description?: string
    service_price?: number
    duration_minutes?: number
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
    id: 0,
    name: '',
    status: 1,
    description: '',
    duration_minutes: undefined,
    service_price: undefined,
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
}

export { ServiceConsts }