<script lang="ts">
import { defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
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
        }
    },
    setup(props, context) {

        const pagination = props.pagination
        const { y } = useWindowScroll()
        const isStuck = computed(() => {
            return y.value > 30
        })
        const searchName = ref('')
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultUserStatusSearchFilter)

        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchName.value = ''
            searchFilter.value.name = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { isStuck, resetFilter, search, searchName, perPage, pagination }
    },


})




</script>

<template>
    <form class="form-layout">
        <div class="form-outer">
            <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left">
                        <div class="columns justify-content ">
                            <VField class="column filter">
                                <VControl icon="feather:search">
                                    <input v-model="searchName" type="text" class="input is-rounded"
                                        placeholder="Name..." />
                                </VControl>
                            </VField>
                        </div>

                    </div>
                    <div class="right  ">
                        <div class="buttons ">
                            <VIconButton v-on:click="search" icon="feather:search" color="" />
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>

                            <VButton to="/userstatus/add" color="primary" raised> {{ button_name }}
                            </VButton>
                        </div>
                        <div>
                            <VField>
                                <VControl>
                                    <div class="select is-rounded">
                                        <select @change="search" v-model="perPage">
                                            <option v-if="pagination.per_page * 0.1 == 1"
                                                :value="pagination.per_page * 0.1">{{ pagination.per_page * 0.1 }}
                                                result per page</option>
                                            <option v-else :value="pagination.per_page * 0.1">{{ pagination.per_page *
                                                    0.1
                                            }}
                                                results per page</option>
                                            <option :value="pagination.per_page * 0.5">{{ pagination.per_page * 0.5 }}
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
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
