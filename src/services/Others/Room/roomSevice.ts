import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room, RoomSearchFilter, CreateUpdateRoom } from '/@src/models/Others/Room/room'
import { Pagination } from '/@src/utils/response'

export async function addRoom(roomData: CreateUpdateRoom) {
  const room = useRoom()
  return await room.addRoomStore(roomData)
}
export async function deleteRoom(roomId: number) {
  const room = useRoom()
  await room.deleteRoomStore(roomId)
}

export async function editRoom(roomData: CreateUpdateRoom) {
  const room = useRoom()
  await room.editRoomStore(roomData)
}

export async function getRoom(roomId: number) {
  const room = useRoom()
  return await room.getRoomStore(roomId)
}

export async function getRoomsList(searchFilter: RoomSearchFilter) {
  const room = useRoom()
  await room.getRoomsStore(searchFilter)

  var rooms: Room[] = room.rooms
  var pagination: Pagination = room.pagination
  return { rooms, pagination }
}
