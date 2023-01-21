<script setup lang="ts">
import { useI18n } from 'vue-i18n';

type TabId = 'HR' | 'templates'
const activeTab = ref<TabId>('HR')
const emits = defineEmits<{
  (e: 'close'): void
}>()
const {t} = useI18n()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


    <div class="container">
      <div class="tab-content" :class="[activeTab === 'HR' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">{{t('human_resources_subnav.employee.employees')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/employee">
                      <i class="lnir lnir-briefcase" aria-hidden="true"></i>
                      <span>{{t('human_resources_subnav.employee.employees')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/employee-add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{t('human_resources_subnav.employee.create_employee')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <h4 class="column-heading">{{t('human_resources_subnav.position.positions')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/position">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>{{t('human_resources_subnav.position.positions')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/position/add">
                      <i aria-hidden="true" class="lnil lnil-analytics-alt-1"></i>
                      <span>{{t('human_resources_subnav.position.create_position')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-3">
                <h4 class="column-heading">{{t('human_resources_subnav.employees_schedule')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/employee-schedule">
                      <i aria-hidden="true" class="lnir lnir-calender-alt-1"></i>
                      <span>{{t('human_resources_subnav.employees_schedule')}}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-3">
                <h4 class="column-heading">{{t('human_resources_subnav.employees_attendance')}}</h4>
                <ul>
                  <li>
                    <RouterLink to="/employee-attendance">
                      <i class="lnir lnir-calender-alt" aria-hidden="true"></i>
                      <span>{{t('human_resources_subnav.employees_attendance')}}</span>
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
// @import '/@src/scss/abstracts/all';
// @import '/@src/scss/layout/navbar';
// @import '/@src/scss/layout/responsive';
</style>
