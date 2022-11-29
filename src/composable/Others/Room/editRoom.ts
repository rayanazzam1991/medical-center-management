import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { CreateUpdateRoom } from '/@src/utils/api/Others/Room'

export async function editRoom(roomData: CreateUpdateRoom) {
  const room = useRoom()
  await room.editRoomStore(roomData)
}
