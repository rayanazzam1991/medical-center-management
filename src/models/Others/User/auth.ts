export interface SignInRequest {
    phone_number?: string,
    password?: string
}
export const defaultSignInRequest: SignInRequest = {
    phone_number: undefined,
    password: undefined
}
