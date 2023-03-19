import { AxiosInstance } from "axios"
import { CreateUpdateRoom, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function getRolesApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('role/')
    return { response }
}
