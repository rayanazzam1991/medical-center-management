import { defaultCustomer, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { CreateUpdateCustomerSocialMediaHelper, Customer } from "/@src/utils/api/CRM/Customer"


export async function addSocialMediasToCustomer (customer_id : number, social_medias : Array<CreateUpdateCustomerSocialMediaHelper>)  {

    const customerResponse =  useCustomer()

    var customer : Customer = await customerResponse.addSocialMediaStore(customer_id,social_medias) ?? defaultCustomer
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}

    

}