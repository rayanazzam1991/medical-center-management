import { useService } from "/@src/stores/Others/Service/serviceStore";


export async function deleteService  (serviceId : number)  {
    const service =  useService()
    await service.deleteServiceStore(serviceId)
    

}