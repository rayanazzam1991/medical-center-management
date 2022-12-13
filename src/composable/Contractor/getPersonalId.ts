import { useContractor, defaultContractorPersonalId } from "/@src/stores/Contractor/contractorStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function getPersonalId (contractor_id : number)  {

    const contractorResponse =  useContractor()
    var mediaParams = defaultContractorPersonalId
    mediaParams.is_featured = '1' 
    mediaParams.model_id = contractor_id
    var media : Media[] = await contractorResponse.getContractorPersonalId(mediaParams) ?? []
    media.forEach(element => {
        element.relative_path= MediaConsts.MEDIA_BASE_URL + element.relative_path
    });
    var success : boolean = contractorResponse.success ?? false
    var error_code : string = contractorResponse.error_code ?? ''
    var message : string = contractorResponse.message ?? ''
    return {success , error_code , message , media}

    

}