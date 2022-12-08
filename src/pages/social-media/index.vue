<script setup lang="ts">import { useHead } from '@vueuse/head';
import VAvatar from '/@src/components/base/avatar/VAvatar.vue';
import VIcon from '/@src/components/base/icon/VIcon.vue';
import VTag from '/@src/components/base/tags/VTag.vue';
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue';
import { deleteSocialMedia } from '/@src/composable/CRM/socialMedia/deleteSocialMedia';
import { getSocialMediasList } from '/@src/composable/CRM/socialMedia/getSocialMediasList';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultSocialMediaSearchFilter } from '/@src/stores/CRM/SocialMedia/socialMediaStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { SocialMediaSearchFilter } from '/@src/utils/api/CRM/SocialMedia';
import { SocialMediaConsts } from '/@src/utils/consts/socialMedia';
import { defaultPagination } from '/@src/utils/response';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Social Media')
useHead({
  title: 'Social Media',
})
const notif = useNotyf()
const searchFilter = ref(defaultSocialMediaSearchFilter)
const socialMediasList = ref()
const deleteSocialMediaPopup = ref(false)
const deleteSocialMediaId = ref()
const paginationVar = ref(defaultPagination)
const { socialMedias, pagination } = await getSocialMediasList(searchFilter.value)
socialMediasList.value = socialMedias
paginationVar.value = pagination
const router = useRouter()

const removeSocialMedia = async (socialMediaId: number) => {

  await deleteSocialMedia(socialMediaId)
  deleteSocialMediaPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: SocialMediaSearchFilter) => {

  const { socialMedias, pagination } = await getSocialMediasList(searchFilter2)

  socialMediasList.value = socialMedias
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: SocialMediaSearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getSocialMediasPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const socialMediaSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

    searchFilter.value.order_by = sortField
    searchFilter.value.order = sortOrder
  }
  else {
    searchFilter.value.order = undefined
    searchFilter.value.order_by = undefined
  }
  await search(searchFilter.value)

}

const columns = {
  id: {
    align: 'center',
    sortable: true,

  },
  name: {
    align: 'center',
    sortable: true,


  },
  icon: {
    align: 'center',
    renderRow: (row: any) =>
      h(
        VIcon,
        {
          icon: row?.icon,
        },
        {
          default() {
            return row?.icon
          },
        }
      ),

  },
  status: {
    align: 'center',

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === SocialMediaConsts.INACTIVE
              ? 'orange'
              : row?.status === SocialMediaConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return SocialMediaConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteSocialMediaPopup.value = true
          deleteSocialMediaId.value = row?.id
        },
        onEdit: () => {
          router.push({ path: `/social-media/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/social-media/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <SocialMediaTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="socialMediasList" @update:sort="socialMediaSort">

    <VFlexTable v-if="socialMediasList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="(socialMediasList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getSocialMediasPerPage" />
    <h6 v-if="socialMediasList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="socialMediasList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove SocialMedia" :open="deleteSocialMediaPopup" actions="center"
    @close="deleteSocialMediaPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeSocialMedia(deleteSocialMediaId)">Confirm</VButton>
    </template>
  </VModal>

</template>

