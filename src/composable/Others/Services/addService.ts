import { useService } from "/@src/stores/Others/Service/serviceStore";
import { Service } from "/@src/utils/api/Others/Service";


export async function addService  (serviceData : Service)  {

    const service =  useService()
    return await service.addServiceStore(serviceData)
    
    

}