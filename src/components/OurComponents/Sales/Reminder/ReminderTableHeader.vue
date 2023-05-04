<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultReminderSearchFilter } from "/@src/models/Sales/Reminder/reminder"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
import { defaultPagination } from "/@src/utils/response"


export default defineComponent({
    props: {
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        is_for_customer: {
            type: Boolean,
            default: false,
        },
        customer_id: {
            type: Number,
            default: undefined,
        },
        is_for_dashboard: {
            type: Boolean,
            default: false,
        },
        with_title: {
            type: Boolean,
            default: false,
        },




    },

    setup(props, context) {
        const { t } = useI18n()
        const router = useRouter()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultReminderSearchFilter)
        const search = () => {
            searchFilter.value = {
                per_page: perPage.value
            }

            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {

            context.emit('resetFilter', searchFilter.value)

        }
        const goToAddReminder = () => {
            router.push({ path: `/reminder/add`, query: { customer_id: props.customer_id } })
        }
        return { t, resetFilter, search, default_per_page, perPage, pagination, Permissions, goToAddReminder }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 v-if="$props.with_title" class="title">
                    {{ t('reminder.table.only_today_title') }}
                </h1>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />

                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">

                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page *
                                            0.1
                                        }}
                                        </VOption>
                                        <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                                        </VOption>
                                        <VOption :value="default_per_page">{{ default_per_page }}
                                        </VOption>
                                        <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                                        </VOption>
                                    </select>
                                </div>
                            </VControl>
                            <VControl v-if="!$props.is_for_dashboard" v-permission="Permissions.REMINDER_CREATE">
                                <VButton @click="goToAddReminder" color="primary">{{ t('reminder.add_button') }}
                                </VButton>
                            </VControl>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
