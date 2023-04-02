<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultEmployeeVariablePaymentSearchFilter } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment'
import { VariablePaymentSearchFilter } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'
import { defaultTicketServiceSearchFilter, TicketServiceSearchFilter } from '/@src/models/Sales/TicketService/ticketService'
import { defaultPagination } from '/@src/utils/response'





export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        is_for_customer: {
            type: Boolean,
            default: false,
        },
        is_for_employee: {
            type: Boolean,
            default: false,
        }



    },


    setup(props, context) {
        const { t } = useI18n()
        const onOpen = () => {
            searchFilter.value.note = undefined
            searchNote.value = undefined
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const searchNote = ref()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultTicketServiceSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.note = searchNote.value
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: TicketServiceSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            searchFilter.value.note = searchNote.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.created_at_from = undefined
            searchFilter.value.created_at_to = undefined
            searchFilter.value.status = undefined
            searchFilter.value.customer_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.provider_id = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.service_id = undefined
            searchFilter.value.note = undefined
            searchNote.value = undefined
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.created_at_from = undefined
            searchFilter.value.created_at_to = undefined
            searchFilter.value.status = undefined
            searchFilter.value.customer_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.provider_id = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.service_id = undefined
            searchFilter.value.note = undefined
            searchNote.value = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, keyIncrement, is_reseted, default_per_page, searchNote, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, perPage, pagination }
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
                                <VInput v-model="searchNote" type="text"
                                    :placeholder="t('requested_services.search_filter.note')" />
                            </VControl>

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

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TicketServiceSearchFilterModal :is_for_customer="$props.is_for_customer" :is_for_employee="$props.is_for_employee"
            :key="keyIncrement" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
            @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
