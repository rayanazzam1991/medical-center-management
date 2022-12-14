
<script lang="ts">
import { defaultCustomerSearchFilter, CustomerSearchFilter } from "/@src/models/CRM/Customer/customer"
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
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const pagination = props.pagination
        const { y } = useWindowScroll()
        const isStuck = computed(() => {
            return y.value > 30
        })
        const searchFilterPop = ref(false)
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultCustomerSearchFilter)
        const is_reseted = ref(false)
        const keyTest = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: CustomerSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.customer_group_id = undefined
            searchFilter.value.is_completed = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.city_id = undefined
            is_reseted.value = true
            keyTest.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: CustomerSearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.gender = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.customer_group_id = undefined
            searchFilter.value.is_completed = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.city_id = undefined


            console.log(searchFilter)
            context.emit('resetFilter', searchFilter.value)

        }
        return { keyTest, is_reseted, isStuck, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, perPage, pagination }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left">
                        <div class="columns justify-content">
                            <VButton @click.prevent="onOpen" raised> Search
                            </VButton>
                        </div>

                    </div>
                    <div class="right">
                        <div class="buttons  ">
                            <VButton @click="resetFilter" color="danger" raised> Reset Filters
                            </VButton>
                            <VButton to="/customer-add" color="primary" raised> {{ button_name }}
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
        <CustomerSearchFilterModal :key="keyTest" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style   lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }


                    .left {
                        width: 20%;
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }


                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
