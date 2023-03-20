import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { Room, RoomSearchFilter, CreateUpdateRoom, defaultRoom } from '/@src/models/Others/Room/room'
import { Pagination } from '/@src/utils/response'
import { useRole } from '/@src/stores/Others/Role/roleStore'
import { Role } from '/@src/utils/consts/rolesPermissions'


export async function getRolesList() {
    const response = useRole()
    await response.getRolesStore()
    const roles: Role[] = response.roles
    const pagination: Pagination = response.pagination
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, roles, pagination }
}
