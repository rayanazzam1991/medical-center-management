import { defaultCustomerProfilePic, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function deleteProfilePicture (picture_id : number)  {

    const customerResponse =  useCustomer()
    await customerResponse.deleteCustomerProfilePicture(picture_id) 
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message }

    

}