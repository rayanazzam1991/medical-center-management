import { useRoom } from "/@src/stores/Others/Room/roomStore";
import { Room } from "/@src/utils/api/Others/Room";
import { Department } from '/@src/utils/api/Others/Department';


export async function getRoomsList() {
    const room = useRoom()
    await room.loadRooms()
    var rooms: Room[] = room.rooms
    return { rooms }
}
