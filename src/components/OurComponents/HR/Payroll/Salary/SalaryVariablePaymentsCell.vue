<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { EmployeeVariablePayment, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { useDarkmode } from '/@src/stores/darkmode';

export interface SalaryVariablePaymentsCellProps {
    employeeVariablePayments: EmployeeVariablePayment[]


}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'approveClick', employeeVariablePayment: EmployeeVariablePayment): void
}>()

const dark = useDarkmode();

const props = withDefaults(defineProps<SalaryVariablePaymentsCellProps>(), {
    employeeVariablePayments: undefined,
})

const employeeVariablePayments = computed(() => {
    return props.employeeVariablePayments
})

const approvePopup = (employeeVariablePayment: EmployeeVariablePayment) => {
    emits('approveClick', employeeVariablePayment)
}
const numberFormat = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

</script>

<template>
    <div class="is-flex-direction-column full-cell">
        <div class="section" v-for="employeeVariablePayment in employeeVariablePayments">
            <div class="columns">
                <div class="column is-3 field is-flex is-justify-content-center is-align-items-center">
                    <h3 class="">{{ employeeVariablePayment.variable_payment.name }}</h3>
                </div>
                <div class="column is-3 field is-flex is-justify-content-center is-align-items-center">
                    <h3
                        :class="employeeVariablePayment.variable_payment.type == VariablePaymentConsts.INCREMENT_TYPE ? 'has-text-primary' : 'has-text-danger'">
                        {{ numberFormat(employeeVariablePayment.amount) }}</h3>
                </div>
                <div class="column is-3 field is-flex is-justify-content-center is-align-items-center">
                    <VTag :color="EmployeeVariablePaymentConsts.getStatusColor(employeeVariablePayment.status)"
                        :label="EmployeeVariablePaymentConsts.getStatusName(employeeVariablePayment.status)" rounded />
                </div>
                <div v-if="employeeVariablePayment.status == EmployeeVariablePaymentConsts.PENDING"
                    class="column is-3 field is-flex is-justify-content-center is-align-items-center">
                    <VIconButton @click="approvePopup(employeeVariablePayment)" color="primary" outlined
                        icon="feather:check-circle" />
                </div>

            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
.full-cell {
    width: 100%
}

.section {
    height: 60px;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--fade-grey-dark-3);
}

.section:last-child {
    border: 0;

}

.field {

    border-right: 1px dashed var(--fade-grey-dark-3);
    margin-top: 0;
    margin-bottom: 0;

}

.field:nth-child(4) {
    border: 0;

}

.rtl {
    .field {
        border-right: none;
        border-left: 1px dashed var(--fade-grey-dark-3);

    }
    .field:nth-child(4) {
    border: 0;

}

}


.is-dark {

    .section {
        border-bottom: 1px solid var(--dark-sidebar-light-12);
    }

    .section:last-child {
        border: 0;

    }

    .field {
        border-right: 1px dashed var(--dark-sidebar-light-12);

    }

    .field:nth-child(4) {
        border: 0;

    }


}
.is-dark.rtl {
    .field {
        border: none;
        border-left: 1px dashed var(--dark-sidebar-light-12);

    }
    .field:nth-child(4) {
    border: 0;

}

}

</style>