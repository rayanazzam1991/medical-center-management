import { useService } from "/@src/stores/Others/Service/serviceStore";
import { Service, ServiceSearchFilter } from "/@src/utils/api/Others/Service";
import { Pagination } from "/@src/utils/response";


export async function getServicesList  (searchFilter : ServiceSearchFilter)  {
    const service =  useService()
    await service.getServicesStore(searchFilter)
    
    var services : Service[] = service.services
    var pagination : Pagination = service.pagination
    return { services , pagination }

}