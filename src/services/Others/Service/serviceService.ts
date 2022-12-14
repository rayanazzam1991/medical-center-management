import { useService } from "/@src/stores/Others/Service/serviceStore";
import { Service } from "/@src/utils/api/Others/Service";


export async function addService  (serviceData : Service)  {
    const service =  useService()
    return await service.addServiceStore(serviceData)
}

export async function deleteService  (serviceId : number)  {
    const service =  useService()
    await service.deleteServiceStore(serviceId)
}

export async function editService  (serviceData : Service)  {
    const service =  useService()
    await service.editServiceStore(serviceData)
}

export async function getService  (serviceId : number)  {
    const service =  useService()
    return await service.getServiceStore(serviceId)
}

export async function getServicesList  (searchFilter : ServiceSearchFilter)  {
    const service =  useService()
    await service.getServicesStore(searchFilter)
    var services : Service[] = service.services
    var pagination : Pagination = service.pagination
    return { services , pagination }
}