import type { AxiosInstance } from 'axios'
import { CustomResponse } from '../../../response'

export interface Room {
    id: number
    number: number
    floor: number
    department: Department
    status: number
}

export interface Department {
    id: number
    name: string
    status: number
}


export async function getRooms(
    api: AxiosInstance,
    start = 0,
    limit = 20
): Promise<{ response: CustomResponse; }> {

    const { data: response, headers } = await api.get(
        'room'
    )

    return { response }
}

export async function deleteRoomApi(
    api: AxiosInstance,
    roomId: number
): Promise<{ response: CustomResponse; }> {

    const { data: response, headers } = await api.delete(
        `room/${roomId}`
    )

    return { response }
}
