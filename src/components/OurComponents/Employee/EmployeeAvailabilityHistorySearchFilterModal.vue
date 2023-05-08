<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultTicketSearchFilter, TicketConsts } from "/@src/models/Sales/Ticket/ticket"
import { resetEmployeesAvailabilityHistorySearchFilter } from "/@src/services/Employee/employeeAvailabilityHistoryService"
import { UserStatusConsts } from "/@src/models/Others/UserStatus/userStatus"
import { getEmployeesList } from "/@src/services/Employee/employeeService"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"


export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },
        is_for_employee: {
            type: Boolean,
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchEmployeesId = ref<number[] | undefined>(undefined)
        const searchIsAvailable = ref()
        const searchFilter = ref(resetEmployeesAvailabilityHistorySearchFilter())
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
                employees_id: searchEmployeesId.value,
                is_available: searchIsAvailable.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchEmployeesId.value = undefined
            searchIsAvailable.value = undefined
            searchFilter.value.employees_id = undefined
            searchFilter.value.is_available = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return { t, TicketConsts, search, resetFilter, search_filter_popup, searchEmployeesId, searchIsAvailable, UserStatusConsts, getEmployeesList }
    },
})
</script>

<template>
    <VModal :title="t('employee_availability_history.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField v-if="!$props.is_for_employee" class="column filter">
                    <VControl>
                        <Multiselect v-model="searchEmployeesId" mode="multiple"
                            :placeholder="t('employee_availability_history.search_filter.provider')" :can-clear="true"
                            :close-on-select="false" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :rtl="true" :clear-on-search="true" :delay="0" :searchable="true"
                            :hide-selected="false" :limit="20" :options="async (query: any) => {
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
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VRadio v-model="searchIsAvailable" :value="true" class="pr-0"
                            :label="t('employee_availability_history.search_filter.is_available')" name="is_available"
                            color="success" />

                        <VRadio v-model="searchIsAvailable" :value="false"
                            :label="t('employee_availability_history.search_filter.is_not_available')" name="is_available"
                            color="danger" />
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
    </VModal>
</template>

