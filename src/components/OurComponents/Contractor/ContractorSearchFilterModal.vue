<script lang="ts">
import { getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultContractorSearchFilter } from '/@src/models/Contractor/contractor'
import { Room, defaultRoomSearchFilter } from '/@src/models/Others/Room/room'
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'


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

        const statusesList = ref<UserStatus[]>([])
        const roomsList = ref<Room[]>([])

        onMounted(async () => {
            const { rooms } = await getRoomsList(defaultRoomSearchFilter)
            roomsList.value = rooms
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses

        })


        return { search, resetFilter, roomsList, search_filter_popup, statusesList, searchName, searchGender, searchPhoneNumber, searchRoom, searchStatus, searchDateBetween, searchFrom, searchTo, searchComplete }




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
                            <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{ room.number }}
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
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="feather:search" color="primary" raised @click="search">Search</VButton>
        </template>



    </VModal>
</template>

   