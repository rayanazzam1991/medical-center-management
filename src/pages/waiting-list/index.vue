<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "waiting_list_list"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { WaitingList, defaultWaitingListSearchFilter, WaitingListSearchFilter } from '/@src/models/Sales/WaitingList/waitingList';
import { getWaitingLists } from '/@src/services/Sales/WaitingList/waitingListService';
import { useWaitingList } from '/@src/stores/Sales/WaitingList/waitingListStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { toggleEmployeeAvailability } from '/@src/services/Employee/employeeService';
import Echo from 'laravel-echo'
import Socket from 'socket.io-client'
import { useAuth } from '/@src/stores/Others/User/authStore';
import EmployeeWaitingList from '/@src/components/OurComponents/Employee/EmployeeWaitingList.vue';
import { TicketConsts } from '/@src/models/Sales/Ticket/ticket';


window.io = Socket
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('waiting_list.title'))

useHead({ title: t('waiting_list.title'), })
const notif = useNotyf() as Notyf
const waitingListLists = ref<WaitingList[]>([])
const searchFilter = ref(defaultWaitingListSearchFilter)
const keyIncrement = ref(0)
const loading = ref({ fetch: false, refresh: false })
const userAuth = useAuth()
onMounted(async () => {
    loading.value.fetch = true
    const { waiting_lists } = await getWaitingLists(searchFilter.value)
    waitingListLists.value = waiting_lists
    keyIncrement.value++
    loading.value.fetch = false


    let echo = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname + ':6001',
        authEndpoint: window.location.hostname + '/broadcasting/auth',
        auth:
        {
            headers:
            {
                'Accept': 'application/json',
                Authorization: `Bearer ${userAuth.token}`,
            }
        },
        rejectUnauthorized: false,
    });
    echo.private('waitingList')
        .listen("WaitingListsEvent", (e: any) => {
            waitingListLists.value = waitingListLists.value.map((el) => {
                if (el.provider.id === e.employee_id) {
                    return e.waiting_list;
                } else {
                    return el;
                }
            });

        });

});

const search = async (newSearchFilter: WaitingListSearchFilter) => {
    loading.value.fetch = true
    const { waiting_lists } = await getWaitingLists(newSearchFilter)
    waitingListLists.value = waiting_lists
    searchFilter.value = newSearchFilter
    loading.value.fetch = false
}
const resetFilter = async (newSearchFilter: WaitingListSearchFilter) => {
    loading.value.fetch = false
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
    keyIncrement.value++
}
const toggleAvailability = async (employeeId: number) => {
    const { message, success } = await toggleEmployeeAvailability(employeeId)
    if (success) {
        notif.success(t('toast.success.edit'))
        await search(searchFilter.value)
        keyIncrement.value++

    } else {
        notif.error({ message: message, duration: 3000 })
    }

    loading.value.fetch = false

}
const refresh = async () => {
    console.log('refresh')
    loading.value.refresh = true

    const { waiting_lists } = await getWaitingLists(searchFilter.value)
    waitingListLists.value = waiting_lists
    keyIncrement.value++
    loading.value.refresh = false

}

</script>

<template>
    <WaitingListHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" @resetFilter="resetFilter"
        :loading="loading.refresh" />
    <div class="waiting-list-outer-layout is-flex is-align-items-center is-justify-content-center ">
        <div v-if="loading.fetch">
            <div class="columns is-multiline placeholder">
                <div ref="markdownContainer" class="column doc-column is-12">
                    <VPlaceholderPage :title="t('waiting_list.place_holder.title')"
                        :subtitle="t('waiting_list.place_holder.subtitle')" larger>
                        <template #image>
                            <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
                            <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
                                alt="" />
                        </template>
                    </VPlaceholderPage>
                </div>
            </div>
        </div>
        <div v-else-if="waitingListLists.length > 0" class="waiting-list-inner">
            <div :key="keyIncrement" class="waiting-lists-container is-flex has-slimscroll">
                <WaitingListComponent v-for="(waitingList, index) in waitingListLists" :key="index" draggable
                    withChangeAvailability @refresh="refresh" @toggleAvailability="toggleAvailability"
                    :current_is_reserve="waitingList.current_is_reserve" :waiting_list="waitingList.waiting_list"
                    :current_turn_number="waitingList.current_turn_number" :provider="waitingList.provider" />
            </div>
        </div>
        <div v-else>
            <div class="columns is-multiline placeholder">
                <div ref="markdownContainer" class="column doc-column is-12">
                    <VPlaceholderPage class="placeholder" :title="t('waiting_list.no_data.title')"
                        :subtitle="t('waiting_list.no_data.subtitle')" larger>
                        <template #image>
                            <img class="light-image" src="/@src/assets/illustrations/placeholders/error-5.svg" alt="" />
                            <img class="dark-image" src="/@src/assets/illustrations/placeholders/error-5-dark.svg" alt="" />
                        </template>
                    </VPlaceholderPage>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss">
.waiting-list-outer-layout {
    flex: 1;
    display: inline-block;
    width: 100%;
    height: 70vh;
    padding: 20px;
    background-color: var(--white);
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    transition: all .3s;


}

.page-placeholder {
    .placeholder-content {

        p {
            &.is-larger {
                width: 400px !important;
            }
        }
    }
}

.waiting-list-inner {
    height: 100%;
    overflow: hidden;



}

.waiting-lists-container {
    padding: 1rem;
    gap: 20px;
    height: 100%;
    width: 100%;



}

.is-dark {


    .waiting-list-outer-layout {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
    }


}
</style>
