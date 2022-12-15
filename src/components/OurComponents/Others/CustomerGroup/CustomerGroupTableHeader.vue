<script lang="ts">
import { defaultCustomerGroupSearchFilter, CustomerGroupConsts } from "/@src/models/Others/CustomerGroup/customerGroup"
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
        const searchFilter = ref(defaultCustomerGroupSearchFilter)

        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                status: searchStatus.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchName.value = ''
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { isStuck, resetFilter, search, searchName, searchStatus, perPage, pagination, CustomerGroupConsts }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
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
                            <VField class="column ">
                                <VControl>
                                    <VSelect v-model="searchStatus" class="is-rounded">
                                        <VOption value="">Status</VOption>
                                        <VOption value="0">{{ CustomerGroupConsts.showStatusName(0) }}</VOption>
                                        <VOption value="1">{{ CustomerGroupConsts.showStatusName(1) }}</VOption>
                                    </VSelect>
                                </VControl>
                            </VField>
                        </div>

                    </div>
                    <div class="right  ">
                        <div class="buttons  ">
                            <VIconButton type="submit" v-on:click="search" icon="feather:search" />
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>

                            <VButton to="/customer-group/add" color="primary" raised> {{ button_name }}
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

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
