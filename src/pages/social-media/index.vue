<script setup lang="ts">import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';
import VAvatar from '/@src/components/base/avatar/VAvatar.vue';
import VIcon from '/@src/components/base/icon/VIcon.vue';
import VTag from '/@src/components/base/tags/VTag.vue';
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultSocialMediaSearchFilter, SocialMediaSearchFilter, SocialMediaConsts, SocialMedia } from '/@src/models/CRM/SocialMedia/socialMedia';
import { getSocialMediasList, deleteSocialMedia } from '/@src/services/CRM/SocialMedia/socialMediaService';
import { useSocialMedia } from '/@src/stores/CRM/SocialMedia/socialMediaStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('social_media.table.title'))
useHead({
  title: t('social_media.table.title'),
})
const notif = useNotyf()
const searchFilter = ref(defaultSocialMediaSearchFilter)
const socialMediasList = ref<Array<SocialMedia>>([])
const deleteSocialMediaPopup = ref(false)
const deleteSocialMediaId = ref()
const paginationVar = ref(defaultPagination)
const router = useRouter()
const socialMediaStore = useSocialMedia()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
  const { socialMedias, pagination } = await getSocialMediasList(searchFilter.value)
  socialMediasList.value = socialMedias
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});

const removeSocialMedia = async (socialMediaId: number) => {
  const { message, success } = await deleteSocialMedia(socialMediaId)
  await search(searchFilter.value)

  deleteSocialMediaPopup.value = false
  if (success) {

    await sleep(200);

    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

  } else {
    await sleep(200);

    notif.error(message)

  }
}

const search = async (searchFilter2: SocialMediaSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

  const { socialMedias, pagination } = await getSocialMediasList(searchFilter2)

  socialMediasList.value = socialMedias
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: SocialMediaSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getSocialMediasPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
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
    label : t('social_media.table.columns.id')

  },
  name: {
    align: 'center',
    sortable: true,
    label : t('social_media.table.columns.name')


  },
  icon: {
    align: 'center',
    label : t('social_media.table.columns.icon'),

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
    label : t('social_media.table.columns.status'),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === SocialMediaConsts.INACTIVE
              ? 'danger'
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
    label : t('social_media.table.columns.actions'),

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
  <SocialMediaTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="socialMediasList" @update:sort="socialMediaSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="socialMediaStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="socialMediasList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" 
          :subtitle="t('tables.placeholder.subtitle')" class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(socialMediasList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getSocialMediasPerPage" />
    <h6 v-if="socialMediasList.length != 0 && !socialMediaStore?.loading">
      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>

    <VPlaceloadText v-if="socialMediaStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <VModal :title="t('social_media.table.modal_title')" :open="deleteSocialMediaPopup" actions="center"
    @close="deleteSocialMediaPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('modal.delete_modal.title')"
        :subtitle="t('modal.delete_modal.title' , {title : viewWrapper.pageTitle})" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeSocialMedia(deleteSocialMediaId)">{{t('modal.buttons.confirm')}}</VButton>
    </template>
  </VModal>

</template>

