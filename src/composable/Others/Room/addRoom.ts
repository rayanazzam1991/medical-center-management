import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { CreateUpdateRoom } from '/@src/utils/api/Others/Room'

export async function addRoom(roomData: CreateUpdateRoom) {
  const room = useRoom()
  return await room.addRoomStore(roomData)
}
