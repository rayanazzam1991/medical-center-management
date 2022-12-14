import { defaultCustomer, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Customer } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"


export async function addMedicalInfo (customer_id : number,medicalInfoData : MedicalInfo)  {
    const customerResponse =  useCustomer()
    var customer : Customer = await customerResponse.addMedicalInfoStore(customer_id,medicalInfoData) ?? defaultCustomer
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
}

export async function addCustomer(
    customerData: CreateCustomer,
    userData: CreateUpdateUser
  ) {
    userData.password = '1231313'
    const newCustomerData: CreateCustomer = {
      emergency_contact_phone: customerData.emergency_contact_phone,
      emergency_contact_name: customerData.emergency_contact_name,
      customer_group_id: customerData.customer_group_id,
      medical_info_id: undefined,
      user: userData,
      social_medias: [],
    }
    const customerResponse = useCustomer()
    var customer: Customer = (await customerResponse.addCustomerStore(newCustomerData)) ?? defaultCustomer
    var success: boolean = customerResponse.success ?? false
    var error_code: string = customerResponse.error_code ?? ''
    var message: string = customerResponse.message ?? ''
    return { success, error_code, message, customer }
}

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

export async function addSocialMediasToCustomer (customer_id : number, social_medias : Array<CreateUpdateCustomerSocialMediaHelper>)  {
    const customerResponse =  useCustomer()
    var customer : Customer = await customerResponse.addSocialMediaStore(customer_id,social_medias) ?? defaultCustomer
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
}

export async function deleteProfilePicture (picture_id : number)  {
    const customerResponse =  useCustomer()
    await customerResponse.deleteCustomerProfilePicture(picture_id) 
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message }
}

export async function getCustomer(customer_id: number) {
    const customerResponse =  useCustomer()
    var customer : Customer = await customerResponse.getCustomerStore(customer_id) ?? defaultCustomer
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
}

export async function getCustomersList(searchFilter: CustomerSearchFilter) {
    const customer = useCustomer()
    await customer.getCustomersStore(searchFilter)
    var customers: Customer[] = customer.customers
    var pagination: Pagination = customer.pagination
    return { customers, pagination }
}
 
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

export async function updateCustomer(
    customer_id : number,
    customerData: UpdateCustomer ,
    userData : CreateUpdateUser ,
    medicalData : MedicalInfo,
    customerSocialMedia : Array<CreateUpdateCustomerSocialMediaHelper>
     ) {
    const newCustomerData : UpdateCustomer = {
        emergency_contact_phone: customerData.emergency_contact_phone,
        emergency_contact_name : customerData.emergency_contact_name,
        customer_group_id : customerData.customer_group_id,
        medical_info : medicalData ,
        user : userData,
        social_medias : customerSocialMedia
    }
    const customerResponse =  useCustomer()
    var customer : Customer = await customerResponse.updateCustomerStore(customer_id ,newCustomerData) ?? defaultCustomer
    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
}