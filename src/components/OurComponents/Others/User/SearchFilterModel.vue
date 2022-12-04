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
        const searchFirstName = ref()
        const searchLastName = ref()
        const searchGender = ref()
        const searchPhoneNumber = ref()
        const searchRoom = ref()
        const searchCity = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultUserSearchFilter)
        const test = ref()

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
                console.log(value)

            },
        })

        console.log("fcsd", search_filter_popup.value)


        const search = () => {
            searchFilter.value = {
                first_name: searchFirstName.value,
                last_name: searchLastName.value,
                gender: searchGender.value,
                phone_number: searchPhoneNumber.value,
                room_id: searchRoom.value,
                city_id: searchCity.value,
                user_status_id: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
            console.log(searchFilter.value)


        }
        const resetFilter = () => {
            searchFirstName.value = undefined
            searchLastName.value = undefined
            searchGender.value = undefined
            searchPhoneNumber.value = undefined
            searchRoom.value = undefined
            searchCity.value = undefined
            searchStatus.value = undefined
            searchFilter.value.first_name = undefined
            searchFilter.value.last_name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.city_id = undefined
            searchFilter.value.user_status_id = undefined

            context.emit('resetFilter', searchFilter.value)
        }
        const rooms2 = ref<Room[]>([])
        const cities2 = ref<City[]>([])
        const statuses2 = ref<UserStatus[]>([])
        onMounted(async () => {
            console.log('testt')
            const { rooms } = await getRoomsList(defaultRoomSearchFilter)
            rooms2.value = rooms
            const { cities } = await getCitiesList(defaultCitySearchFilter)
            cities2.value = cities
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statuses2.value = userstatuses
        })


        return { search, resetFilter, rooms2, cities2, search_filter_popup, statuses2, searchFirstName, searchLastName, searchRoom, searchCity, searchStatus, searchGender, searchPhoneNumber }




    },


})




</script>

<template>
    <VModal title="Search User" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchFirstName" type="text" class="input is-rounded"
                            placeholder="first_name..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchLastName" type="text" class="input is-rounded"
                            placeholder="last_name..." />
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
                        <VSelect v-model="searchRoom" class="is-rounded">
                            <VOption value="">Room</VOption>
                            <VOption v-for="room in rooms2" :key="room.id" :value="room.id">{{ room.number
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchCity" class="is-rounded">
                            <VOption value="">City</VOption>
                            <VOption v-for="city in cities2" :key="city.id" :value="city.id">{{ city.name }}
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
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="search">Ok..</VButton>
        </template>



        <VField class="column filter">
            <VControl icon="feather:search">
                <input v-model="searchPhoneNumber" type="text" class="input is-rounded" placeholder="phone_number..." />
            </VControl>
        </VField>
    </VModal>
</template>

   