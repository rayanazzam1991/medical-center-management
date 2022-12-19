import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room, RoomSearchFilter, CreateUpdateRoom, defaultRoom } from '/@src/models/Others/Room/room'
import { Pagination } from '/@src/utils/response'

export async function addRoom(roomData: CreateUpdateRoom) {
  const roomResponse = useRoom()
  var room: Room = await roomResponse.addRoomStore(roomData) ?? defaultRoom
  var success: boolean = roomResponse.success ?? false
  var error_code: string = roomResponse.error_code ?? ''
  var message: string = roomResponse.message ?? ''
  return { success, error_code, message, room }

}
export async function deleteRoom(roomId: number) {
  const roomResponse = useRoom()
  await roomResponse.deleteRoomStore(roomId)
  var success: boolean = roomResponse.success ?? false
  var error_code: string = roomResponse.error_code ?? ''
  var message: string = roomResponse.message ?? ''
  return { success, error_code, message }
}

export async function editRoom(roomData: CreateUpdateRoom) {
  const roomResponse = useRoom()
  await roomResponse.editRoomStore(roomData)
  var success: boolean = roomResponse.success ?? false
  var error_code: string = roomResponse.error_code ?? ''
  var message: string = roomResponse.message ?? ''
  return { success, error_code, message }

}

export async function getRoom(roomId: number) {
  const roomResponse = useRoom()
  var room: Room = await roomResponse.getRoomStore(roomId) ?? defaultRoom
  var success: boolean = roomResponse.success ?? false
  var error_code: string = roomResponse.error_code ?? ''
  var message: string = roomResponse.message ?? ''
  return { success, error_code, message, room }

}

export async function getRoomsList(searchFilter: RoomSearchFilter) {
  const roomResponse = useRoom()
  await roomResponse.getRoomsStore(searchFilter)
  var rooms: Room[] = roomResponse.rooms
  var pagination: Pagination = roomResponse.pagination
  var success: boolean = roomResponse.success ?? false
  var error_code: string = roomResponse.error_code ?? ''
  var message: string = roomResponse.message ?? ''
  return { success, error_code, message, rooms, pagination }
}
