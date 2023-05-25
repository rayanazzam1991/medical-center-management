<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "supplier_list"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { editSupplier, getSuppliersList } from '/@src/services/Others/Supplier/supplierService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultSupplierSearchFilter, SupplierSearchFilter, SupplierConsts, Supplier, defaultSupplier, defaultUpdateSupplier, UpdateSupplier } from '/@src/models/Others/Supplier/supplier'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useSupplier } from '/@src/stores/Others/Supplier/supplierStore'
import sleep from '/@src/utils/sleep'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import { stringTrim } from '/@src/composable/helpers/stringHelpers'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('supplier.table.title'))
useHead({
  title: t('supplier.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultSupplierSearchFilter)
const suppliersList = ref<Array<Supplier>>([])
const changeStatusPopup = ref(false)
const supplierChangeStatus = ref<Supplier>(defaultSupplier)
//const currentChangeStatusSupplier = ref(defaultUpdateSupplier)

const newStatus = ref<number>(0)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const supplierStore = useSupplier()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
  const { suppliers, pagination } = await getSuppliersList(searchFilter.value)
  suppliersList.value = suppliers
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});


const search = async (newSearchFilter: SupplierSearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page

  const { suppliers, pagination } = await getSuppliersList(newSearchFilter)

  suppliersList.value = suppliers
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: SupplierSearchFilter) => {
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
}
const getSuppliersPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const supplierSort = async (value: string) => {
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

const changestatusSupplier = async () => {

  const changeStatusData: UpdateSupplier = {
    id: supplierChangeStatus.value.id ?? 0,
    status: newStatus.value
  }
  const { message, success } = await editSupplier(changeStatusData)
  if (success) {

    // @ts-ignore
    notif.dismissAll()
    await sleep(200);
    // @ts-ignore
    supplierChangeStatus.value.status = newStatus.value
    notif.success(t('toast.success.edit'))
  } else {
    await sleep(200);
    // @ts-ignore

    notif.error(message)
  }
  changeStatusPopup.value = false
}

const columns = {
  id: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.id')
  },
  name: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.name'),
    renderRow: (row: any) =>
      h('span', row.name)
  },
  phone_number: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.phone'),
    renderRow: (row: any) =>
      h('span', row.phone_number)
  },
  address: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.address'),
    renderRow: (row: any) =>
      h('span', row?.address ?? '-')
  },
  notes: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.notes'),
    renderRow: (row: any) =>
      h('span', {
        innerHTML: row?.notes ?
          `<div class="tooltip">${stringTrim(row?.notes, 10)}<div class="tooltiptext"><p class="text-white">${row?.notes}</p></div></div>` : '-',

      }),

  },
  city: {
    sortable: true,
    searchable: true,
    align: 'center',
    label: t('supplier.table.columns.city'),
    renderRow: (row: any) =>
      h('span', row?.city?.name ?? '-')
  },
  status: {
    align: 'center',
    label: t('supplier.table.columns.status'),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === SupplierConsts.INACTIVE
              ? 'danger'
              : row.status === SupplierConsts.ACTIVE
                ? 'success'
                : 'info',
        },
        {
          default() {
            return SupplierConsts.getSupplierStatusName(row.status)
          },
        }
      ),
  },
  related_expense_account: {
    align: 'center',
    label: t('supplier.table.columns.expense_related_account'),
    renderRow: (row: Supplier) =>
      h('span', row?.account_contacts?.find((account) => account.is_expense_account)?.account?.name ?? '-')
  },

  created_by: {
    sortable: true,
    searchable: true,
    align: 'center',
    label: t('supplier.table.columns.created_by'),
    renderRow: (row: any) =>
      h('span', row?.created_by?.first_name)
  },
  created_at: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('supplier.table.columns.created_at'),
    renderRow: (row: any) =>
      h('span', row.created_at)
  },
  actions: {
    align: 'center',
    label: t('supplier.table.columns.actions'),
    renderRow: (row: any) =>
      h(NoDeleteDropDown, {
        changeStatusPermission: Permissions.SUPPLIER_EDIT,
        editPermission: Permissions.SUPPLIER_EDIT,
        viewPermission: Permissions.SUPPLIER_SHOW,
        onChangeStatus: () => {
          supplierChangeStatus.value = row
          newStatus.value = row.status
          changeStatusPopup.value = true
        },
        onEdit: () => {
          router.push({ path: `/supplier/${row.id}/edit` })
        },

        onView: () => {
          router.push({ path: `/supplier/${row.id}` })
        },

      }),
  },
} as const
</script>

<template>
  <SupplierTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('supplier.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="suppliersList" @update:sort="supplierSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="supplierStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="suppliersList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(suppliersList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getSuppliersPerPage" />
    <h6 v-if="suppliersList.length != 0 && !supplierStore?.loading">
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

    <VPlaceloadText v-if="supplierStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <VModal :title="t('supplier.model.title')" :open="changeStatusPopup" actions="center"
    @close="changeStatusPopup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField class="column ">
                <VLabel>{{ t('supplier.model.status') }}</VLabel>
                <VControl>
                  <VSelect v-model="newStatus">
                    <VOption v-for="status in SupplierConsts.SUPPLIER_STATUSES" :key="status" :value="status">
                      {{ SupplierConsts.getSupplierStatusName(status) }}
                    </VOption>
                  </VSelect>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="changestatusSupplier()">{{ t('modal.buttons.confirm') }}</VButton>
    </template>
  </VModal>
</template>
<style lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: fit-content;
  background-color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  word-break: keep-all;
  white-space: normal;


  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;


}

.is-dark {
  .tooltip .tooltiptext {
    background-color: rgb(43, 41, 41);
  }
}
</style>
