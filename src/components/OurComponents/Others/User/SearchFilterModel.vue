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

    },
    emits: ['update:search_filter_popup'],
    setup(props, context) {
        // const onOpen = (searchFilterPop: boolean) => {
        //     searchUserPopup.value = searchFilterPop
        // }

        // const searchUserPopup = ref()
        const searchFirstName = ref()
        const searchLastName = ref()
        const searchGender = ref()
        const searchPhoneNumber = ref()
        const searchRoom = ref()
        const searchCity = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultUserSearchFilter)

        const search_filter_popup = computed({
            get: () => props.search_filter_popup,
            set(value) {
                value = props.search_filter_popup
                context.emit('update:search_filter_popup', value)

            },
        })
        console.log(search_filter_popup.value)
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
            // context.emit('search', searchFilter.value)

        }
        const rooms2 = ref<Room[]>([])
        const cities2 = ref<City[]>([])
        const statuses2 = ref<UserStatus[]>([])
        onMounted(async () => {
            const { rooms } = await getRoomsList(defaultRoomSearchFilter)
            rooms2.value = rooms
            const { cities } = await getCitiesList(defaultCitySearchFilter)
            cities2.value = cities
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statuses2.value = userstatuses
        })


        return { rooms2, cities2, search_filter_popup, statuses2, searchFirstName, searchLastName, searchRoom, searchCity, searchStatus, searchGender, searchPhoneNumber }




    },


})




</script>

<template>
    <VModal title="Search User" :open="search_filter_popup" actions="center" @close="['update:search_filter_popup']">
        <VField class="column filter">
            <VControl icon="feather:search">
                <input v-model="searchFirstName" type="text" class="input is-rounded" placeholder="first_name..." />
            </VControl>
        </VField>
        <VField class="column filter">
            <VControl icon="feather:search">
                <input v-model="searchLastName" type="text" class="input is-rounded" placeholder="last_name..." />
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
            <VControl icon="feather:search">
                <input v-model="searchPhoneNumber" type="text" class="input is-rounded" placeholder="phone_number..." />
            </VControl>
        </VField>
    </VModal>
</template>

   