import { AxiosInstance } from "axios"
import { PermissionGroupSearchFilter } from "/@src/models/Others/PermissionGroup/permissionGroup"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function getPermissionGroupsListApi(
    api: AxiosInstance,
    filter: PermissionGroupSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('permissionGroup/getPermissionGroupsList', { params: filter })
    return { response }
}
