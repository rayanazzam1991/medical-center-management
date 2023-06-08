<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "department_list"
    ]
  }
}
</route>

<script setup lang="ts">
import VTag from '/@src/components/base/tags/VTag.vue'
import { useHead } from '@vueuse/head'
import { nationalService } from '/@src/services/Others/National/nationalService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultNationalSearchFilter, NationalSearchFilter, NationalConsts, National } from '/@src/models/Others/National/national'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { nationalStore } from '/@src/stores/Others/National/NationalStore'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import ViewEditDropDown from '/@src/components/OurComponents/ViewEditDropDown.vue'
import { Permissions } from '/@src/utils/consts/rolesPermissions'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('national.table.title'))
useHead({
  title: t('national.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultNationalSearchFilter)
const NationalList = ref<Array<National>>([])
const paginationVar = ref(defaultPagination)
const _nationalStore = nationalStore()

const default_per_page = ref(1)
const keyIncrement = ref(0)

const router = useRouter()
onMounted(async () => {
  const _nationalService = new nationalService()
  const { nationals, pagination } = await _nationalService.get(searchFilter.value)
  NationalList.value = nationals
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});


const search = async (searchFilter2: NationalSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
  const _nationalService = new nationalService()
  const { nationals, pagination } = await _nationalService.get(searchFilter2)

  NationalList.value = nationals
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: NationalSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getNationalsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const nationalSort = async (value: string) => {
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
    label: t('national.table.columns.id')

  },
  name: {
    align: 'center',
    sortable: true,
    label: t('national.table.columns.name')


  },
  status: {
    align: 'center',
    label: t('national.table.columns.status'),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === NationalConsts.INACTIVE
              ? 'danger'
              : row.status === NationalConsts.ACTIVE
                ? 'success'
                : undefined,

        },
        {
          default() {
            return NationalConsts.showStatusName(row.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',
    label: t('national.table.columns.status'),
    renderRow: (row: any) =>
      h(ViewEditDropDown, {
        editPermission: Permissions.SERVICE_EDIT,
        viewPermission: Permissions.SERVICE_ACCESS,
        onEdit: () => {
          router.push({ path: `/national/${row.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/national/${row.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <NationalTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('national.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="NationalList" @update:sort="nationalSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="_nationalStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>

          </div>
        </div>
        <div v-else-if="NationalList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>
    <VFlexPagination v-if="(NationalList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getNationalsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="NationalList.length != 0 && !_nationalStore?.loading">

      {{
        t('tables.pagination_footer', {
          from_number: paginationVar.page !=
            paginationVar.max_page
            ?
            (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
              ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
          , to_number: paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
        }) }}</h6>
    <VPlaceloadText v-if="_nationalStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

  </VFlexTableWrapper>
</template>

