import { useService } from "/@src/stores/Others/Service/serviceStore";


export async function getService  (serviceId : number)  {
    const service =  useService()
    return await service.getServiceStore(serviceId)
    

}