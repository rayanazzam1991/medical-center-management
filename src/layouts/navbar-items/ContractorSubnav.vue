<script setup lang="ts">
import { useI18n } from 'vue-i18n';

type TabId = 'Contractor' | 'templates'
const activeTab = ref<TabId>('Contractor')
const emits = defineEmits<{
  (e: 'close'): void
}>()
const {t} = useI18n()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


    <div class="container">
      <div class="tab-content" :class="[activeTab === 'Contractor' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">{{ t('contractor_subnav.contractor.contractors') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/contractor">
                      <i class="lnir lnir-file-name" aria-hidden="true"></i>
                      <span>{{ t('contractor_subnav.contractor.contractors') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/contractor-add">
                      <i class="lnil lnil-add-files" aria-hidden="true"></i>
                      <span>{{ t('contractor_subnav.contractor.create_contractor') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <h4 class="column-heading">{{t('contractor_subnav.speciality.specialities')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/speciality">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>{{t('contractor_subnav.speciality.specialities')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/speciality/add">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>{{ t('contractor_subnav.speciality.create_speciality') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
