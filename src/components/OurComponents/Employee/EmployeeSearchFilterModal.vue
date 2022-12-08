<script lang="ts">
import { UserSearchFilter } from '/@src/utils/api/Others/User'
import { defaultUserSearchFilter } from '/@src/stores/Others/User/userStore'
import { defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
import { defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore'
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'

import { City } from '/@src/utils/api/Others/City'
import { Room } from '/@src/utils/api/Others/Room'
import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore'
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList'
import { defaultUserStatusSearchFilter } from '/@src/stores/Others/UserStatus/userStatusStore'
import { boolean } from 'zod'
import { defaultEmployeeSearchFilter } from '/@src/stores/Employee/employeeStore'
import { Nationality } from '/@src/utils/api/Others/Nationality'
import { getNationalitiesList } from '/@src/composable/Others/Nationality/getNationalitiesList'
import { defaultNationalitySearchFilter } from '/@src/stores/Others/Nationality/nationalityStore'

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
        const searchNationality = ref()
        const searchStatus = ref()

        const searchFilter = ref(defaultEmployeeSearchFilter)
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
                user_status_id: searchStatus.value,
                nationality_id: searchNationality.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
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
            searchStatus.value = undefined
            searchNationality.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.nationality_id = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined

            context.emit('resetFilter', searchFilter.value)
        }

        const cities2 = ref<City[]>([])
        const statuses2 = ref<UserStatus[]>([])
        const nationalities2 = ref<Nationality[]>([])
        onMounted(async () => {
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statuses2.value = userstatuses
            const { nationalities } = await getNationalitiesList(defaultNationalitySearchFilter)
            nationalities2.value = nationalities
        })


        return { search, resetFilter, nationalities2, search_filter_popup, statuses2, searchName, searchGender, searchPhoneNumber, searchStatus, searchDateBetween, searchFrom, searchTo, searchNationality }




    },


})




</script>

<template>
    <VModal title="Search Employee" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
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
                            placeholder="phone_number..." />
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
                        <VSelect v-model="searchNationality" class="is-rounded">
                            <VOption value="">Nationality</VOption>
                            <VOption v-for="nationality in nationalities2" :key="nationality.id"
                                :value="nationality.id">{{ nationality.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="is-rounded">
                            <VOption value="">Status</VOption>
                            <VOption v-for="status in statuses2" :key="status.id" :value="status.id">{{
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
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="feather:search" color="primary" raised @click="search">Search</VButton>
        </template>



        <VField class="column filter">
            <VControl icon="feather:search">
                <input v-model="searchPhoneNumber" type="text" class="input is-rounded" placeholder="phone_number..." />
            </VControl>
        </VField>
    </VModal>
</template>

   