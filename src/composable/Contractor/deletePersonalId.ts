import { useContractor } from "/@src/stores/Contractor/contractorStore"

export async function deletePersonalId (picture_id : number)  {

    const contractorResponse =  useContractor()
    await contractorResponse.deleteContractorPersonalId(picture_id) 
    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message }

    

}