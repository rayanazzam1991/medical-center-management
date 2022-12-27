import { AxiosInstance } from "axios"
import { Position, ChangePositionStatus, PositionSearchFilter } from "/@src/models/Others/Position/position"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function changePositionStatusApi(
    api: AxiosInstance,
    position: ChangePositionStatus
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `position/changePositionStatus/${position.id}`,
        position
    )
    return { response }
}
export async function addPositionApi(
    api: AxiosInstance,
    position: Position
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`position`, position)

    return { response }
}
export async function editPositionApi(
    api: AxiosInstance,
    position: Position
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`position/${position.id}`, position)
    return { response }
}
export async function getPositionApi(
    api: AxiosInstance,
    positionId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`position/${positionId}`)

    return { response }
}
export async function getPositionsApi(
    api: AxiosInstance,
    searchFilter: PositionSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('position/getPositionsList', {
        params: searchFilter,
    })
    return { response }
}
