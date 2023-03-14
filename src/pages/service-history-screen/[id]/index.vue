<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultServiceHistoryScreenDetails } from '/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen';
import { getServiceHistoryScreen } from '/@src/services/Sales/ServiceHistoryScreen/serviceHistoryScreenService';
import { useServiceHistoryScreen } from '/@src/stores/Sales/ServiceHistoryScreen/serviceHistoryScreenStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';



const viewWrapper = useViewWrapper()
const { t, locale } = useI18n()
const iconArrow = locale.value == "ar" ? "lnir-arrow-right" : "lnir-arrow-left"
viewWrapper.setPageTitle(t('service_history_screen.title'))
const route = useRoute()
useHead({ title: t('service_history_screen.title'), })
const notif = useNotyf() as Notyf
const serviceHistoryScreenStore = useServiceHistoryScreen()
const currentScreenService = ref(defaultServiceHistoryScreenDetails)
const keyIncrement = ref(0)

const screenServiceId = ref(0)
screenServiceId.value = route.params?.id as number ?? 0

onMounted(async () => {
  const { screen } = await getServiceHistoryScreen(screenServiceId.value)
  currentScreenService.value = screen
  keyIncrement.value++
});


</script>

<template>
  <div class="form-layout ">
    <div class="form-outer">
      <div class="form-header">
        <div class="form-header-inner">
          <div class="left">
            <h3 class="py-2">{{ serviceHistoryScreenStore.loading ? t('waiting_list.title') : currentScreenService.name }}
            </h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton :icon="`lnir ${iconArrow} rem-100`" to='/service-history-screen' light dark-outlined>
                {{ t('forms.back_button') }}
              </VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="waiting-list-outer-layout is-flex is-align-items-center is-justify-content-center ">
    <div v-if="serviceHistoryScreenStore.loading">
      <div class="columns is-multiline placeholder">
        <div ref="markdownContainer" class="column doc-column is-12">
          <VPlaceholderPage :title="t('waiting_list.place_holder.title')"
            :subtitle="t('waiting_list.place_holder.subtitle')" larger>
            <template #image>
              <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
              <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg" alt="" />
            </template>
          </VPlaceholderPage>
        </div>
      </div>
    </div>
    <div v-else-if="currentScreenService.waiting_lists.length > 0" class="waiting-list-inner">
      <div :key="keyIncrement" class="waiting-lists-container is-flex has-slimscroll">
        <WaitingListComponent v-for="(waitingList, index) in currentScreenService.waiting_lists" :key="index"
          :waiting_list="waitingList.waiting_list" :provider="waitingList.provider" />
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
@import '/@src/scss/styles/formPage.scss';

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
