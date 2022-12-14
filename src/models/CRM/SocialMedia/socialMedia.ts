import { BaseConsts } from "/@src/utils/consts/base"

export interface SocialMedia {
    id?: number
    name: string
    icon: string
    status: number
}
export interface SocialMediaSearchFilter {
    name?: string
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export const defaultSocialMedia: SocialMedia = {
    id: 0,
    name: '',
    icon: '',
    status: 1,
}

export const defaultSocialMediaSearchFilter: SocialMediaSearchFilter = {
    name: undefined,
    status: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
const SocialMediaConsts = BaseConsts
export { SocialMediaConsts }