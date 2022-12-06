import { useCustomer, defaultCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Customer } from "/@src/utils/api/CRM/Customer"


export async function getCustomer(
    customer_id: number ,
     ) {

    const customerResponse =  useCustomer()

    var customer : Customer = await customerResponse.getCustomerStore(customer_id) ?? defaultCustomer

    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
      

}