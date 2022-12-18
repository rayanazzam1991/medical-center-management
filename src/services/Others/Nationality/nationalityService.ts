import { defaultNationality, Nationality, NationalitySearchFilter } from "/@src/models/Others/Nationality/nationality"
import { useNationality } from "/@src/stores/Others/Nationality/nationalityStore"
import { Pagination } from "/@src/utils/response"

export async function addNationality(nationalityData: Nationality) {
    const nationalityResponse = useNationality()
    var nationality: Nationality = await nationalityResponse.addNationalityStore(nationalityData) ?? defaultNationality
    var success: boolean = nationalityResponse.success ?? false
    var error_code: string = nationalityResponse.error_code ?? ''
    var message: string = nationalityResponse.message ?? ''
    return { success, error_code, message, nationality }

}
export async function deleteNationality(nationalityId: number) {
    const nationalityResponse = useNationality()
    await nationalityResponse.deleteNationalityStore(nationalityId)
    var success: boolean = nationalityResponse.success ?? false
    var error_code: string = nationalityResponse.error_code ?? ''
    var message: string = nationalityResponse.message ?? ''
    return { success, error_code, message }
}

export async function editNationality(nationalityData: Nationality) {
    const nationalityResponse = useNationality()
    await nationalityResponse.editNationalityStore(nationalityData)
    var success: boolean = nationalityResponse.success ?? false
    var error_code: string = nationalityResponse.error_code ?? ''
    var message: string = nationalityResponse.message ?? ''
    return { success, error_code, message }
}

export async function getNationalitiesList(searchFilter: NationalitySearchFilter) {
    const nationalityResponse = useNationality()
    await nationalityResponse.getNationalities(searchFilter)
    var nationalities: Nationality[] = nationalityResponse.nationalities
    var pagination: Pagination = nationalityResponse.pagination
    var success: boolean = nationalityResponse.success ?? false
    var error_code: string = nationalityResponse.error_code ?? ''
    var message: string = nationalityResponse.message ?? ''

    return { nationalities, pagination, success, error_code, message }
}

export async function getNationality(nationalityId: number) {
    const nationalityResponse = useNationality()
    var nationality: Nationality = await nationalityResponse.getNationalityStore(nationalityId) ?? defaultNationality
    var success: boolean = nationalityResponse.success ?? false
    var error_code: string = nationalityResponse.error_code ?? ''
    var message: string = nationalityResponse.message ?? ''


    return { success, error_code, message, nationality }
}