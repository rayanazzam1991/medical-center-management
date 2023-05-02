import { BaseConsts } from "/@src/utils/consts/base"

export interface CategoryType {
    id?: number
    name: string
}
export const defaultCategoryType: CategoryType = {
    id: undefined,
    name: '',
}