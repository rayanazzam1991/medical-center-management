<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultEmployeeVariablePaymentSearchFilter } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment'
import { VariablePaymentSearchFilter } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'
import { defaultPagination } from '/@src/utils/response'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
import { ReservationSearchFilter, defaultReservationSearchFilter } from '/@src/models/Sales/Reservation/reservation'

export default defineComponent({
    props: {
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        button_name: {
            type: String,
            default: '',
        },


    },


    setup(props, context) {
        const { t } = useI18n()
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            customerNameSearchField.value = ''
            providerNameSearchField.value = ''
            serviceNameSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }

        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const customerNameSearchField = ref('')
        const providerNameSearchField = ref('')
        const serviceNameSearchField = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultReservationSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1
            searchFilter.value.customer_name = customerNameSearchField.value
            searchFilter.value.provider_name = providerNameSearchField.value
            searchFilter.value.service_name = serviceNameSearchField.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: ReservationSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.customer_name = undefined
            searchFilter.value.provider_name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.service_name = undefined
            searchFilter.value.cancellation_reason = undefined
            customerNameSearchField.value = ''
            providerNameSearchField.value = ''
            serviceNameSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.customer_name = undefined
            searchFilter.value.provider_name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.service_name = undefined
            searchFilter.value.cancellation_reason = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, Permissions, keyIncrement, providerNameSearchField, customerNameSearchField, serviceNameSearchField, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, perPage, pagination }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="customerNameSearchField" type="text"
                                    :placeholder="t('reservation.search_filter.customer_name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="providerNameSearchField" type="text"
                                    :placeholder="t('reservation.search_filter.provider_name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="serviceNameSearchField" type="text"
                                    :placeholder="t('reservation.search_filter.service_name')" />
                            </VControl>
                            <VButton type="submit" @click="search" class="is-hidden" />
                            <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">
                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page * 0.1 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                                        </VOption>
                                        <VOption :value="default_per_page">{{ default_per_page }}
                                        </VOption>
                                        <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                                        </VOption>
                                    </select>
                                </div>
                            </VControl>
                            <VControl v-permission="Permissions.RESERVATION_LIST">
                                <VButton to="/reservation-calendar" color="primary">{{ button_name }}
                                </VButton>
                            </VControl>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ReservationListSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
