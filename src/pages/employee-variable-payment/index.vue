<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { Tippy } from 'vue-tippy';
import VTag from '/@src/components/base/tags/VTag.vue';
import EditDropDown from '/@src/components/OurComponents/EditDropDown.vue';
import NoViewDropDown from '/@src/components/OurComponents/NoViewDropDown.vue';
import VTagTippy from '/@src/components/OurComponents/VTagTippy.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultEmployeeVariablePayment, defaultEmployeeVariablePaymentSearchFilter, defaultUpdateEmployeeVariablePayment, EmployeeVariablePayment, EmployeeVariablePaymentConsts, EmployeeVariablePaymentSearchFilter, UpdateEmployeeVariablePayment } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { editEmployeeVariablePayment, getEmployeeVariablePaymentsList } from '/@src/services/HR/Payroll/EmployeeVariablePayment/employeeVariablePaymentService';
import { useEmployeeVariablePayment } from '/@src/stores/HR/Payoll/EmployeeVariablePayment/employeeVariablePaymentStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('employee_variable_payment.table.title'))
useHead({
  title: t('employee_variable_payment.table.title'),
})
const notif = useNotyf() as Notyf
const employeeVariablePaymentStore = useEmployeeVariablePayment()
const searchFilter = ref(defaultEmployeeVariablePaymentSearchFilter)
const employeeVariablePaymentsList = ref<Array<EmployeeVariablePayment>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
const changeStatusPopUp = ref(false)
const selectedEmployeeVariablePayment = ref(defaultEmployeeVariablePayment)
const newStatus = ref<number>()
const requiredDueDate = ref('');
const newDueDate = ref()
onMounted(async () => {
  const { employeeVariablePayments, pagination } = await getEmployeeVariablePaymentsList(searchFilter.value)
  employeeVariablePaymentsList.value = employeeVariablePayments
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: EmployeeVariablePaymentSearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
  const { employeeVariablePayments, pagination } = await getEmployeeVariablePaymentsList(newSearchFilter)
  employeeVariablePaymentsList.value = employeeVariablePayments
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: EmployeeVariablePaymentSearchFilter) => {
  searchFilter.value = newSearchFilter
  search(searchFilter.value)
}

const getEmployeeVariablePaymentsPerPage = async (pageNum: number) => {

  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const employeeVariablePaymentSort = async (value: string) => {
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
const changeStatus = async () => {
  if (newStatus.value == EmployeeVariablePaymentConsts.WAITING && newDueDate.value == undefined) {
    requiredDueDate.value = t('validation.date.required_error')
    return
  } else {
    let employeeVariablePaymentData = {} as UpdateEmployeeVariablePayment
    employeeVariablePaymentData.status = newStatus.value ?? selectedEmployeeVariablePayment.value.status
    if (newStatus.value == EmployeeVariablePaymentConsts.WAITING) {
      employeeVariablePaymentData.due_date = newDueDate.value
    } else {
      employeeVariablePaymentData.due_date = undefined

    }

    const { message, success } = await editEmployeeVariablePayment(selectedEmployeeVariablePayment.value.id, employeeVariablePaymentData);
    if (success) {


      notif.dismissAll();
      await sleep(200);


      notif.success(t('toast.success.edit'));
      selectedEmployeeVariablePayment.value.status = newStatus.value ?? selectedEmployeeVariablePayment.value.status
      selectedEmployeeVariablePayment.value.due_date = newDueDate.value
      changeStatusPopUp.value = false
    } else {
      await sleep(200);
      notif.error(message)
      changeStatusPopUp.value = false

    }

  }

}

const columns = {
  "employees.users.name": {
    align: 'center',
    sortable: true,
    label: t("employee_variable_payment.table.columns.employee_name"),
    renderRow: (row: any) =>
      h('span', row?.employee?.user?.first_name + ' ' + row?.employee?.user?.last_name),


  },
  "variable_payments.name": {
    align: 'center',
    label: t("employee_variable_payment.table.columns.variable_payment"),
    renderRow: (row: any) =>
      h('span', row?.variable_payment?.name),

  },
  "amount": {
    align: 'center',
    sortable: true,
    label: t("employee_variable_payment.table.columns.amount")
  },
  "variable_payment.type": {
    align: 'center',
    label: t("employee_variable_payment.table.columns.type"),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.variable_payment?.type === VariablePaymentConsts.DECREMENT_TYPE
              ? 'danger'
              : row?.variable_payment?.type === VariablePaymentConsts.INCREMENT_TYPE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return VariablePaymentConsts.getTypeName(row?.variable_payment?.type)
          },
        }
      ),

  },
  status: {
    align: 'center',
    label: t("employee_variable_payment.table.columns.status"),
    renderRow: (row: any) => {

      if (row?.status !== EmployeeVariablePaymentConsts.WAITING) {
        return h(
          VTag,
          {
            rounded: true,
            color: EmployeeVariablePaymentConsts.getStatusColor(row?.status),
          },
          {
            default() {
              return EmployeeVariablePaymentConsts.getStatusName(row?.status)
            },
          }
        );
      } else {
        return h(
          VTagTippy,
          {
            rounded: true,
            tag_color: EmployeeVariablePaymentConsts.getStatusColor(row?.status),
            tippy_content: t("employee_variable_payment.table.columns.due_date") + " : " + row?.due_date
          },
          {
            default() {
              return EmployeeVariablePaymentConsts.getStatusName(row?.status)
            },
          }
        );
      }
    }


  },
  "note": {
    align: 'center',
    label: t("employee_variable_payment.table.columns.note"),
    renderRow: (row: any) =>
      h('span', {
        innerHTML: row?.note ?
          `<div class="tooltip">${stringTrim(row?.note,10)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>` : '-',

      }),

  },
  "release_date": {
    align: 'center',
    sortable: true,
    label: t("employee_variable_payment.table.columns.release_date"),
    renderRow: (row: any) =>
      h('span', row?.release_date ? row?.release_date : '-'),

  },
  "created_at": {
    align: 'center',
    sortable: true,
    label: t("employee_variable_payment.table.columns.created_at")
  },
  "created_by": {
    align: 'center',
    label: t("employee_variable_payment.table.columns.created_by"),
    renderRow: (row: any) =>
      h('span', row?.created_by?.first_name + ' ' + row?.created_by?.last_name),

  },

  actions: {
    align: 'center',
    label: t("variable_payment.table.columns.actions"),
    renderRow: (row: any) =>
      h(NoViewDropDown, {

        onEdit: () => {
          (row?.status != EmployeeVariablePaymentConsts.RELEASED && row?.status != EmployeeVariablePaymentConsts.INACTIVE) ?
            router.push({ path: `/employee-variable-payment/${row?.id}/edit` }) :
            notif.error({
              message: t('toast.error.employee_variable_payment.cant_edit'),
              duration: 5000,
            })
        },
        onChangeStatus: () => {
          if (row?.status != EmployeeVariablePaymentConsts.RELEASED && row?.status != EmployeeVariablePaymentConsts.INACTIVE) {
            keyIncrement.value++
            changeStatusPopUp.value = true
            selectedEmployeeVariablePayment.value = row
            newStatus.value = row?.status
            newDueDate.value = row?.due_date
          }
          else {
            notif.error({
              message: t('toast.error.employee_variable_payment.cant_edit'),
              duration: 5000,
            })
          }
        }

      }),

  },
} as const
</script>

