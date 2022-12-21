<script lang="ts">
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { City, defaultCitySearchFilter } from "/@src/models/Others/City/city"
import { Room, defaultRoomSearchFilter } from "/@src/models/Others/Room/room"
import { defaultUserSearchFilter, UserSearchFilter } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getCitiesList } from "/@src/services/Others/City/cityService"
import { defaultPagination } from "/@src/utils/response"

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
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        }

    },


    setup(props, context) {
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
            console.log("DASdas", searchFilterPop.value)
        }
        const pagination = props.pagination
        const default_per_page = props.default_per_page

        const searchFilterPop = ref(false)
        const searchFirstName = ref()
        const searchLastName = ref()
        const searchGender = ref()
        const searchPhoneNumber = ref()
        const searchRoom = ref()
        const searchCity = ref()
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultUserSearchFilter)
        const is_reseted = ref(false)
        const keyTest = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: UserSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.city_id = undefined
            searchFilter.value.user_status_id = undefined
            is_reseted.value = true
            keyTest.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: UserSearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.city_id = undefined
            searchFilter.value.user_status_id = undefined

            console.log(searchFilter)
            context.emit('resetFilter', searchFilter.value)

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
        return { keyTest, default_per_page, is_reseted, onOpen, resetFilter_popup, rooms2, cities2, search_filter, popUpTrigger, statuses2, resetFilter, search, searchFilterPop, searchFirstName, searchLastName, searchRoom, searchCity, searchStatus, searchGender, searchPhoneNumber, perPage, pagination }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left">
                        <div>
                            <VButton @click.prevent="onOpen" raised> Search
                            </VButton>
                        </div>

                    </div>
                    <div class="right">
                        <div class="buttons  ">
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>
                            <VButton to="/user/add" color="primary" raised> {{ button_name }}
                            </VButton>
                        </div>
                        <div>
                            <VField>
                                <VControl>
                                    <div class="select">
                                        <select @change="search" v-model="perPage">
                                            <option v-if="pagination.per_page * 0.1 == 1"
                                                :value="pagination.per_page * 0.1">{{ pagination.per_page * 0.1 }}
                                                result per page</option>
                                            <option v-else :value="pagination.per_page * 0.1">{{ pagination.per_page
                                                    *
                                                    0.1
                                            }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 0.5">{{ pagination.per_page * 0.5
                                            }}
                                                results per page</option>
                                            <option :value="pagination.per_page">{{ pagination.per_page }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 2">{{ pagination.per_page * 2 }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 10">{{ pagination.per_page * 10 }}
                                                results per page</option>
                                        </select>
                                    </div>
                                </VControl>
                            </VField>
                        </div>


                    </div>

                </div>
            </div>
        </div>
        <UserSearchFilterModel :key="keyTest" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
            @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
