import { defaultCustomerProfilePic, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function getProfilePicture (customer_id : number)  {

    const customerResponse =  useCustomer()
    var mediaParams = defaultCustomerProfilePic
    mediaParams.is_featured = '1' 
    mediaParams.model_id = customer_id
    var media : Media[] = await customerResponse.getCustomerProfilePicture(mediaParams) ?? []
    media.forEach(element => {
        element.relative_path= MediaConsts.MEDIA_BASE_URL + element.relative_path
    });
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , media}

    

}