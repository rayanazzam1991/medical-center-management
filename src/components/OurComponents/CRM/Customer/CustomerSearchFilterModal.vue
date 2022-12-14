
<script lang="ts">
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { defaultCustomerSearchFilter } from "/@src/models/CRM/Customer/customer"
import { City, defaultCitySearchFilter } from "/@src/models/Others/City/city"
import { CustomerGroup, defaultCustomerGroupSearchFilter } from "/@src/models/Others/CustomerGroup/customerGroup"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getCitiesList } from "/@src/services/Others/City/cityService"
import { getCustomerGroupsList } from "/@src/services/Others/CustomerGroup/customerGroupService"

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
        const searchName = ref()
        const searchGender = ref()
        const searchPhoneNumber = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchCustomerGroup = ref()
        const searchComplete = ref()
        const searchCity = ref()
        const searchStatus = ref()

        const searchFilter = ref(defaultCustomerSearchFilter)
        const test = ref()

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
                console.log(value)

            },
        })


        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                gender: searchGender.value,
                phone_number: searchPhoneNumber.value,
                city_id: searchCity.value,
                user_status_id: searchStatus.value,
                customer_group_id: searchCustomerGroup.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
                is_completed: searchComplete.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
            console.log(searchFilter.value)


        }
        const resetFilter = () => {
            searchName.value = undefined
            searchGender.value = undefined
            searchPhoneNumber.value = undefined
            searchPhoneNumber.value = undefined
            searchCity.value = undefined
            searchStatus.value = undefined
            searchCustomerGroup.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchComplete.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.city_id = undefined
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
            const { cities } = await getCitiesList(defaultCitySearchFilter)
            citiesList.value = cities
            const { customerGroups } = await getCustomerGroupsList(defaultCustomerGroupSearchFilter)
            customerGroupsList.value = customerGroups
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses

        })


        return { search, resetFilter, customerGroupsList, citiesList, search_filter_popup, statusesList, searchName, searchGender, searchPhoneNumber, searchCity, searchStatus, searchDateBetween, searchFrom, searchTo, searchCustomerGroup, searchComplete }




    },


})




</script>

<template>
    <VModal title="Search Customer" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input is-rounded" placeholder="Name..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:phone">
                        <input v-model="searchPhoneNumber" type="text" class="input is-rounded"
                            placeholder="Phone Number..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchGender" class="is-rounded">
                            <VOption value="">Gender</VOption>
                            <VOption value="Male">Male</VOption>
                            <VOption value="Female">Female</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchCity" class="is-rounded">
                            <VOption value="">City</VOption>
                            <VOption v-for="city in citiesList" :key="city.id" :value="city.id">{{ city.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchCustomerGroup" class="is-rounded">
                            <VOption value="">Group</VOption>
                            <VOption v-for="customerGroup in customerGroupsList" :key="customerGroup.id"
                                :value="customerGroup.id">{{ customerGroup.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="is-rounded">
                            <VOption value="">Status</VOption>
                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                                    status.name
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">Create Date:</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>From : </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>To : </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>

                </div>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchComplete" class="is-rounded">
                            <VOption value="">Completed</VOption>
                            <VOption value="1">Yes</VOption>
                            <VOption value="0">No</VOption>
                        </VSelect>
                    </VControl>
                </VField>

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="feather:search" color="primary" raised @click="search">Search</VButton>
        </template>



    </VModal>
</template>

   