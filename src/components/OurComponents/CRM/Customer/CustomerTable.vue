<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultCustomerSearchFilter, CustomerSearchFilter, CustomerConsts, Customer, defaultCustomer } from '/@src/models/CRM/Customer/customer'
import { getCustomersList, resetCustomerSearchFilter } from '/@src/services/CRM/Customer/customerService'
import { defaultPagination } from '/@src/utils/response'
import { useCustomer } from '/@src/stores/CRM/Customer/customerStore'
import { ErrorMessage } from 'vee-validate'
import { defaultChangeStatusUser } from '/@src/models/Others/User/user'
import { UserStatus, defaultUserStatusSearchFilter, UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus'
import { changeUserStatus } from '/@src/services/Others/User/userService'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import sleep from '/@src/utils/sleep'
import NoEditDropDown from '/@src/components/OurComponents/NoEditDropDown.vue'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
import CustomerDropDown from '/@src/components/OurComponents/CRM/Customer/CustomerDropDown.vue'
export interface CustomerTableProps {
    isForDashboard: boolean,
    withTitle: boolean
}
const props = withDefaults(defineProps<CustomerTableProps>(), {
    isForDashboard: false,
    withTitle: false

})

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('customer.table.title'))
useHead({
    title: t('customer.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(resetCustomerSearchFilter())
const customersList = ref<Array<Customer>>([])
const statusesList = ref<Array<UserStatus>>([])
const paginationVar = ref(defaultPagination)
const customerStore = useCustomer()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const changeStatusPopup = ref(false)
const customerChangeStatus = ref<Customer>(defaultCustomer)
const currentChangeStatusUser = ref(defaultChangeStatusUser)

const router = useRouter()

onMounted(async () => {
    const { customers, pagination } = await getCustomersList(searchFilter.value)
    customersList.value = customers
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses

});
const changestatusUser = async () => {
    currentChangeStatusUser.value.id = customerChangeStatus.value.user.id
    currentChangeStatusUser.value.user_status_id = customerChangeStatus.value.user.status.id
    const { message, success } = await changeUserStatus(currentChangeStatusUser.value)
    if (success) {

        search(searchFilter.value)
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);
        notif.error(message)
    }
    changeStatusPopup.value = false
}

const search = async (searchFilter2: CustomerSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

    const { customers, pagination } = await getCustomersList(searchFilter2)

    customersList.value = customers
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: CustomerSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getCustomersPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const customerSort = async (value: string) => {
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

        label: t('customer.table.columns.name'),
        grow: 'lg',
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

        sortable: true,
        searchable: true,

    },
    'users.phone_number': {
        align: 'center',
        grow: true,
        label: t('customer.table.columns.phone'),
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    status: {
        align: 'center',
        label: t('customer.table.columns.status'),
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

    customer_group: {
        align: 'center',

        label: t('customer.table.columns.group'),
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.customer_group?.name === 'normal'
                            ? 'primary'
                            : row?.customer_group?.name === 'vip'
                                ? 'blue'
                                : undefined,
                },
                {
                    default() {
                        return row?.customer_group?.name
                    },
                }
            ),
        searchable: true,


    },
    created_at: {
        align: 'center',

        label: t('customer.table.columns.created_at'),
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true
    },
    actions: {
        align: 'center',
        label: t('customer.table.columns.actions'),
        renderRow: (row: Customer) =>
            h(CustomerDropDown, {
                viewPermission: Permissions.CUSTOMER_SHOW,
                changeStatusPermission: Permissions.CUSTOMER_EDIT,
                addReminderPermission: Permissions.REMINDER_CREATE,
                addTicketPermission: Permissions.TICKET_CREATE,
                isActive: row.user.status.id == UserStatusConsts.ACTIVE,
                onView: () => {
                    router.push({ path: `/customer/${row?.id}` })
                },
                onChangeStatus: () => {
                    customerChangeStatus.value = row
                    changeStatusPopup.value = true
                },
                onAddReminder: () => {
                    router.push({ path: `/reminder/add`, query: { customer_id: row.id } })
                },
                onAddTicket: () => {
                    router.push({ path: `/ticket/add`, query: { customer_id: row.id } })
                }


            }),

    },
} as const
</script>

<template>
    <CustomerTableHeader :with_title="$props.withTitle" :is_for_dashboard="$props.isForDashboard" :key="keyIncrement"
        :title="viewWrapper.pageTitle" :button_name="t('customer.header_button')" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper
        v-if="(searchFilter.name && $props.isForDashboard && !customerStore.loading) || !$props.isForDashboard"
        :columns="columns" :data="customersList" :limit="searchFilter.per_page" @update:sort="customerSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="customerStore?.loading" class="flex-list-inner">
                    <div v-if="!$props.isForDashboard" v-for="key in paginationVar.per_page" :key="key"
                        class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                    <div v-else class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="customersList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(customersList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getCustomersPerPage" />
        <h6 class="pt-2 is-size-7" v-if="customersList.length != 0 && !customerStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>
        <VPlaceloadText v-if="customerStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>
    <VModal :title="t('customer.table.modal_title.status')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{ t('customer.table.columns.status') }}</VLabel>
                                <VControl>
                                    <VSelect v-model="customerChangeStatus.user.status.id">
                                        <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                                            UserStatusConsts.getStatusName(status.id)
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
            <VButton color="primary" raised @click="changestatusUser()">{{ t('modal.buttons.confirm') }}</VButton>
        </template>
    </VModal>
</template>
