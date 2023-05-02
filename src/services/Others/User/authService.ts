import { ChangePassword } from "/@src/models/Others/User/auth"
import { useAuth } from "/@src/stores/Others/User/authStore"

export async function resetPassword(user_id: number) {
    const response = useAuth()
    await response.resetPasswordStore(user_id)
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message }

}
export async function changePassword(change_password_data: ChangePassword) {
    const response = useAuth()
    await response.changePasswordStore(change_password_data)
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message }

}
