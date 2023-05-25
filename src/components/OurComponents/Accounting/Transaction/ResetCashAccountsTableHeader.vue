<script lang="ts">
import { useI18n } from "vue-i18n"
import { ClientsCashReceiptsSearchFilter, ResetCashAccountsListSearchFilter, defaultClientsCashReceiptsSearchFilter, defaultResetCashAccountsListSearchFilter } from "/@src/models/Accounting/Transaction/record"
import { defaultPagination } from "/@src/utils/response"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { Account } from "/@src/models/Accounting/Account/account"

export default defineComponent({
    props: {
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        cashAccounts: {
            default: [] as Account[]
        },
        with_title: {
            type: Boolean,
            default: false,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const router = useRouter()
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const searchFilterPop = ref(false)
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultResetCashAccountsListSearchFilter)
        const search = () => {
            searchFilter.value = {
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }
        const resetFilter = () => {
            searchFilter.value.cashier_name = undefined
            searchFilter.value.date_from = undefined
            searchFilter.value.date_to = undefined
            searchFilter.value.target_cash_account_id = undefined
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)
        }
        const search_filter = (value: ResetCashAccountsListSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter_popup = (value: ResetCashAccountsListSearchFilter) => {
            searchFilter.value.cashier_name = undefined
            searchFilter.value.date_from = undefined
            searchFilter.value.date_to = undefined
            searchFilter.value.target_cash_account_id = undefined

            context.emit('resetFilter', searchFilter.value)
        }
        return { t, resetFilter, search, default_per_page, Permissions, perPage, pagination, keyIncrement, searchFilterPop, popUpTrigger, onOpen, search_filter, resetFilter_popup }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 v-if="$props.with_title" class="title">
                    {{ t('reset_cash_accounts.table.title') }}
                </h1>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
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
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page *
                                            0.1
                                        }}
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
        <ResetCashAccountsSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            :cashAccounts="$props.cashAccounts" @search_filter_popup="popUpTrigger" @search="search_filter"
            @resetFilter="resetFilter_popup" />

    </form>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
