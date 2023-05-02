<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultEmployeeVariablePaymentSearchFilter, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment'
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchName = ref()
        const searchType = ref()
        const searchStatus = ref()
        const searchDateFrom = ref()
        const searchDateTo = ref()
        const searchFilter = ref(defaultEmployeeVariablePaymentSearchFilter)
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                type: searchType.value,
                status: searchStatus.value,
                from: searchDateFrom.value,
                to: searchDateTo.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = undefined
            searchType.value = undefined
            searchStatus.value = undefined
            searchDateFrom.value = undefined
            searchDateTo.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.type = undefined
            searchFilter.value.status = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return { t, search, resetFilter, search_filter_popup, searchName, searchStatus, searchType, searchDateFrom, searchDateTo, EmployeeVariablePaymentConsts, VariablePaymentConsts }
    },
})
</script>

<template>
    <VModal :title="t('employee_variable_payment.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input "
                            :placeholder="t('employee_variable_payment.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchType" class="">
                            <VOption value="">{{ t('employee_variable_payment.search_filter.type') }}</VOption>
                            <VOption :value="VariablePaymentConsts.INCREMENT_TYPE">{{
                                VariablePaymentConsts.getTypeName(VariablePaymentConsts.INCREMENT_TYPE) }}</VOption>
                            <VOption :value="VariablePaymentConsts.DECREMENT_TYPE">{{
                                VariablePaymentConsts.getTypeName(VariablePaymentConsts.DECREMENT_TYPE) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{ t('variable_payment.search_filter.status') }}</VOption>
                            <VOption :value="EmployeeVariablePaymentConsts.PENDING">{{
                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.PENDING) }}
                            </VOption>
                            <VOption :value="EmployeeVariablePaymentConsts.APPROVED">{{
                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.APPROVED) }}
                            </VOption>
                            <VOption :value="EmployeeVariablePaymentConsts.WAITING">{{
                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.WAITING) }}
                            </VOption>
                            <VOption :value="EmployeeVariablePaymentConsts.RELEASED">{{
                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.RELEASED) }}
                            </VOption>
                            <VOption :value="EmployeeVariablePaymentConsts.INACTIVE">{{
                                EmployeeVariablePaymentConsts.getStatusName(EmployeeVariablePaymentConsts.INACTIVE) }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{t('employee_variable_payment.search_filter.date')}}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('employee_variable_payment.search_filter.from') }} </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('employee_variable_payment.search_filter.to')}} </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateTo" type="date" />
                        </VControl>
                    </VField>
                </div>


                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}
            </VButton>
        </template>
    </VModal>
</template>

