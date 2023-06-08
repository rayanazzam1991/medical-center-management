import { AxiosInstance } from "axios";
import { National, NationalSearchFilter } from "/@src/models/Others/National/national"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export class NationalApi {
  async get(api: AxiosInstance, searchFilter: NationalSearchFilter): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('nationality/getNationalitiesList', { params: searchFilter })
    return { response }
  }

  async show(api: AxiosInstance, id: Number): Promise<{ response: CustomResponseSingle }> {
    const { data: response } = await api.get(`nationality/${id}`)
    return { response }
  }

  async store(api: AxiosInstance, national: National): Promise<{ response: CustomResponseSingle }> {
    const { data: response } = await api.post('nationality', national)
    return { response }
  }

  async update(api: AxiosInstance, national: National): Promise<{ response: CustomResponseSingle }> {
    const { data: response } = await api.put(`nationality/${national.id}`, national)
    return { response }
  }

  async destroy(api: AxiosInstance, id: Number): Promise<{ response: CustomResponseCollection }> {
    const { data: response } = await api.delete(`nationality/${id}`)
    return { response }
  }
}
