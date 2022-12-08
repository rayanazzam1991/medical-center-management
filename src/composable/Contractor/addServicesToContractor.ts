import { useContractor, defaultContractor } from "/@src/stores/Contractor/contractorStore"
import { Contractor, CreateUpdateServicesHelper } from "/@src/utils/api/Contractor"


export async function addServicesToContractor (contractor_id : number, services : Array<CreateUpdateServicesHelper>)  {

    const contractorResponse =  useContractor()

    var contractor : Contractor = await contractorResponse.addServicesStore(contractor_id,services) ?? defaultContractor
    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , contractor}

    

}