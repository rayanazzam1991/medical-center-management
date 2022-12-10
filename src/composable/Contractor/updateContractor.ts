import { useContractor, defaultContractor } from "/@src/stores/Contractor/contractorStore"
import { Contractor, CreateUpdateServicesHelper, UpdateContractor } from "/@src/utils/api/Contractor"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"


export async function updateContractor(
    contractor_id : number,
    contractorData: UpdateContractor ,
    userData : CreateUpdateUser ,
    contractorServices : Array<CreateUpdateServicesHelper>
     ) {

    const newContractorData : UpdateContractor = {
        starting_date: contractorData.starting_date,
        payment_percentage : contractorData.payment_percentage,
        user : userData,
        services : contractorServices
    }

    console.log(newContractorData)
    const contractorResponse =  useContractor()
    var contractor : Contractor = await contractorResponse.updateContractorStore(contractor_id ,newContractorData) ?? defaultContractor

    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , contractor}
      

}