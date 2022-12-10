<script lang="ts">import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList'
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList'
import { defaultContractorSearchFilter } from '/@src/stores/Contractor/contractorStore'
import { defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore'
import { defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore'
import { defaultUserStatusSearchFilter } from '/@src/stores/Others/UserStatus/userStatusStore'
import { City } from '/@src/utils/api/Others/City'
import { Room } from '/@src/utils/api/Others/Room'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'


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
        const searchComplete = ref()
        const searchRoom = ref()
        const searchStatus = ref()

        const searchFilter = ref(defaultContractorSearchFilter)

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
                gender: searchGender.value,
                phone_number: searchPhoneNumber.value,
                room_id: searchRoom.value,
                user_status_id: searchStatus.value,
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
            searchRoom.value = undefined
            searchStatus.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchComplete.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.is_completed = undefined

            context.emit('resetFilter', searchFilter.value)
        }

        const cities2 = ref<City[]>([])
        const statuses2 = ref<UserStatus[]>([])
        const rooms2 = ref<Room[]>([])

        onMounted(async () => {
            const { cities } = await getCitiesList(defaultCitySearchFilter)
            cities2.value = cities
            const { rooms } = await getRoomsList(defaultRoomSearchFilter)
            rooms2.value = rooms
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statuses2.value = userstatuses

        })


        return { search, resetFilter, rooms2, cities2, search_filter_popup, statuses2, searchName, searchGender, searchPhoneNumber, searchRoom, searchStatus, searchDateBetween, searchFrom, searchTo, searchComplete }




    },


})




</script>

<template>
    <VModal title="Search Contractor" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
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
                        <VSelect v-model="searchRoom" class="is-rounded">
                            <VOption value="">Room Number</VOption>
                            <VOption v-for="room in rooms2" :key="room.id" :value="room.id">{{ room.number }}
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

   