export interface SignInRequest {
    phone_number?: string,
    password?: string
}
export const defaultSignInRequest: SignInRequest = {
    phone_number: undefined,
    password: undefined
}
export interface ChangePassword {
    password: string,
    password_confirmation: string,
    user_id: number
}
export const defaultChangePassword: ChangePassword = {
    password: '',
    password_confirmation: '',
    user_id: 0
}
