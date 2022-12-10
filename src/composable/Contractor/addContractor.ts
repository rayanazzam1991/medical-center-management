import { useContractor, defaultContractor } from "/@src/stores/Contractor/contractorStore"
import { CreateContractor, Contractor } from "/@src/utils/api/Contractor"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"

export async function addContractor(
    contractorData: CreateContractor ,
    userData : CreateUpdateUser ,
     ) {
    userData.password = '1231313'

    const newContractorData : CreateContractor = {
        starting_date: contractorData.starting_date,
        payment_percentage : contractorData.payment_percentage,
        user : userData,
        services : []
    }
    const contractorResponse =  useContractor()

    var contractor : Contractor = await contractorResponse.addContractorStore(newContractorData) ?? defaultContractor

    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , contractor}
      

}