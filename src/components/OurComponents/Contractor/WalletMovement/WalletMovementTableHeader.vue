<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultWalletMovementSearchFilter, WalletMovementSearchFilter } from "/@src/models/Contractor/walletMovement"
import { defaultPagination } from "/@src/utils/response"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
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
        }

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
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultWalletMovementSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const quickSearchField = ref('')
        const quickSearch = () => {
            if (quickSearchField.value != '') {
                searchFilter.value.contractor_name = quickSearchField.value
            }
            searchFilter.value.per_page = perPage.value

            search()
        }

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1

            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: WalletMovementSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.contractor_name = undefined
            searchFilter.value.created_by = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            searchFilter.value.action = 'cash_out'
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: WalletMovementSearchFilter) => {
            searchFilter.value.contractor_name = undefined
            searchFilter.value.created_by = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, keyIncrement, Permissions, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, perPage, pagination, quickSearch, quickSearchField }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="quickSearchField" type="text"
                                    :placeholder="t('walletMovement.search_filter.contractor_name')" />
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
                            <VControl class="mr-2 ">
                                <VButton v-permission="Permissions.WALLET_EDIT" class="" to="/contractor/cash-out/add"
                                    color="primary">{{ button_name }}
                                </VButton>
                            </VControl>
                            <VControl>
                                <VButton v-permission="Permissions.WALLET_EDIT" class="mr-l" to="/bulk-cash-out"
                                    color="primary">{{ t('modal.buttons.bulk_cash_out') }}
                                </VButton>
                            </VControl>
                        </div>

                    </div>

                </div>
            </div>
        </div>
        <WalletMovementSearchFilterModel :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped lang="scss">@import '/@src/scss/styles/tableHeader.scss';</style>
