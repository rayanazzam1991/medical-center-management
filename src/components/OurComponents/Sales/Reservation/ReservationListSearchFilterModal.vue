<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultEmployeeVariablePaymentSearchFilter, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment'
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'
import { defaultReservationSearchFilter, ReservationConsts } from '/@src/models/Sales/Reservation/reservation'

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchCustomerName = ref()
        const searchProviderName = ref()
        const searchServiceName = ref()
        const searchStatus = ref()
        const searchCancellationReason = ref()
        const searchFilter = ref(defaultReservationSearchFilter)
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })
        const search = () => {
            searchFilter.value = {
                cancellation_reason: searchCancellationReason.value,
                customer_name: searchCustomerName.value,
                provider_name: searchProviderName.value,
                service_name: searchServiceName.value,
                status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchCancellationReason.value = undefined
            searchServiceName.value = undefined
            searchStatus.value = undefined
            searchCustomerName.value = undefined
            searchProviderName.value = undefined
            searchFilter.value.customer_name = undefined
            searchFilter.value.provider_name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.service_name = undefined
            searchFilter.value.cancellation_reason = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return { t, search, resetFilter, search_filter_popup, searchCancellationReason, searchStatus, searchServiceName, searchCustomerName, searchProviderName, ReservationConsts }
    },
})
</script>

<template>
    <VModal :title="t('reservation.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchCustomerName" type="text" class="input"
                            :placeholder="t('reservation.search_filter.customer_name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchProviderName" type="text" class="input"
                            :placeholder="t('reservation.search_filter.provider_name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchServiceName" type="text" class="input"
                            :placeholder="t('reservation.search_filter.service_name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchCancellationReason" type="text" class="input"
                            :placeholder="t('reservation.search_filter.cancellation_reason')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{ t('reservation.search_filter.status') }}</VOption>
                            <VOption :value="ReservationConsts.ACTIVE">{{
                                ReservationConsts.getStatusName(ReservationConsts.ACTIVE) }}
                            </VOption>
                            <VOption :value="ReservationConsts.CANCELLED">{{
                                ReservationConsts.getStatusName(ReservationConsts.CANCELLED) }}
                            </VOption>
                            <VOption :value="ReservationConsts.PAST">{{
                                ReservationConsts.getStatusName(ReservationConsts.PAST) }}
                            </VOption>
                            <VOption :value="ReservationConsts.INACTIVE">{{
                                ReservationConsts.getStatusName(ReservationConsts.INACTIVE) }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}
            </VButton>
        </template>
    </VModal>
</template>

