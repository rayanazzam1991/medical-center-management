import { useService } from "/@src/stores/Others/Service/serviceStore";
import { Service } from "/@src/utils/api/Others/Service";


export async function editService  (serviceData : Service)  {
    const service =  useService()
    await service.editServiceStore(serviceData)
    

}