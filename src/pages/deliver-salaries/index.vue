<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import DeliverSalariesDropDown from '/@src/components/OurComponents/HR/Payroll/Salary/DeliverSalariesDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { DeliveringSalary, defaultDeliveringSalariesSearchFilter, SalaryConsts, DeliveringSalariesSearchFilter } from '/@src/models/HR/Payroll/Salary/salary';
import { getDeliveringSalariesList, moveSalariesToOnholdList, paySalaryService } from '/@src/services/HR/Payroll/Salary/salaryService';
import { useSalary } from '/@src/stores/HR/Payoll/Salary/salaryStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('deliver_salaries.table.title'))
useHead({
    title: t('deliver_salaries.table.title'),
})
const notif = useNotyf() as Notyf
const salaryStore = useSalary()
const salariesList = ref<DeliveringSalary[]>([])
const keyIncrement = ref(0)
const router = useRouter()
const paginationVar = ref(defaultPagination)
const default_per_page = ref(1)

const searchFilter = ref(defaultDeliveringSalariesSearchFilter)
const moveSalariesToOnholdPopUp = ref(false)
const isLoading = ref(false)
onMounted(async () => {
    const { deliveringSalaries, pagination } = await getDeliveringSalariesList(searchFilter.value)
    salariesList.value = deliveringSalaries
    paginationVar.value = pagination
    default_per_page.value = pagination.per_page
    keyIncrement.value = keyIncrement.value + 1


});
const search = async (newSearchFilter: DeliveringSalariesSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { deliveringSalaries, pagination } = await getDeliveringSalariesList(newSearchFilter)

    salariesList.value = deliveringSalaries
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter

}
const getSalariesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const moveToOnhold = async () => {
    const { message, success } = await moveSalariesToOnholdList()
    if (success) {
        salariesList.value = []
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.salaries_to_onhold'))
        moveSalariesToOnholdPopUp.value = false
    } else {
        await sleep(200);
        notif.error(message)
    }
}
const paySalary = async (salaryId: number) => {
    const { message, success } = await paySalaryService(salaryId)
    if (success) {
        search(searchFilter.value)
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.pay_salary'))
    } else {
        await sleep(200);
        notif.error(message)
    }
}

const columns = {
    employee_name: {
        align: 'center',
        label: t("deliver_salaries.table.columns.employee_name"),
        renderRow: (row: any) =>
            h('span', row?.employee?.user?.first_name + ' ' + row?.employee?.user?.last_name),
    },
    net_salary: {
        align: 'center',
        label: t("deliver_salaries.table.columns.net_salary"),
    },
    status: {
        align: 'center',
        label: t("deliver_salaries.table.columns.status"),
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color: SalaryConsts.getStatusColor(row?.status)
                },
                {
                    default() {
                        return SalaryConsts.getStatusName(row?.status)
                    },
                }
            )
    },
    updated_at: {
        align: 'center',
        label: t("deliver_salaries.table.columns.updated_at"),
        renderRow: (row: any) =>
            h('span', row?.updated_at ? row?.updated_at : '-'),
    },
    actions: {
        align: 'center',
        label: t('deliver_salaries.table.columns.actions'),

        renderRow: (row: any) =>
            h(DeliverSalariesDropDown, {
                onClickPay: async () => {
                    await paySalary(row?.id)
                },
            }),

    },

} as const
</script>

<template>
    <DeliverSalariesTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="t('deliver_salaries.header_button')" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @moveToOnhold="moveSalariesToOnholdPopUp = true" />


    <VFlexTableWrapper :columns="columns" :data="salariesList">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="salaryStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="salariesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('deliver_salaries.table.placeholder.title')"
                        :subtitle="t('deliver_salaries.table.placeholder.subtitle')" class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(salariesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getSalariesPerPage" />
        <h6 v-if="salariesList.length != 0 && !salaryStore?.loading">
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
        <VPlaceloadText v-if="salaryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>

    <VModal :title="t('deliver_salaries.table.approve_modal.title')" :open="moveSalariesToOnholdPopUp" actions="center"
        @close="moveSalariesToOnholdPopUp = false">
        <template #content>
            <VPlaceholderSection :title="t('deliver_salaries.table.approve_modal.caution')"
                :subtitle="t('deliver_salaries.table.approve_modal.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="isLoading" color="primary" raised @click="moveToOnhold">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>



</template>