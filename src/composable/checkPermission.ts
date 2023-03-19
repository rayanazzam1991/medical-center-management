import { useAuth } from '../stores/Others/User/authStore';
import { Role } from '../utils/consts/rolesPermissions';


export function checkPermission(
    persmission: string,
): boolean {
    const userPermissions: string[] = getAuthUserPermissions(); // replace with your own function to get the user's permissions
    if (userPermissions === undefined ||
        userPermissions.length === 0) {
        return false
    }
    return userPermissions.includes(persmission)

}

export function checkRequiredPermissions(
    userPermission: string,
    allowedPermissions: string[],
): boolean {
    if (allowedPermissions === undefined || allowedPermissions.length === 0) {
        return false;
    }

    return checkStringExistsInArray(userPermission, allowedPermissions);
}
function checkStringExistsInArray(str: string, arr: string[]): boolean {
    return arr.includes(str);
}
function getAuthUserPermissions(): string[] {
    const userAuth = useAuth()
    const userPermissions: string[] = []
    const loggedUser = JSON.parse(userAuth.loggedUser);
    loggedUser.roles.forEach((role: Role) => {
        role.permissions.forEach((permission) => {
            userPermissions.push(permission.name)
        });
    });
    return userPermissions
}