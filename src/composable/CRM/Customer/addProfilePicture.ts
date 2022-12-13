import { defaultCustomerProfilePic, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function addProfilePicture (customer_id : unknown,fd : FormData)  {

    const customerResponse =  useCustomer()
    const is_featured : unknown = true
    fd.append('model_id', customer_id as string)
    fd.append('model_type', MediaConsts.CUSTOMER_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    var media : Media[] = await customerResponse.addCustomerProfilePictureStore(fd) ?? []
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , media}

    

}