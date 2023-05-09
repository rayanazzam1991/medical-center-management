<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { resetEmployeesAvailabilityHistorySearchFilter } from "/@src/services/Employee/employeeAvailabilityHistoryService"
import { UserStatusConsts } from "/@src/models/Others/UserStatus/userStatus"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { getEmployeesList } from "/@src/services/Employee/employeeService"
import { EmployeeAvailabilityHistorySearchFilter } from "/@src/models/Employee/employeeAvailabilityHistory"

export default defineComponent({
    props: {
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        is_for_employee: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, context) {
        const { t } = useI18n()
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const searchFilterPop = ref(false)
        const keyIncrement = ref(0)
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchEmployeesId = ref<number[] | undefined>(undefined)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(resetEmployeesAvailabilityHistorySearchFilter())
        const search = () => {
            searchFilter.value = {
                employees_id: searchEmployeesId.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }
        const resetFilter = () => {
            searchEmployeesId.value = undefined
            searchFilter.value.employees_id = undefined
            searchFilter.value.is_available = undefined
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const search_filter = (value: EmployeeAvailabilityHistorySearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const resetFilter_popup = (value: EmployeeAvailabilityHistorySearchFilter) => {
            searchFilter.value.employees_id = undefined
            searchFilter.value.is_available = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        return { t, Permissions, resetFilter, popUpTrigger, resetFilter_popup, search_filter, searchFilterPop, search, default_per_page, searchEmployeesId, onOpen, keyIncrement, perPage, pagination, UserStatusConsts, getEmployeesList }
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
                            <VControl v-if="!$props.is_for_employee" class="mr-2 width">
                                <Multiselect :key="keyIncrement" v-model="searchEmployeesId" mode="multiple"
                                    :placeholder="t('employee_availability_history.search_filter.provider')"
                                    :can-clear="true" :close-on-select="false" :filter-results="false" :min-chars="0"
                                    :resolve-on-load="false" :infinite="true" :rtl="true" :clear-on-search="true" :delay="0"
                                    :searchable="true" :hide-selected="false" :limit="20" :options="async (query: any) => {
                                        let employeeSearchFilter = {
                                            per_page: 100,
                                            name: query,
                                        } as EmployeeSearchFilter
                                        // @ts-ignore
                                        const data = await getEmployeesList(employeeSearchFilter)
                                        // @ts-ignore
                                        return data.employees.map((employee: Employee) => {
                                            return { value: employee.id, label: employee.user.first_name + ' ' + employee.user.last_name }
                                        })
                                    }"
                                    @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
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
        <EmployeeAvailabilityHistorySearchFilterModal :is_for_employee="$props.is_for_employee" :key="keyIncrement"
            :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger" @search="search_filter"
            @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;
}

.width {
    width: 230px;
}
</style>
