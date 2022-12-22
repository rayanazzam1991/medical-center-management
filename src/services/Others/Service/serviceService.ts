import { defaultService, Service, ServiceSearchFilter } from "/@src/models/Others/Service/service"
import { useService } from "/@src/stores/Others/Service/serviceStore"
import { Pagination } from "/@src/utils/response"


export async function addService(serviceData: Service) {
    const serviceResponse = useService()
    var service: Service = await serviceResponse.addServiceStore(serviceData) ?? defaultService
    var success: boolean = serviceResponse.success ?? false
    var error_code: string = serviceResponse.error_code ?? ''
    var message: string = serviceResponse.message ?? ''
    return { success, error_code, message, service }
}

export async function deleteService(serviceId: number) {
    const serviceResponse = useService()
    await serviceResponse.deleteServiceStore(serviceId)
    var success: boolean = serviceResponse.success ?? false
    var error_code: string = serviceResponse.error_code ?? ''
    var message: string = serviceResponse.message ?? ''
    return { success, error_code, message }

}

export async function editService(serviceData: Service) {
    const serviceResponse = useService()
    await serviceResponse.editServiceStore(serviceData)
    var success: boolean = serviceResponse.success ?? false
    var error_code: string = serviceResponse.error_code ?? ''
    var message: string = serviceResponse.message ?? ''
    return { success, error_code, message }
}

export async function getService(serviceId: number) {
    const serviceResponse = useService()
    var service: Service = await serviceResponse.getServiceStore(serviceId) ?? defaultService
    var success: boolean = serviceResponse.success ?? false
    var error_code: string = serviceResponse.error_code ?? ''
    var message: string = serviceResponse.message ?? ''
    return { success, error_code, message, service }
}

export async function getServicesList(searchFilter: ServiceSearchFilter) {
    const serviceResponse = useService()
    await serviceResponse.getServicesStore(searchFilter)
    var services: Service[] = serviceResponse.services
    var pagination: Pagination = serviceResponse.pagination
    var success: boolean = serviceResponse.success ?? false
    var error_code: string = serviceResponse.error_code ?? ''
    var message: string = serviceResponse.message ?? ''
    return { success, error_code, message, services, pagination }

}