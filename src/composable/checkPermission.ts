import { useAuth } from '../stores/Others/User/authStore';


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

function getAuthUserPermissions(): string[] {
    const userAuth = useAuth()
    const loggedUser = JSON.parse(userAuth.loggedUser);
    const userPermissions = loggedUser?.roles[0]?.permissions?.map((obj: any) => obj.name);
    return userPermissions
}