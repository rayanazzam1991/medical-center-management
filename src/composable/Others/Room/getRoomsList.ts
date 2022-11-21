import { useRoom } from "/@src/stores/Others/Room/roomStore";
import { Room } from "/@src/utils/api/Others/Room";


export async function getRoomsList() {
    const room = useRoom()
    await room.loadRooms()
    var rooms: Room[] = room.rooms
    return { rooms }

}