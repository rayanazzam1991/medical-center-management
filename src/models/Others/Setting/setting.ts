import { BaseConsts } from "/@src/utils/consts/base"

export interface Setting {
    id?: number
    key: string
    value: string
}
export const defaultSetting: Setting = {
    id: undefined,
    key: '',
    value: '',
}
