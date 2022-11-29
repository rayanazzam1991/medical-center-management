import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'
import { Department } from '../Department'

export interface Room {
  id?: number
  number: number
  floor: number
  department?: Department
  status: number
}

export interface CreateUpdateRoom {
  id?: number
  number: number
  floor: number
  department_id?: number
  status: number
}
export interface RoomSearchFilter {
  number?: number
  floor?: number
  department?: number
  status?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export async function deleteRoomApi(
  api: AxiosInstance,
  roomId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`room/${roomId}`)

  return { response }
}
export async function addRoomApi(
  api: AxiosInstance,
  room: CreateUpdateRoom
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`room/`, room)

  return { response }
}
export async function editRoomApi(
  api: AxiosInstance,
  room: CreateUpdateRoom
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`room/${room.id}`, room)
  console.log(response)
  return { response }
}
export async function getRoomApi(
  api: AxiosInstance,
  roomId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`room/${roomId}`)

  return { response }
}
export async function getRoomsApi(
  api: AxiosInstance,
  searchFilter: RoomSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('room/getRoomList', {
    params: searchFilter,
  })
  return { response }
}
