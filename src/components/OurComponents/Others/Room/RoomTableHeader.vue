<script lang="ts">
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { Department, defaultDepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { defaultRoomSearchFilter, RoomSearchFilter, RoomConsts } from "/@src/models/Others/Room/room"
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
            return y.value > 30
        })
        const searchFilterPop = ref(false)
        const searchNumber = ref()
        const searchFloor = ref()
        const searchDepartment = ref()
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultRoomSearchFilter)
        const is_reseted = ref(false)
        const keyTest = ref(0)

        const search = () => {

            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: RoomSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.number = undefined
            searchFilter.value.floor = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.status = undefined
            is_reseted.value = true
            keyTest.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: RoomSearchFilter) => {
            searchFilter.value.number = undefined
            searchFilter.value.floor = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.status = undefined
            console.log(searchFilter)
            context.emit('resetFilter', searchFilter.value)

        }
        const departments2 = ref<Department[]>([])
        onMounted(async () => {
            const { departments } = await getDepartmentsList(defaultDepartmentSearchFilter)
            departments2.value = departments
            console.log(departments2.value)
        })
        return { keyTest, searchFilterPop, popUpTrigger, onOpen, resetFilter_popup, search_filter, isStuck, departments2, resetFilter, search, searchNumber, searchFloor, searchDepartment, searchStatus, perPage, pagination, RoomConsts }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left">
                        <VButton @click.prevent="onOpen" raised> Search
                        </VButton>
                    </div>
                    <div class="right  ">
                        <div class="buttons  ">
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>
                            <VButton to="/room/add" color="primary" raised> {{ button_name }}
                            </VButton>
                        </div>
                        <div>
                            <VField>
                                <VControl>
                                    <div class="select">
                                        <select @change="search" v-model="perPage">
                                            <option v-if="pagination.per_page * 0.1 == 1"
                                                :value="pagination.per_page * 0.1">{{
                                                        pagination.per_page * 0.1
                                                }}
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
        <RoomSearchFilterModel :key="keyTest" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
            @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
