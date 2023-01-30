import { BaseConsts } from "/@src/utils/consts/base"

export interface Position {
    id?: number
    name: string
    description?: string
    status: number
}
export interface PositionSearchFilter {
    name?: string
    description?: string
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface ChangePositionStatus {
    id?: number
    status?: number
}
export const defaultPosition: Position = {
    id: 0,
    name: '',
    description: undefined,
    status: 1,
}

export const defaultPositionSearchFilter: PositionSearchFilter = {
    name: undefined,
    description: undefined,
    status: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
export const defaultChangePositionStatus: ChangePositionStatus = {
    id: undefined,
    status: undefined
}
const PositionConsts = BaseConsts
export { PositionConsts }