import { useRoom } from "/@src/stores/Others/Room/roomStore";
import { Room } from "/@src/utils/api/Others/Room";


export async function deleteRoom(roomId: number) {
    const room = useRoom()
    await room.deleteRoomStore(roomId)


}