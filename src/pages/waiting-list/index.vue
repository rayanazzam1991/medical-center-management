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

<script lang="ts" setup>
import {useHead} from '@vueuse/head';
import {Notyf} from 'notyf';
import {useI18n} from 'vue-i18n';
import {useNotyf} from '/@src/composable/useNotyf';
import {
  defaultWaitingListSearchFilter,
  WaitingList,
  WaitingListSearchFilter
} from '/@src/models/Sales/WaitingList/waitingList';
import {getWaitingLists} from '/@src/services/Sales/WaitingList/waitingListService';
import {useWaitingList} from '/@src/stores/Sales/WaitingList/waitingListStore';
import {useViewWrapper} from '/@src/stores/viewWrapper';
import {toggleEmployeeAvailability} from '/@src/services/Employee/employeeService';
import Echo from 'laravel-echo'
import Socket from 'socket.io-client'
import {useAuth} from '/@src/stores/Others/User/authStore';


window.io = Socket
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('waiting_list.title'))

useHead({title: t('waiting_list.title'),})
const notif = useNotyf() as Notyf
const waitingListStore = useWaitingList()
const waitingListLists = ref<WaitingList[]>([])
const searchFilter = ref(defaultWaitingListSearchFilter)
const keyIncrement = ref(0)
const userAuth = useAuth()
onMounted(async () => {
  const {waiting_lists} = await getWaitingLists(searchFilter.value)
  waitingListLists.value = waiting_lists
  keyIncrement.value++
  let hostName = import.meta.env.VITE_SOCEKT_HOST;
  let echo = new Echo({
    broadcaster: 'socket.io',
    host: hostName + ':6001',
    authEndpoint: hostName + '/broadcasting/auth',
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
  const {waiting_lists} = await getWaitingLists(newSearchFilter)
  waitingListLists.value = waiting_lists
  searchFilter.value = newSearchFilter
}
const resetFilter = async (newSearchFilter: WaitingListSearchFilter) => {
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
  keyIncrement.value++
}
const toggleAvailability = async (employeeId: number) => {
  const {message, success} = await toggleEmployeeAvailability(employeeId)
  if (success) {
    notif.success(t('toast.success.edit'))
    await search(searchFilter.value)
    keyIncrement.value++

  } else {
    notif.error({message: message, duration: 3000})
  }

}

</script>

<template>
  <WaitingListHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @resetFilter="resetFilter" @search="search"/>
  <div class="waiting-list-outer-layout is-flex is-align-items-center is-justify-content-center ">
    <div v-if="waitingListStore.loading">
      <div class="columns is-multiline placeholder">
        <div ref="markdownContainer" class="column doc-column is-12">
          <VPlaceholderPage :subtitle="t('waiting_list.place_holder.subtitle')"
                            :title="t('waiting_list.place_holder.title')" larger>
            <template #image>
              <img alt="" class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg"/>
              <img alt="" class="dark-image"
                   src="/@src/assets/illustrations/placeholders/search-1-dark.svg"/>
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>
    <div v-else-if="waitingListLists.length > 0" class="waiting-list-inner">
      <div :key="keyIncrement" class="waiting-lists-container is-flex has-slimscroll">
        <WaitingListComponent v-for="(waitingList, index) in waitingListLists" :key="index" :current_turn_number="waitingList.current_turn_number"
                              :provider="waitingList.provider" :waiting_list="waitingList.waiting_list"
                              withChangeAvailability @toggleAvailability="toggleAvailability"/>
      </div>
    </div>
    <div v-else>
      <div class="columns is-multiline placeholder">
        <div ref="markdownContainer" class="column doc-column is-12">
          <VPlaceholderPage :subtitle="t('waiting_list.no_data.subtitle')" :title="t('waiting_list.no_data.title')"
                            class="placeholder" larger>
            <template #image>
              <img alt="" class="light-image" src="/@src/assets/illustrations/placeholders/error-5.svg"/>
              <img alt="" class="dark-image" src="/@src/assets/illustrations/placeholders/error-5-dark.svg"/>
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
