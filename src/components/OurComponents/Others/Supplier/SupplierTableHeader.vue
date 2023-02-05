<script lang="ts">
import { defaultSupplierSearchFilter ,SupplierConsts} from "/@src/models/Others/Supplier/supplier"
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"

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
        const {t} = useI18n()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchName = ref('')
        const searchPhoneNumber = ref('')
        const searchStatus = ref()
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultSupplierSearchFilter)
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                status: searchStatus.value,
                phone_number:searchPhoneNumber.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }
        const resetFilter = () => {
            searchName.value = ''
            searchPhoneNumber.value = ''
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.status = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return {t , resetFilter, search, default_per_page, searchName, searchStatus,searchPhoneNumber, perPage, pagination, SupplierConsts }
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
                                <VInput v-model="searchName" type="text" :placeholder="t('supplier.search_filter.name')" />
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchStatus">
                                    <VOption value="">{{t('supplier.search_filter.status')}}</VOption>
                                    <VOption value="0">{{ SupplierConsts.getSupplierStatusName(0) }}</VOption>
                                    <VOption value="1">{{ SupplierConsts.getSupplierStatusName(1) }}</VOption>
                                    <VOption value="2">{{ SupplierConsts.getSupplierStatusName(2) }}</VOption>
                                </VSelect>
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" type="submit" v-on:click="resetFilter" icon="feather:rotate-ccw"
                                :raised="false" color="danger" />
                               
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
                            <VControl>
                                <VButton class="" to="/supplier/add" color="primary">{{ button_name }}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>