<template>
  <EmployeeVariablePaymentTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="t('employee_variable_payment.header_button')" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />


  <VFlexTableWrapper :columns="columns" :data="employeeVariablePaymentsList" @update:sort="employeeVariablePaymentSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="employeeVariablePaymentStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="employeeVariablePaymentsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(employeeVariablePaymentsList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getEmployeeVariablePaymentsPerPage" />
    <h6 class="pt-2 is-size-7"
      v-if="employeeVariablePaymentsList.length != 0 && !employeeVariablePaymentStore?.loading">
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
    <VPlaceloadText v-if="employeeVariablePaymentStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>

  <VModal :key="keyIncrement" :title="t('employee_variable_payment.table.modal_title')" :open="changeStatusPopUp"
    actions="center" @close="changeStatusPopUp = false">
    <template #content>
      <div class="form-fieldset">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VField class="column " id="user_status_id">
              <VLabel>{{ t('contractor.details.status', { title: viewWrapper.pageTitle })}}</VLabel>
              <VControl>
                <VSelect v-model="newStatus">
                  <VOption :value="EmployeeVariablePaymentConsts.PENDING">{{
                    EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.PENDING)
                  }}</VOption>
                  <VOption :value="EmployeeVariablePaymentConsts.APPROVED">{{
                    EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.APPROVED)
                  }}</VOption>
                  <VOption :value="EmployeeVariablePaymentConsts.INACTIVE">{{
                    EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.INACTIVE)
                  }}</VOption>
                  <VOption :value="EmployeeVariablePaymentConsts.WAITING">{{
                    EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.WAITING)
                  }}</VOption>
                </VSelect>
                <ErrorMessage name="user_status_id" />
                <p class="help is-danger mt-2" v-if="newStatus == EmployeeVariablePaymentConsts.INACTIVE">
                  {{ t('employee_variable_payment.table.deactivate_caution') }}</p>
              </VControl>
            </VField>
            <div class="column" v-if="newStatus == EmployeeVariablePaymentConsts.WAITING">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField id="due_date">
                    <VLabel class="required">{{ t('employee_variable_payment.form.due_at') }} </VLabel>
                    <VControl icon="feather:chevrons-right"
                      :class="(requiredDueDate != '') ? 'has-validation has-error' : ''">
                      <VInput v-model="newDueDate" type="date" />
                      <ErrorMessage class="help is-danger" name="due_date" />
                      <p class="help is-danger"
                        v-if="newStatus == EmployeeVariablePaymentConsts.WAITING && newDueDate == undefined">
                        {{ requiredDueDate }}</p>
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="changeStatus()">{{ t('modal.buttons.confirm') }}</VButton>
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
  width: 150px;
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
