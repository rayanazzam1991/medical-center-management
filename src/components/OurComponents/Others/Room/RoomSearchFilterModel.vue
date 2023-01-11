<script lang="ts">
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { Department, defaultDepartmentSearchFilter, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { defaultRoomSearchFilter, RoomConsts } from "/@src/models/Others/Room/room"
import { BaseConsts } from "/@src/utils/consts/base"


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
        search_filter_popup: {
            default: false,
        },
        is_reseted: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const searchNumber = ref()
        const searchFloor = ref()
        const searchDepartment = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultRoomSearchFilter)
        const test = ref()
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
                number: searchNumber.value,
                floor: searchFloor.value,
                department_id: searchDepartment.value,
                status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchNumber.value = undefined
            searchFloor.value = undefined
            searchDepartment.value = undefined
            searchStatus.value = undefined
            searchFilter.value.number = undefined
            searchFilter.value.floor = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.status = undefined

            context.emit('resetFilter', searchFilter.value)
        }
        const departments2 = ref<Department[]>([])
        onMounted(async () => {
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.per_page = 500
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departments2.value = departments
        })
        return { RoomConsts, search, resetFilter, departments2, search_filter_popup, searchNumber, searchFloor, searchDepartment, searchStatus }
    },
})
</script>

<template>
    <VModal title="Search Room" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchNumber" type="text" class="input " placeholder="Number..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchFloor" type="text" class="input " placeholder="Floor..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchDepartment" class="">
                            <VOption value="">Department</VOption>
                            <VOption v-for="department in departments2" :key="department.id" :value="department.id">{{
                                    department.name
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">Status</VOption>
                            <VOption value="0">{{ RoomConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ RoomConsts.showStatusName(1) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">Filter</VButton>
        </template>
    </VModal>
</template>

   