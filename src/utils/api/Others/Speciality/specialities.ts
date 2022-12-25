import { AxiosInstance } from "axios"
import { Speciality, SpecialitySearchFilter } from "/@src/models/Others/Speciality/speciality"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function deactivateSpecialityApi(
    api: AxiosInstance,
    specialityId: number
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(`speciality/deactivate${specialityId}`)

    return { response }
}
export async function activateSpecialityApi(
    api: AxiosInstance,
    specialityId: number
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(`speciality/activate${specialityId}`)

    return { response }
}
export async function addSpecialityApi(
    api: AxiosInstance,
    speciality: Speciality
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`speciality`, speciality)

    return { response }
}
export async function editSpecialityApi(
    api: AxiosInstance,
    speciality: Speciality
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`speciality/${speciality.id}`, speciality)
    return { response }
}
export async function getSpecialityApi(
    api: AxiosInstance,
    specialityId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`speciality/${specialityId}`)

    return { response }
}
export async function getSpecialitiesApi(
    api: AxiosInstance,
    searchFilter: SpecialitySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('speciality/getSpecialitiesList', {
        params: searchFilter,
    })
    return { response }
}
