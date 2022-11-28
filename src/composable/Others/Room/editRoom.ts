import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room } from '/@src/utils/api/Others/Room'

export async function editRoom(roomData: Room) {
  const room = useRoom()
  await room.editRoomStore(roomData)
}
