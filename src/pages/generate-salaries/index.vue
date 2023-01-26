<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import GenerateSalariesHeader from '/@src/components/OurComponents/HR/Payroll/Salary/GenerateSalariesHeader.vue';
import SalaryVariablePaymentsCell from '/@src/components/OurComponents/HR/Payroll/Salary/SalaryVariablePaymentsCell.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultEmployeeVariablePayment, defaultUpdateEmployeeVariablePayment, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { defaultGeneratableMonth, GeneratableMonth } from '/@src/models/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonth';
import { ReviewSalaries, defaultReviewSalaries, ReviewSalary, ReviewGenerateSalariesRequestBody } from '/@src/models/HR/Payroll/Salary/salary';
import { editEmployeeVariablePayment } from '/@src/services/HR/Payroll/EmployeeVariablePayment/employeeVariablePaymentService';
import { getGeneratableMonths } from '/@src/services/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonthService';
import { getGenerateSalary, getReviewSalary } from '/@src/services/HR/Payroll/Salary/salaryService';
import { useSalary } from '/@src/stores/HR/Payoll/Salary/salaryStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import sleep from '/@src/utils/sleep';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('generate_salaries.table.title'))
useHead({
    title: t('generate_salaries.table.title'),
})
const notif = useNotyf() as Notyf
const salaryStore = useSalary()
const salaries = ref<ReviewSalaries>(defaultReviewSalaries)
const salariesList = ref<ReviewSalary[]>([])
const generatableMonthsList = ref<GeneratableMonth[]>([])
const keyIncrement = ref(0)
const router = useRouter()
const approveVariablePaymentPopUp = ref(false)
const selectedVariablePayment = ref()
const isLoading = ref(false)
const selectedMonth = ref<GeneratableMonth>(defaultGeneratableMonth)
onMounted(async () => {
    const { generatableMonths } = await getGeneratableMonths()
    generatableMonthsList.value = generatableMonths
    keyIncrement.value = keyIncrement.value + 1

});

const getSalariesReview = async (selectedGeneratableMonth: GeneratableMonth) => {
    const reviewSalariesRequestBody: ReviewGenerateSalariesRequestBody = selectedGeneratableMonth
    selectedMonth.value = selectedGeneratableMonth
    const { reviewSalaries, message, success } = await getReviewSalary(reviewSalariesRequestBody)
    if (success) {
        salaries.value = reviewSalaries
        salariesList.value = reviewSalaries.salaries
    }
    else {
        notif.error({ message: message, duration: 10000 })
    }
}
const generateSalaries = async () => {
    const reviewSalariesRequestBody: ReviewGenerateSalariesRequestBody = selectedMonth.value
    const { message, success } = await getGenerateSalary(reviewSalariesRequestBody)
    if (success) {
        notif.dismissAll();
        await sleep(200);
        notif.success(t('toast.success.edit'));
        approveVariablePaymentPopUp.value = false
        router.push({ path: '/employee' });

    }
    else {
        notif.error({ message: message, duration: 10000 })
    }
}

