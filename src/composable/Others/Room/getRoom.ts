import { useRoom } from '/@src/stores/Others/Room/roomStore'

export async function getRoom(roomId: number) {
  const room = useRoom()
  return await room.getRoomStore(roomId)
}
