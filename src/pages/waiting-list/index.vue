<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { WaitingList, defaultWaitingListSearchFilter, WaitingListSearchFilter } from '/@src/models/Sales/WaitingList/waitingList';
import { getWaitingLists } from '/@src/services/Sales/WaitingList/waitingListService';
import { useWaitingList } from '/@src/stores/Sales/WaitingList/waitingListStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('waiting_list.title'))

useHead({ title: t('waiting_list.title'), })
const notif = useNotyf() as Notyf
const waitingListStore = useWaitingList()
const waitingListLists = ref<WaitingList[]>([])
const searchFilter = ref(defaultWaitingListSearchFilter)
const keyIncrement = ref(0)
const isExpanded = ref(false)
onMounted(async () => {
    const { waiting_lists } = await getWaitingLists(searchFilter.value)
    waitingListLists.value = waiting_lists
    keyIncrement.value++
});

const search = async (newSearchFilter: WaitingListSearchFilter) => {
    const { waiting_lists } = await getWaitingLists(newSearchFilter)
    waitingListLists.value = waiting_lists
    searchFilter.value = newSearchFilter
}
const resetFilter = async (newSearchFilter: WaitingListSearchFilter) => {
    searchFilter.value = newSearchFilter
    search(searchFilter.value)
}

</script>

<template>
    <WaitingListHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" @resetFilter="resetFilter" />

    <div class="waiting-list-outer-layout is-flex is-align-items-center is-justify-content-center ">
        <div v-if="waitingListStore.loading">
            <div class="columns is-multiline">
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
        <div v-else class="waiting-list-inner">
            <div class="waiting-lists-container is-flex has-slimscroll">
                <WaitingListComponent v-for="(waitingList, index) in waitingListLists" :key="index"
                    :waiting_list="waitingList.waiting_list" :provider="waitingList.provider" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
