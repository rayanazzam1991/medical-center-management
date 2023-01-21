import { Position, PositionSearchFilter, defaultPosition, ChangePositionStatus } from "/@src/models/Others/Position/position"
import { usePosition } from "/@src/stores/Others/Position/positionStore"
import { Pagination } from "/@src/utils/response"


export async function addPosition(positionData: Position) {
    const positionResponse = usePosition()
    var position: Position = await positionResponse.addPositionStore(positionData) ?? defaultPosition
    var success: boolean = positionResponse.success ?? false
    var error_code: string = positionResponse.error_code ?? ''
    var message: string = positionResponse.message ?? ''
    return { success, error_code, message, position }

}

export async function editPosition(positionData: Position) {
    const positionResponse = usePosition()
    await positionResponse.editPositionStore(positionData)
    await positionResponse.editPositionStore(positionData)
    var success: boolean = positionResponse.success ?? false
    var error_code: string = positionResponse.error_code ?? ''
    var message: string = positionResponse.message ?? ''
    return { success, error_code, message }

}
export async function changePositionStatus(positionData: ChangePositionStatus) {
    const positionResponse = usePosition()
    await positionResponse.changePositionStatusStore(positionData)
    var success: boolean = positionResponse.success ?? false
    var error_code: string = positionResponse.error_code ?? ''
    var message: string = positionResponse.message ?? ''
    return { success, error_code, message }
}
export async function getPositionsList(searchFilter: PositionSearchFilter) {
    const position = usePosition()
    await position.getPositionsStore(searchFilter)
    var positions: Position[] = position.positions
    var pagination: Pagination = position.pagination
    var success: boolean = position.success ?? false
    var error_code: string = position.error_code ?? ''
    var message: string = position.message ?? ''

    return { positions, pagination, success, error_code, message }

}
export async function getPosition(positionId: number) {
    const positionResponse = usePosition()
    var position: Position = await positionResponse.getPositionStore(positionId) ?? defaultPosition
    var success: boolean = positionResponse.success ?? false
    var error_code: string = positionResponse.error_code ?? ''
    var message: string = positionResponse.message ?? ''
    return { success, error_code, message, position }

}
