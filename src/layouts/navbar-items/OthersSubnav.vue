<script setup lang="ts">
import { useI18n } from "vue-i18n";

type TabId = 'others' | 'templates'
const activeTab = ref<TabId>('others')
const { t } = useI18n()
const emits = defineEmits<{
  (e: 'close'): void
}>()

</script>

<template>
  <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


    <div class="container">
      <div class="tab-content" :class="[activeTab === 'others' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center has-slimscroll">
            <div class="columns">
              <div class="column is-4">
                <h4 class="column-heading">{{ t('others_subnav.nationality.nationalities') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/nationality">
                      <i class="lnir lnir-flag-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.nationality.nationalities') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/nationality/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.nationality.create_nationality') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 class="column-heading">{{ t('others_subnav.service.services') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/service">
                      <i class="lnir lnir-briefcase-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.service.services') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/service/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.service.create_service') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 class="column-heading">{{ t('supplier.supplier_subnav.suppliers') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/supplier">
                      <i class="lnil lnil-previous" aria-hidden="true"></i>
                      <span>{{ t('supplier.supplier_subnav.suppliers') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/supplier/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('supplier.supplier_subnav.create_supplier') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4">
                <h4 class="column-heading">{{ t('others_subnav.department.departments') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/department">
                      <i class="lnir lnir-grid-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.department.departments') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/department/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.department.create_department') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 class="column-heading">{{ t('others_subnav.room.rooms') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/room">
                      <i class="lnir lnir-door-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.room.rooms') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/room/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.room.create_room') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4">
                <h4 class="column-heading">{{ t('others_subnav.city.cities') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/city">
                      <i class="lnir lnir-map" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.city.cities') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/city/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.city.create_city') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br />
                <h4 class="column-heading">{{ t('others_subnav.setting.settings') }}</h4>
                <ul>
                  <li>
                    <RouterLink to="/settings">
                      <i class="fas fa-wrench mx-2" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.setting.edit_settings') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-content" :class="[activeTab === 'templates' && 'is-active']">
        <div class="tab-content-inner">
          <div class="center">
            <div class="columns">
              <div class="column is-3">
                <h4 class="column-heading">Sidebars</h4>
                <ul>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-1">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Regular Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-2">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Curved Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-3">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Colored Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-4">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Curved Colored</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-5">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Labels Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-6">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Labels Hover Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/sidebar-blank-page-7">
                      <i aria-hidden="true" class="lnil lnil-layout"></i>
                      <span>Float Sidebar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-3">
                <h4 class="column-heading">Navbars</h4>
                <ul class="has-slimscroll" simplebar>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-1">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Regular Navbar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-2">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Fading Navbar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-3">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Colored Navbar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-4">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Drop Navbar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-5">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Colored Drop</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-6">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Clean Navbar</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-7">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Clean Center</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/starters/navbar-blank-page-8">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Clean Fade</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-3">
                <h4 class="column-heading">Widgets</h4>
                <ul>
                  <li>
                    <RouterLink to="/navbar/others/charts-apex">
                      <i aria-hidden="true" class="lnil lnil-pie-chart-alt"></i>
                      <span>Apex Charts</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/others/charts-billboardsjs">
                      <i aria-hidden="true" class="lnil lnil-bar-chart"></i>
                      <span>Billboard JS</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/others/widgets-sample-ui">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>UI Widgets</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <!--                    <RouterLink-->
                    <!--                      :to="{-->
                    <!--                        name: '/navbar/others/widgets-sample-creative',-->
                    <!--                      }"-->
                    <!--                    >-->
                    <i aria-hidden="true" class="lnil lnil-layout-alt-2"></i>
                    <span>Creative Widgets</span>
                    <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    <!--                    </RouterLink>-->
                  </li>
                  <li>
                    <RouterLink to="/navbar/others/widgets-sample-list">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>List Widgets</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/others/widgets-sample-stats">
                      <i aria-hidden="true" class="lnil lnil-layout-alt-1"></i>
                      <span>Stat Widgets</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-3">
                <h4 class="column-heading">Wizard</h4>
                <ul>
                  <li>
                    <RouterLink to="/wizard-v1">
                      <span>Wizard V1</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/form-layouts-1">
                      <span>Form V1</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/form-layouts-2">
                      <span>Form V2</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/form-layouts-3">
                      <span>Form V3</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/navbar/layouts/form-layouts-4">
                      <span>Form V4</span>
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
