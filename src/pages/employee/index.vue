<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { getEmployeesList } from '/@src/services/Employee/employeeService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultEmployee, defaultEmployeeSearchFilter, Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { ErrorMessage } from 'vee-validate'
import { UserStatus, defaultUserStatusSearchFilter, UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { changeUserStatus } from '/@src/services/Others/User/userService'
import { defaultChangeStatusUser } from '/@src/models/Others/User/user'
import sleep from '/@src/utils/sleep'
import NoEditDropDown from '/@src/components/OurComponents/NoEditDropDown.vue'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('employee.table.title'))
useHead({
    title: t('employee.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultEmployeeSearchFilter)
const employeesList = ref<Array<Employee>>([])
const statusesList = ref<Array<UserStatus>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeStore = useEmployee()
const default_per_page = ref(1)
const keyIncrement = ref(0)
const changeStatusPopup = ref(false)
const emplyeeChangeStatus = ref<Employee>(defaultEmployee)
const currentChangeStatusUser = ref(defaultChangeStatusUser)

onMounted(async () => {
    const { employees, pagination } = await getEmployeesList(searchFilter.value)
    employeesList.value = employees
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses

});
const changestatusUser = async () => {
    currentChangeStatusUser.value.id = emplyeeChangeStatus.value.user.id
    currentChangeStatusUser.value.user_status_id = emplyeeChangeStatus.value.user.status.id
    const { message, success } = await changeUserStatus(currentChangeStatusUser.value)
    if (success) {

        search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);
        // @ts-ignore
        notif.error(message)
    }
    changeStatusPopup.value = false
}


const search = async (searchFilter2: EmployeeSearchFilter) => {

    const { employees, pagination } = await getEmployeesList(searchFilter2)

    employeesList.value = employees
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: EmployeeSearchFilter) => {
    searchFilter.value = searchFilter2
    search(searchFilter.value)
}

const getEmployeesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const employeeSort = async (value: string) => {
    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value)

}


const columns = {
    "users.name": {
        align: 'center',

        label: t('employee.table.columns.name'),
        grow: 'lg',
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

        sortable: true,
        searchable: true,

    },
    "users.phone_number": {
        align: 'center',
        grow: true,
        label: t('employee.table.columns.phone'),
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    department: {
        align: 'center',
        grow: true,
        label: t('employee.table.columns.department'),
        renderRow: (row: any) =>
            h('span', row?.user?.room?.department?.name),

        searchable: true,


    },
    room: {
        align: 'center',
        label: t('employee.table.columns.room'),
        renderRow: (row: any) =>
            h('span', row?.user?.room?.number),

        searchable: true,


    },
    status: {
        align: 'center',
        grow: true,

        label: t('employee.table.columns.status'),
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color: UserStatusConsts.getStatusColor(row?.user?.status?.id)
                },
                {
                    default() {
                        return UserStatusConsts.getStatusName(row?.user?.status?.id)
                    },
                }
            ),
        searchable: true,


    },
    position: {
        align: 'center',
        grow: true,
        label: t('employee.table.columns.position'),
        renderRow: (row: any) =>
            h('span', row?.position.name),

        searchable: true,


    },
    created_at: {
        align: 'center',

        label: t('employee.table.columns.created_at'),
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
        grow: true

    },
    actions: {
        align: 'center',
        label: t('employee.table.columns.actions'),

        renderRow: (row: any) =>
            h(NoEditDropDown, {
                onView: () => {
                    router.push({ path: `/employee/${row?.id}` })
                },
                onChangeStatus: () => {
                    emplyeeChangeStatus.value = row
                    changeStatusPopup.value = true
                }
            }),

    },
} as const
</script>

<template>
    <EmployeeTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="t('employee.header_button')" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="employeesList" :limit="searchFilter.per_page"
        @update:sort="employeeSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="employeeStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="employeesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" 
                    :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(employeesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getEmployeesPerPage" />
        <h6 class="pt-2 is-size-7" v-if="employeesList.length != 0 && !employeeStore?.loading">
            {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>

        <VPlaceloadText v-if="employeeStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal :title="t('employee.table.modal_title.status')" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{ t('employee.table.columns.status') }}</VLabel>
                                <VControl>
                                    <VSelect v-model="emplyeeChangeStatus.user.status.id">
                                        <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
        status.name
}}
                                        </VOption>
                                    </VSelect>
                                    <ErrorMessage name="user_status_id" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusUser()">{{t('modal.buttons.confirm')}}</VButton>
        </template>
    </VModal>

</template>
