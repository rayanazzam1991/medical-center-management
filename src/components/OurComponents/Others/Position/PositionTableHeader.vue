<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultPositionSearchFilter, PositionConsts } from "/@src/models/Others/Position/position"
import { defaultPagination } from "/@src/utils/response"


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
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultPositionSearchFilter)
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                status: searchStatus.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchName.value = ''
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return {  t, resetFilter, search, default_per_page, searchName, searchStatus, perPage, pagination, PositionConsts }
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
                                <VInput v-model="searchName" type="text" :placeholder="t('position.search_filter.name')" />
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchStatus">
                                    <VOption value="">{{t('position.search_filter.status')}}</VOption>
                                    <VOption value="0">{{ PositionConsts.showStatusName(0) }}</VOption>
                                    <VOption value="1">{{ PositionConsts.showStatusName(1) }}</VOption>
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
                                <VButton class="" to="/position/add" color="primary">{{ button_name }}
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
