import { AxiosInstance } from "axios"
import { CustomResponseSingle } from "/@src/utils/response"

export interface MedicalInfo {
  id?: number
  blood_type: string
  allergic: string
  chronic_diseases: string
  infectious_diseases: string
  any_other_info: string
  status: number
  smoking: number
} 



export async function addMedicalInfoApi(
  api: AxiosInstance,
  medicalInfo: MedicalInfo
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`medicalInfo/`, medicalInfo)

  return { response }
}
