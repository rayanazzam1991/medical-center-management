
<script lang="ts">
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { defaultCustomerSearchFilter } from "/@src/models/CRM/Customer/customer"
import { City, CitySearchFilter, defaultCitySearchFilter } from "/@src/models/Others/City/city"
import { CustomerGroup, CustomerGroupSearchFilter, defaultCustomerGroupSearchFilter } from "/@src/models/Others/CustomerGroup/customerGroup"
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getCitiesList } from "/@src/services/Others/City/cityService"
import { getCustomerGroupsList } from "/@src/services/Others/CustomerGroup/customerGroupService"
import { UserSearchFilter } from "/@src/models/Others/User/user"
import { useI18n } from "vue-i18n"

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
        const { t } = useI18n()
        const searchName = ref()
        const searchPhoneNumber = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchCustomerGroup = ref()
        const searchComplete = ref()
        const searchStatus = ref()

        const searchFilter = ref(defaultCustomerSearchFilter)

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })


        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                phone_number: searchPhoneNumber.value,
                user_status_id: searchStatus.value,
                customer_group_id: searchCustomerGroup.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
                is_completed: searchComplete.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false


        }
        const resetFilter = () => {
            searchName.value = undefined
            searchPhoneNumber.value = undefined
            searchPhoneNumber.value = undefined
            searchStatus.value = undefined
            searchCustomerGroup.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchComplete.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.customer_group_id = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.is_completed = undefined

            context.emit('resetFilter', searchFilter.value)
        }

        const citiesList = ref<City[]>([])
        const statusesList = ref<UserStatus[]>([])
        const customerGroupsList = ref<CustomerGroup[]>([])
        onMounted(async () => {
            let citySearchFilter = {} as CitySearchFilter
            citySearchFilter.per_page = 500
            const { cities } = await getCitiesList(citySearchFilter)
            citiesList.value = cities
            let customerGroupFilter = {} as CustomerGroupSearchFilter
            customerGroupFilter.per_page = 500

            const { customerGroups } = await getCustomerGroupsList(customerGroupFilter)
            customerGroupsList.value = customerGroups
            let userStatusFilter = {} as UserStatusSearchFilter
            userStatusFilter.per_page = 500
            const { userstatuses } = await getUserStatusesList(userStatusFilter)
            statusesList.value = userstatuses

        })


        return { t, search, resetFilter, customerGroupsList, citiesList, search_filter_popup, statusesList, searchName, searchPhoneNumber, searchStatus, searchDateBetween, searchFrom, searchTo, searchCustomerGroup, searchComplete }




    },


})




</script>

<template>
    <VModal :title="t('customer.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input "
                            :placeholder="t('customer.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:phone">
                        <input v-model="searchPhoneNumber" type="text" class="input "
                            :placeholder="t('customer.search_filter.phone_number')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{ t('customer.search_filter.status') }}</VOption>
                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                                status.name
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchCustomerGroup" class="">
                            <VOption value="">{{ t('customer.search_filter.group') }}</VOption>
                            <VOption v-for="customerGroup in customerGroupsList" :key="customerGroup.id"
                                :value="customerGroup.id">{{ customerGroup.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{ t('customer.search_filter.create_date') }}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('customer.search_filter.from') }} </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('customer.search_filter.to') }}</VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>
                </div>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>



    </VModal>
</template>

   