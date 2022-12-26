import { Speciality, SpecialitySearchFilter, defaultSpeciality } from "/@src/models/Others/Speciality/speciality"
import { useSpeciality } from "/@src/stores/Others/Speciality/specialityStore"
import { Pagination } from "/@src/utils/response"


export async function addSpeciality(specialityData: Speciality) {
    const specialityResponse = useSpeciality()
    var speciality: Speciality = await specialityResponse.addSpecialityStore(specialityData) ?? defaultSpeciality
    var success: boolean = specialityResponse.success ?? false
    var error_code: string = specialityResponse.error_code ?? ''
    var message: string = specialityResponse.message ?? ''
    return { success, error_code, message, speciality }

}

export async function deleteSpeciality(specialityId: number) {
    const specialityResponse = useSpeciality()
    await specialityResponse.deleteSpecialityStore(specialityId)
    var success: boolean = specialityResponse.success ?? false
    var error_code: string = specialityResponse.error_code ?? ''
    var message: string = specialityResponse.message ?? ''
    return { success, error_code, message }

}
export async function editSpeciality(specialityData: Speciality) {
    const specialityResponse = useSpeciality()
    await specialityResponse.editSpecialityStore(specialityData)
    await specialityResponse.editSpecialityStore(specialityData)
    var success: boolean = specialityResponse.success ?? false
    var error_code: string = specialityResponse.error_code ?? ''
    var message: string = specialityResponse.message ?? ''
    return { success, error_code, message }

}
export async function getSpecialitiesList(searchFilter: SpecialitySearchFilter) {
    const speciality = useSpeciality()
    await speciality.getSpecialitiesStore(searchFilter)
    var specialities: Speciality[] = speciality.specialities
    var pagination: Pagination = speciality.pagination
    var success: boolean = speciality.success ?? false
    var error_code: string = speciality.error_code ?? ''
    var message: string = speciality.message ?? ''

    return { specialities, pagination, success, error_code, message }

}
export async function getSpeciality(specialityId: number) {
    const specialityResponse = useSpeciality()
    var speciality: Speciality = await specialityResponse.getSpecialityStore(specialityId) ?? defaultSpeciality
    var success: boolean = specialityResponse.success ?? false
    var error_code: string = specialityResponse.error_code ?? ''
    var message: string = specialityResponse.message ?? ''
    return { success, error_code, message, speciality }

}
