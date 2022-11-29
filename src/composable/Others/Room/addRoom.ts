import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room } from '/@src/utils/api/Others/Room'

export async function addRoom(roomData: Room) {
  console.log('comp')

  const department = useRoom()
  return await department.addRoomStore(roomData)
}
