import { BaseConsts } from "/@src/utils/consts/base"

export interface MedicalInfo {
    id?: number
    blood_type?: string
    allergic?: string
    chronic_diseases?: string
    infectious_diseases?: string
    any_other_info?: string
    status?: number
    smoking?: number
}
export const defaultMedicalInfo: MedicalInfo = {
    id: undefined,
    blood_type: undefined,
    allergic: undefined,
    chronic_diseases: undefined,
    infectious_diseases: undefined,
    any_other_info: undefined,
    status: undefined,
    smoking: undefined,
}
class MedicalInfoConsts extends BaseConsts {
    static readonly BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
}

export { MedicalInfoConsts }