<script lang="ts">
import { defaultServiceSearchFilter, ServiceSearchFilter, ServiceConsts } from "/@src/models/Others/Service/service"
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
        }
    },

    setup(props, context) {
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
            console.log("DASdas", searchFilterPop.value)
        }

        const pagination = props.pagination
        const { y } = useWindowScroll()
        const isStuck = computed(() => {
            return y.value > 150
        })
        const searchFilterPop = ref(false)
        const searchName = ref('')
        const searchPrice = ref()
        const searchDuration = ref()
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultServiceSearchFilter)
        const is_reseted = ref(false)
        const keyTest = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: ServiceSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.duration_minutes = undefined
            searchFilter.value.service_price = undefined
            is_reseted.value = true
            keyTest.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: ServiceSearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.duration_minutes = undefined
            searchFilter.value.service_price = undefined

            console.log(searchFilter)
            context.emit('resetFilter', searchFilter.value)

        }

        return { searchFilterPop, keyTest, search_filter, resetFilter_popup, onOpen, popUpTrigger, isStuck, resetFilter, search, searchName, searchStatus, searchDuration, searchPrice, perPage, pagination, ServiceConsts }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left">
                        <div>
                            <VButton @click.prevent="onOpen" raised> Search
                            </VButton>
                        </div>

                    </div>
                    <div class="right  ">
                        <div class="buttons  ">
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>

                            <VButton to="/service/add" color="primary" raised> {{ button_name }}
                            </VButton>
                        </div>
                        <div>

                            <VField>
                                <VControl>
                                    <div class="select ">
                                        <select @change="search" v-model="perPage">
                                            <option v-if="pagination.per_page * 0.1 == 1"
                                                :value="pagination.per_page * 0.1">{{ pagination.per_page * 0.1 }}
                                                result per page</option>
                                            <option v-else :value="pagination.per_page * 0.1">{{ pagination.per_page *
                                                    0.1
                                            }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 0.5">{{ pagination.per_page * 0.5 }}
                                                results per page</option>
                                            <option :value="pagination.per_page">{{ pagination.per_page }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 2">{{ pagination.per_page * 2 }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 10">{{ pagination.per_page * 10 }}
                                                results per page</option>
                                        </select>
                                    </div>
                                </VControl>
                            </VField>

                        </div>


                    </div>

                </div>
            </div>
        </div>

        <ServiceSearchFilterModel :key="keyTest" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
