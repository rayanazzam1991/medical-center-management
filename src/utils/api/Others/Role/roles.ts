import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function getRolesApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('role')
    return { response }
}
export async function getRoleApi(
    api: AxiosInstance,
    roleId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`role/${roleId}`)
    return { response }
}
export async function updateRolePermissionsApi(
    api: AxiosInstance,
    roleId: number,
    permissions: String[]
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`role/${roleId}/updateRolePermissions`, { permissions: permissions })
    return { response }
}
