<script lang="ts">
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { Department, defaultDepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { defaultRoomSearchFilter, RoomSearchFilter, RoomConsts } from "/@src/models/Others/Room/room"
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
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const default_per_page = props.default_per_page
        const pagination = props.pagination
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
            searchFilter.value.page = 1

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
            context.emit('resetFilter', searchFilter.value)

        }
        const departments2 = ref<Department[]>([])
        onMounted(async () => {
            const { departments } = await getDepartmentsList(defaultDepartmentSearchFilter)
            departments2.value = departments
        })
        return { keyTest, Permissions, searchFilterPop, default_per_page, popUpTrigger, onOpen, resetFilter_popup, search_filter, departments2, resetFilter, search, searchNumber, searchFloor, searchDepartment, searchStatus, perPage, pagination, RoomConsts }
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
                            <VControl>
                                <VButton v-permission="Permissions.ROOM_CREATE" class="" to="/room/add" color="primary">{{
                                    button_name }}
                                </VButton>
                            </VControl>
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
