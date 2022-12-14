import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'

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

export async function deleteSocialMediaApi(
  api: AxiosInstance,
  socialMediaId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`socialMedia/${socialMediaId}`)

  return { response }
}
export async function addSocialMediaApi(
  api: AxiosInstance,
  socialMedia: SocialMedia
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`socialMedia`, socialMedia)

  return { response }
}
export async function editSocialMediaApi(
  api: AxiosInstance,
  socialMedia: SocialMedia
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `socialMedia/${socialMedia.id}`,
    socialMedia
  )
  return { response }
}
export async function getSocialMediaApi(
  api: AxiosInstance,
  socialMediaId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`socialMedia/${socialMediaId}`)

  return { response }
}
export async function getSocialMediasApi(
  api: AxiosInstance,
  searchFilter: SocialMediaSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('socialMedia/getSocialMediaList', {
    params: searchFilter,
  })
  return { response }
}
