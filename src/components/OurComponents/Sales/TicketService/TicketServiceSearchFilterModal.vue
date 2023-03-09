<script lang="ts">
import { useI18n } from 'vue-i18n'
import { Customer, CustomerSearchFilter } from '/@src/models/CRM/Customer/customer'
import { Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { defaultEmployeeVariablePaymentSearchFilter, EmployeeVariablePaymentConsts } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment'
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'
import { Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { Room, RoomSearchFilter } from '/@src/models/Others/Room/room'
import { Service, ServiceSearchFilter } from '/@src/models/Others/Service/service'
import { defaultTicketServiceSearchFilter, TicketServiceConsts } from '/@src/models/Sales/TicketService/ticketService'
import { getCustomersList } from '/@src/services/CRM/Customer/customerService'
import { getEmployeesList } from '/@src/services/Employee/employeeService'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { getServicesList } from '/@src/services/Others/Service/serviceService'

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchCustomerId = ref()
        const searchProviderId = ref()
        const searchServiceId = ref()
        const searchStatus = ref()
        const searchCreateAtFrom = ref()
        const searchCreateAtTo = ref()
        const searchRoomId = ref()
        const searchDepartmentId = ref()
        const searchFilter = ref(defaultTicketServiceSearchFilter)
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })
        const search = () => {
            searchFilter.value = {
                customer_id: searchCustomerId.value,
                provider_id: searchProviderId.value,
                service_id: searchServiceId.value,
                status: searchStatus.value,
                room_id: searchRoomId.value,
                department_id: searchDepartmentId.value,
                created_at_from: searchCreateAtFrom.value,
                created_at_to: searchCreateAtTo.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchCustomerId.value = undefined
            searchProviderId.value = undefined
            searchServiceId.value = undefined
            searchStatus.value = undefined
            searchCreateAtFrom.value = undefined
            searchCreateAtTo.value = undefined
            searchRoomId.value = undefined
            searchDepartmentId.value = undefined

            searchFilter.value.customer_id = undefined
            searchFilter.value.provider_id = undefined
            searchFilter.value.service_id = undefined
            searchFilter.value.status = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.created_at_from = undefined
            searchFilter.value.created_at_to = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        // const customersList = ref<Customer[]>([])
        // const roomsList = ref<Room[]>([])
        // const departmentsList = ref<Department[]>([])
        // const employeesList = ref<Employee[]>([])
        // onMounted(async () => {
        //     let customerSearchFilter = {} as CustomerSearchFilter
        //     const { customers } = await getCustomersList(customerSearchFilter)
        //     customersList.value = customers

        //     let roomSearchFilter = {} as RoomSearchFilter
        //     const { rooms } = await getRoomsList(roomSearchFilter)
        //     roomsList.value = rooms

        //     let departmentSearchFilter = {} as DepartmentSearchFilter
        //     const { departments } = await getDepartmentsList(departmentSearchFilter)
        //     departmentsList.value = departments

        //     let employeeSearchFilter = {} as EmployeeSearchFilter
        //     const { employees } = await getEmployeesList(employeeSearchFilter)
        //     employeesList.value = employees

        // })

        return {
            t, search, resetFilter, search_filter_popup, searchCustomerId, searchProviderId, searchServiceId, searchStatus, searchCreateAtFrom,
            searchDepartmentId, searchCreateAtTo, searchRoomId, TicketServiceConsts, getCustomersList, getDepartmentsList, getRoomsList, getEmployeesList, getServicesList
        }
    },
})
</script>

<template>
    <VModal :title="t('requested_services.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl>
                        <Multiselect v-model="searchCustomerId" mode="single"
                            :placeholder="t('requested_services.search_filter.customer')" :close-on-select="true"
                            ref="customer_id" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :limit="50" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                            :searchable="true" :canClear="false" :options="async (query: any) => {
                                let customerSearchFilter = {
                                    name: query,
                                } as CustomerSearchFilter
                                // @ts-ignore
                                const data = await getCustomersList(customerSearchFilter)
                                // @ts-ignore
                                return data.customers.map((customer: Customer) => {
                                    return { value: customer.id, label: customer.user.first_name + ' ' + customer.user.last_name }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="">
                        <Multiselect v-model="searchDepartmentId" mode="single"
                            :placeholder="t('requested_services.search_filter.department')" :close-on-select="true"
                            ref="department_id" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :limit="50" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                            :searchable="true" :canClear="false" :options="async (query: any) => {
                                let departmentSearchFilter = {
                                    name: query,
                                } as DepartmentSearchFilter
                                // @ts-ignore
                                const data = await getDepartmentsList(departmentSearchFilter)
                                // @ts-ignore
                                return data.departments.map((department: Department) => {
                                    return { value: department.id, label: department.name }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="">
                        <Multiselect v-model="searchRoomId" mode="single"
                            :placeholder="t('requested_services.search_filter.room')" :close-on-select="true" ref="room_id"
                            :filter-results="false" :min-chars="0" :resolve-on-load="false" :infinite="true" :limit="50"
                            :rtl="true" :max="1" :clear-on-search="true" :delay="0" :searchable="true" :canClear="false"
                            :options="async (query: any) => {
                                let roomSeearchFilter = {
                                    number: query,
                                } as RoomSearchFilter
                                //@ts-ignore
                                const data = await getRoomsList(roomSeearchFilter)
                                //@ts-ignore
                                return data.rooms.map((room: Room) => {
                                    return { value: room.id, label: `#${room.number} - ${room.department?.name}` }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="">
                        <Multiselect v-model="searchProviderId" mode="single"
                            :placeholder="t('requested_services.search_filter.provider')" :close-on-select="true"
                            ref="provider_id" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :limit="50" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                            :searchable="true" :canClear="false" :options="async (query: any) => {
                                let employeeSearchFilter = {
                                    name: query,
                                } as EmployeeSearchFilter
                                //@ts-ignore
                                const data = await getEmployeesList(employeeSearchFilter)
                                //@ts-ignore
                                return data.employees.map((employee: Employee) => {
                                    return { value: employee.id, label: employee.user.first_name + ' ' + employee.user.last_name }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="">
                        <Multiselect v-model="searchServiceId" mode="single"
                            :placeholder="t('requested_services.search_filter.service')" :close-on-select="true"
                            ref="service_id" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :limit="50" :rtl="true" :max="1" :clear-on-search="true" :delay="0"
                            :searchable="true" :canClear="false" :options="async (query: any) => {
                                let serviceSearchFilter = {
                                    name: query,
                                } as ServiceSearchFilter
                                //@ts-ignore
                                const data = await getServicesList(serviceSearchFilter)
                                //@ts-ignore
                                return data.services.map((service: Service) => {
                                    return { value: service.id, label: service.name }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{ t('requested_services.search_filter.status') }}</VOption>
                            <VOption :value="TicketServiceConsts.NOT_SERVED">{{
                                TicketServiceConsts.getStatusName(TicketServiceConsts.NOT_SERVED) }}
                            </VOption>
                            <VOption :value="TicketServiceConsts.SERVED">{{
                                TicketServiceConsts.getStatusName(TicketServiceConsts.SERVED) }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{ t('requested_services.search_filter.created_at') }}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('requested_services.search_filter.from') }} </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchCreateAtFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('requested_services.search_filter.to') }} </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchCreateAtTo" type="date" />
                        </VControl>
                    </VField>
                </div>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}
            </VButton>
        </template>
    </VModal>
</template>

