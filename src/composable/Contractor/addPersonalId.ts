import { useContractor } from "/@src/stores/Contractor/contractorStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function addPersonalId (contractor_id : unknown,fd : FormData)  {

    const contractorResponse =  useContractor()
    const is_featured : unknown = true
    fd.append('model_id', contractor_id as string)
    fd.append('model_type', MediaConsts.CONTRACTOR_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    var media : Media[] = await contractorResponse.addContractorPersonalId(fd) ?? []
    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , media}

    

}