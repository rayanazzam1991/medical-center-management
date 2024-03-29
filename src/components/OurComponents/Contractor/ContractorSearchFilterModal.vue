<script lang="ts">
import { getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultContractorSearchFilter } from '/@src/models/Contractor/contractor'
import { Room, defaultRoomSearchFilter, RoomSearchFilter } from '/@src/models/Others/Room/room'
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { useI18n } from 'vue-i18n'


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
        const {t} = useI18n()
        const searchName = ref()
        const searchPhoneNumber = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
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
                phone_number: searchPhoneNumber.value,
                room_id: searchRoom.value,
                user_status_id: searchStatus.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false

        }
        const resetFilter = () => {
            searchName.value = undefined
            searchPhoneNumber.value = undefined
            searchPhoneNumber.value = undefined
            searchRoom.value = undefined
            searchStatus.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined

            context.emit('resetFilter', searchFilter.value)
        }

        const statusesList = ref<UserStatus[]>([])
        const roomsList = ref<Room[]>([])

        onMounted(async () => {
            let roomSearchFilter = {} as RoomSearchFilter
            roomSearchFilter.per_page = 500
            const { rooms } = await getRoomsList(roomSearchFilter)
            roomsList.value = rooms
            let userStatusSearchFilter = {} as UserStatusSearchFilter
            userStatusSearchFilter.per_page = 500
            const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
            statusesList.value = userstatuses

        })


        return {t, search, resetFilter, roomsList, search_filter_popup, statusesList, searchName, searchPhoneNumber, searchRoom, searchStatus, searchDateBetween, searchFrom, searchTo }




    },


})




</script>

<template>
    <VModal :title="t('contractor.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('contractor.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:phone">
                        <input v-model="searchPhoneNumber" type="text" class="input " :placeholder="t('contractor.search_filter.phone_number')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchRoom" class="">
                            <VOption value="">{{t('contractor.search_filter.room_number')}}</VOption>
                            <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{ room.number }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{t('contractor.search_filter.status')}}</VOption>
                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                                    status.name
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{t('contractor.search_filter.create_date')}}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('contractor.search_filter.from')}}</VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('contractor.search_filter.to') }}</VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>
                </div>

                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter')}}</VButton>
        </template>



    </VModal>
</template>

   