const approveVariablePayment = async () => {
    isLoading.value = true
    let employeeVariablePaymentData = defaultUpdateEmployeeVariablePayment
    employeeVariablePaymentData.status = EmployeeVariablePaymentConsts.APPROVED
    const { message, success } = await editEmployeeVariablePayment(selectedVariablePayment.value.id, employeeVariablePaymentData);
    if (success) {
        notif.dismissAll();
        await sleep(200);
        notif.success(t('toast.success.generate_salaries'));
        await getSalariesReview(selectedMonth.value)
        approveVariablePaymentPopUp.value = false
    } else {
        await sleep(200);
        notif.error(message)
    }
    isLoading.value = false


}
const columns = {
    employee_name: {
        align: 'center',
        label: t("generate_salaries.table.columns.employee_name"),
        renderRow: (row: any) =>
            h('span', row?.employee?.user?.first_name + ' ' + row?.employee?.user?.last_name),
    },
    basic_salary: {
        align: 'center',
        label: t("generate_salaries.table.columns.basic_salary"),
    },
    unjustified_hours: {
        align: 'center',
        label: t("generate_salaries.table.columns.unjustified_hours"),
    },
    attendance_deduction: {
        align: 'center',
        label: t("generate_salaries.table.columns.attendance_deduction"),
    },
    variable_payments: {
        align: 'center',
        grow: true,
        label: t("generate_salaries.table.columns.variable_payments"),
        renderRow: (row: any) => {
            if(row?.variable_payments.length != 0) {

                return h(SalaryVariablePaymentsCell,
                {
                    employeeVariablePayments: row?.variable_payments,
                    onApproveClick: (employeeVariablePayment) => {
                        keyIncrement.value++
                        approveVariablePaymentPopUp.value = true
                        selectedVariablePayment.value = employeeVariablePayment
                    }
                });
            }
            else {
                return h('span','-');
 
            }
        }
    },
    net_salary: {
        align: 'center',
        label: t("generate_salaries.table.columns.net_salary"),
    },
} as const
</script>

<template>
    <GenerateSalariesHeader :generatableMonths="generatableMonthsList" :key="keyIncrement"
        :title="viewWrapper.pageTitle" :button_name="t('generate_salaries.header_button')"
        @getSalariesReview="getSalariesReview" />


    <VFlexTableWrapper :columns="columns" :data="salariesList">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="salaryStore?.loading" class="flex-list-inner">
                    <div v-for="key in 10" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="salariesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title=" generatableMonthsList.length == 0 ? t('generate_salaries.table.placeholder.no_month_title') : t('generate_salaries.table.placeholder.select_month_title')"
                        :subtitle="generatableMonthsList.length == 0 ? t('generate_salaries.table.placeholder.no_month_subtitle') : '' " class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <form v-if="salariesList.length > 0" class="form-layout">
            <div class="form-outer-footer">
                <div class="form-header stuck-header">
                    <div class="form-header-inner-footer columns">
                        <div class="left column is-10 is-flex is-justify-content-center left-footer ">
                        </div>
                        <div class="left column is-2 is-flex is-justify-content-center left-footer ">
                            <div class="left">
                                <h3 class="is-size-6">
                                    {{ t('generate_salaries.table.footer.salaries_sum') }} <span class="has-text-weight-semibold has-text-primary"> {{ salaries.salaries_sum }}</span> 

                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    </VFlexTableWrapper>
    <form v-if="salariesList.length > 0" class="form-layout">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner columns">
                    <div class="left mt-0  column is-10 is-flex is-justify-content-center">
                    </div>

                    <div class="left my-2  column is-2 is-flex is-justify-content-center">
                        <div class="left">
                            <VButton @click="generateSalaries" class="px-6 py-5" color="primary">{{
                                t('generate_salaries.table.footer.generate')
                            }}
                            </VButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>


    <VModal :title="t('generate_salaries.table.approve_modal.title')" :open="approveVariablePaymentPopUp"
        actions="center" @close="approveVariablePaymentPopUp = false">
        <template #content>
            <VPlaceholderSection :title="t('generate_salaries.table.approve_modal.caution')"
                :subtitle="t('generate_salaries.table.approve_modal.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="isLoading" color="primary" raised @click="approveVariablePayment">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>



</template>

<style scoped lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.form-header-inner-footer {
    margin: 0 !important;
    margin-top: 1rem !important;
}

.form-outer-footer {
    border: 0 !important;
    border-radius: 0 !important;
    border-top: 2px solid var(--fade-grey-dark-3) !important;
}

.right-footer {
    border-left: 1px dashed var(--fade-grey-dark-3);
}

.is-dark {

    .right-footer {
        border-left: 1px dashed var(--dark-sidebar-light-12);

    }

    .form-outer-footer {
        border: 0 !important;
        border-radius: 0 !important;
        border-top: 2px solid var(--dark-sidebar-light-12) !important;
    }

}

</style>