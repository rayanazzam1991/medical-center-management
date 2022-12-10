import { useContractor, defaultContractor } from "/@src/stores/Contractor/contractorStore"
import { Contractor } from "/@src/utils/api/Contractor"

export async function getContractor(
    contractor_id: number ,
     ) {

    const contractorResponse =  useContractor()

    var contractor : Contractor = await contractorResponse.getContractorStore(contractor_id) ?? defaultContractor

    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , contractor}
      

}