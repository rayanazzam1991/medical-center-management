import { CreateContractor, Contractor, defaultContractor, CreateUpdateServicesHelper, ContractorSearchFilter, UpdateContractor, defaultContractorProfilePic, defaultContractorFiles } from "/@src/models/Contractor/contractor"
import { MediaConsts, Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser } from "/@src/models/Others/User/user"
import { useContractor } from "/@src/stores/Contractor/contractorStore"
import { Pagination } from "/@src/utils/response"

export async function addContractor(
    contractorData: CreateContractor,
    userData: CreateUpdateUser,
) {
    userData.password = '1231313'
    contractorData.user = userData
    const contractorResponse = useContractor()
    var contractor: Contractor = await contractorResponse.addContractorStore(contractorData) ?? defaultContractor
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, contractor }
}

export async function addServicesToContractor(contractor_id: number, services: Array<CreateUpdateServicesHelper>) {
    const contractorResponse = useContractor()
    var contractor: Contractor = await contractorResponse.addServicesStore(contractor_id, services) ?? defaultContractor
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, contractor }
}

export async function getContractor(contractor_id: number) {
    const contractorResponse = useContractor()
    var contractor: Contractor = await contractorResponse.getContractorStore(contractor_id) ?? defaultContractor
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, contractor }
}

export async function getContractorsList(searchFilter: ContractorSearchFilter) {
    const contractor = useContractor()
    await contractor.getContractorsStore(searchFilter)
    var contractors: Contractor[] = contractor.contractors
    var pagination: Pagination = contractor.pagination
    return { contractors, pagination }
}

export async function getProfilePicture(contractor_id: number) {
    const contractorResponse = useContractor()
    var mediaParams = defaultContractorProfilePic
    mediaParams.is_featured = '1'
    mediaParams.model_id = contractor_id
    var media: Media[] = await contractorResponse.getContractorProfilePicture(mediaParams) ?? []
    media.forEach(element => {
        element.file_name = element.relative_path
        element.relative_path = MediaConsts.MEDIA_BASE_URL + element.relative_path
    });

    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}

export async function updateContractor(
    contractor_id: number,
    contractorData: UpdateContractor,
    userData: CreateUpdateUser,
    contractorServices: Array<CreateUpdateServicesHelper>
) {
    const newContractorData: UpdateContractor = {
        starting_date: contractorData.starting_date,
        payment_percentage: contractorData.payment_percentage,
        user: userData,
        end_date: contractorData.end_date,
        speciality_id: contractorData.speciality_id,
        services: contractorServices
    }

    const contractorResponse = useContractor()
    var contractor: Contractor = await contractorResponse.updateContractorStore(contractor_id, newContractorData) ?? defaultContractor
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, contractor }
}

export async function getContractorFiles(contractor_id: number) {
    const contractorResponse = useContractor()
    var mediaParams = defaultContractorFiles
    mediaParams.is_featured = '0'
    mediaParams.model_id = contractor_id
    var media: Media[] = await contractorResponse.getContractorFilesStore(mediaParams) ?? []
    media.forEach(element => {
        element.file_name = element.relative_path
        element.relative_path = MediaConsts.MEDIA_BASE_URL + element.relative_path
    });
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}

export async function addContractorFile(contractor_id: unknown, fd: FormData) {
    const contractorResponse = useContractor()
    const is_featured: unknown = false
    fd.append('model_id', contractor_id as string)
    fd.append('model_type', MediaConsts.CONTRACTOR_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    var media: Media[] = await contractorResponse.addContractorFileStore(fd) ?? []
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}

export async function deleteFile(picture_id: number) {
    const contractorResponse = useContractor()
    await contractorResponse.deleteContractorFile(picture_id)
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message }
}
export async function addProfilePicture(contractor_id: unknown, fd: FormData) {
    const contractorResponse = useContractor()
    const is_featured: unknown = true
    fd.append('model_id', contractor_id as string)
    fd.append('model_type', MediaConsts.CONTRACTOR_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    var media: Media[] = await contractorResponse.addContractorFileStore(fd) ?? []
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}
