import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room, SearchFilter } from '/@src/utils/api/Others/Room'
import { Pagination } from '/@src/utils/response'

export async function getRoomsList(searchFilter: SearchFilter) {
  const room = useRoom()
  await room.getRoomsStore(searchFilter)

  var rooms: Room[] = room.rooms
  var pagination: Pagination = room.pagination
  return { rooms, pagination }
}
