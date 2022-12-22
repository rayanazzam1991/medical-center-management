import { AxiosInstance } from "axios"
import { CreateUpdateRoom, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


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
  const { data: response, headers } = await api.post(`room`, room)

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
