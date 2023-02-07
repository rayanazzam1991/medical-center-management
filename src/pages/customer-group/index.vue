<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import AddEditDropDown from '/@src/components/OurComponents/AddEditDropDown.vue';
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCustomerGroupSearchFilter, CustomerGroupSearchFilter, CustomerGroupConsts, CustomerGroup } from '/@src/models/Others/CustomerGroup/customerGroup';
import { getCustomerGroupsList } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useCustomerGroup } from '/@src/stores/Others/CustomerGroup/customerGroupStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('customer_group.table.title'))
useHead({
  title: t('customer_group.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultCustomerGroupSearchFilter)
const customerGroupsList = ref<Array<CustomerGroup>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()

const default_per_page = ref(1)
const customerGroupStore = useCustomerGroup()
const keyIncrement = ref(0)
onMounted(async () => {
  const { customerGroups, pagination } = await getCustomerGroupsList(searchFilter.value)
  customerGroupsList.value = customerGroups
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});



const search = async (searchFilter2: CustomerGroupSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

  const { customerGroups, pagination } = await getCustomerGroupsList(searchFilter2)

  customerGroupsList.value = customerGroups
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: CustomerGroupSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getcustomerGroupsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const customerGroupSort = async (value: string) => {
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
    label: t('customer_group.table.columns.id')

  },
  name: {
    align: 'center',
    sortable: true,
    label: t('customer_group.table.columns.name')


  },
  status: {
    align: 'center',
    label: t('customer_group.table.columns.status'),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === CustomerGroupConsts.INACTIVE
              ? 'danger'
              : row?.status === CustomerGroupConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return CustomerGroupConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',
    label: t('customer_group.table.columns.actions'),

    renderRow: (row: any) =>
      h(AddEditDropDown, {
        onEdit: () => {
          router.push({ path: `/customer-group/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/customer-group/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <CustomerGroupTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="t('customer_group.header_button')" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="customerGroupsList" @update:sort="customerGroupSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="customerGroupStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>

          </div>
        </div>
        <div v-else-if="customerGroupsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>
    <VFlexPagination v-if="(customerGroupsList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getcustomerGroupsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="customerGroupsList.length != 0 && !customerGroupStore?.loading">

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
    <VPlaceloadText v-if="customerGroupStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>

</template>

