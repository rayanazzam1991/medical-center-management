<script lang="ts">
import { boolean } from 'zod'
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { City, defaultCitySearchFilter } from '/@src/models/Others/City/city'
import { Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room'
import { defaultUserSearchFilter } from '/@src/models/Others/User/user'
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { getCitiesList } from '/@src/services/Others/City/cityService'

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
                name: searchName.value,
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
            searchName.value = undefined
            searchGender.value = undefined
            searchPhoneNumber.value = undefined
            searchRoom.value = undefined
            searchCity.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
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


        return { search, resetFilter, rooms2, cities2, search_filter_popup, statuses2, searchName, searchRoom, searchCity, searchStatus, searchGender, searchPhoneNumber }




    },


})




</script>

<template>
    <VModal title="Search User" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input is-rounded" placeholder="name..." />
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
    </VModal>
</template>

   