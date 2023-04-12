<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultCustomerSearchFilter, CustomerSearchFilter } from "/@src/models/CRM/Customer/customer"
import { defaultPagination } from "/@src/utils/response"
import { isNumber } from "/@src/composable/helpers/isNumberCheck"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { useCustomer } from "/@src/stores/CRM/Customer/customerStore"

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
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
        is_for_dashboard: {
            type: Boolean,
            default: false,
        },
        with_title: {
            type: Boolean,
            default: false,
        },


    },


    setup(props, context) {
        const { t } = useI18n()

        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            quickSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const customerStore = useCustomer()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultCustomerSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const quickSearchField = ref('')
        const quickSearch = () => {
            if (quickSearchField.value != '') {

                searchFilter.value.name = quickSearchField.value
                if (isNumber(quickSearchField.value)) {

                    searchFilter.value.phone_number = Number(quickSearchField.value)
                }
                else {
                    searchFilter.value.phone_number = undefined
                }
                searchFilter.value.quick_search = true

            } else {
                searchFilter.value.phone_number = undefined
                searchFilter.value.name = undefined
                searchFilter.value.quick_search = undefined


            }
            searchFilter.value.per_page = perPage.value

            search()
        }

        const search = async () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1

            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: CustomerSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.customer_group_id = undefined
            searchFilter.value.is_completed = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.quick_search = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: CustomerSearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.customer_group_id = undefined
            searchFilter.value.is_completed = undefined
            searchFilter.value.user_status_id = undefined


            context.emit('resetFilter', searchFilter.value)

        }
        return { t, Permissions, customerStore, searchFilter, keyIncrement, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, perPage, pagination, quickSearch, quickSearchField }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 v-if="$props.with_title" class="title">
                    {{ t('customer.table.title') }}
                </h1>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 " :class="[$props.is_for_dashboard && 'bigger-width']">
                        <div class="columns is-flex is-align-items-center">
                            <VControl :class="[$props.is_for_dashboard && 'bigger-width']" class="mr-2"
                                icon="feather:search">
                                <VInput v-model="quickSearchField" type="text"
                                    :placeholder="t('customer.search_filter.quick_search')" />
                            </VControl>
                            <VIconButton v-if="!$props.is_for_dashboard" class="mr-2" @click.prevent="onOpen"
                                icon="fas fa-filter" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>

                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 "
                                v-if="(searchFilter.name && $props.is_for_dashboard && !customerStore.loading) || !$props.is_for_dashboard">
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
                            <VControl v-if="!$props.is_for_dashboard">
                                <VButton v-permission="Permissions.CUSTOMER_CREATE" class="" to="/customer-add"
                                    color="primary">{{ button_name }}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CustomerSearchFilterModal v-if="!$props.is_for_dashboard" :key="keyIncrement"
            :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger" @search="search_filter"
            @resetFilter="resetFilter_popup" />
    </form>
</template>

<style  scoped lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.bigger-width {
    width: 60% !important;
}

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
