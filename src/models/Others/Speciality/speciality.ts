import { BaseConsts } from "/@src/utils/consts/base"

export interface Speciality {
    id?: number
    name: string
    status: number
}
export interface SpecialitySearchFilter {
    name?: string
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface ChangeSpecialityStatus {
    id?: number
    status?: number
}

export const defaultSpeciality: Speciality = {
    id: 0,
    name: '',
    status: 1,
}

export const defaultSpecialitySearchFilter: SpecialitySearchFilter = {
    name: undefined,
    status: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
export const defaultChangeSpecialityStatus: ChangeSpecialityStatus = {
    id: undefined,
    status: undefined
}
const SpecialityConsts = BaseConsts
export { SpecialityConsts }