import { usePermissionGroup } from '/@src/stores/Others/PermissionGroup/permissionGroupStore'
import { PermissionGroup, PermissionGroupSearchFilter } from '/@src/models/Others/PermissionGroup/permissionGroup'


export async function getPermissionGroupsList(filter: PermissionGroupSearchFilter) {
    const response = usePermissionGroup()
    await response.getPermissionGroupsStore(filter)
    const permission_groups: PermissionGroup[] = response.permissionGroups
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, permission_groups }
}
