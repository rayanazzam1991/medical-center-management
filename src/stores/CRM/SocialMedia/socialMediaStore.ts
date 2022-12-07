import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

import {
  SocialMediaSearchFilter,
  SocialMedia,
  getSocialMediasApi,
  deleteSocialMediaApi,
  addSocialMediaApi,
  editSocialMediaApi,
  getSocialMediaApi,
} from '/@src/utils/api/CRM/SocialMedia'
import { useApi } from '/@src/composable/useApi'
import { Pagination, defaultPagination } from '/@src/utils/response'

export const defaultSocialMedia: SocialMedia = {
  id: 0,
  name: '',
  icon : '',
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

export const useSocialMedia = defineStore('socialMedia', () => {
  const api = useApi()
  const socialMedias = ref<SocialMedia[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteSocialMediaStore(socialMediaId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteSocialMediaApi(api, socialMediaId)
      socialMedias.value.splice(
        socialMedias.value.findIndex((socialMedia: SocialMedia) => socialMedia.id === socialMediaId),
        1
      )
    } finally {
      loading.value = false
    }
  }
  async function getSocialMediaStore(socialMediaId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getSocialMediaApi(api, socialMediaId)
      var returnedSocialMedia: SocialMedia
      returnedSocialMedia = response.response.data
      return returnedSocialMedia
    } finally {
      loading.value = false
    }
  }
  async function addSocialMediaStore(socialMedia: SocialMedia) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addSocialMediaApi(api, socialMedia)
      var returnedSocialMedia: SocialMedia
      returnedSocialMedia = response.response.data
      socialMedias.value.push(returnedSocialMedia)
      return returnedSocialMedia
    } finally {
      loading.value = false
    }
  }
  async function editSocialMediaStore(socialMedia: SocialMedia) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await editSocialMediaApi(api, socialMedia)
      var returnedSocialMedia: SocialMedia
      returnedSocialMedia = response.response.data
      socialMedias.value.splice(
        socialMedias.value.findIndex((socialMediaElement) => (socialMediaElement.id = socialMedia.id)),
        1
      )
      socialMedias.value.push(returnedSocialMedia)
    } finally {
      loading.value = false
    }
  }
  async function getSocialMediasStore(searchFilter: SocialMediaSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getSocialMediasApi(api, searchFilter)
      socialMedias.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }

  return {
    socialMedias,
    pagination,
    deleteSocialMediaStore,
    addSocialMediaStore,
    editSocialMediaStore,
    getSocialMediaStore,
    getSocialMediasStore,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSocialMedia, import.meta.hot))
}
