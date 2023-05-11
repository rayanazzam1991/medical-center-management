<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { checkPermission } from "/@src/composable/checkPermission";
import { Permissions } from '/@src/utils/consts/rolesPermissions'

type TabId = 'others'
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
              <div class="column is-4" v-if="checkPermission(Permissions.CITY_CREATE) ||
                checkPermission(Permissions.CITY_LIST) ||
                checkPermission(Permissions.NATIONALITY_CREATE) ||
                checkPermission(Permissions.NATIONALITY_LIST) ||
                checkPermission(Permissions.SERVICE_LIST) ||
                checkPermission(Permissions.SERVICE_CREATE)">
                <h4 v-if="checkPermission(Permissions.CITY_CREATE) ||
                  checkPermission(Permissions.CITY_LIST) ||
                  checkPermission(Permissions.NATIONALITY_CREATE) ||
                  checkPermission(Permissions.NATIONALITY_LIST)" class="column-heading">{{
    t('others_subnav.cities_and_nationalities') }}</h4>
                <ul>
                  <li v-permission="Permissions.CITY_CREATE">
                    <RouterLink to="/city/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.city.create_city') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.CITY_LIST">
                    <RouterLink to="/city">
                      <i class="lnir lnir-map" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.city.cities') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.NATIONALITY_CREATE">
                    <RouterLink to="/nationality/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.nationality.create_nationality') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.NATIONALITY_LIST">
                    <RouterLink to="/nationality">
                      <i class="lnir lnir-flag-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.nationality.nationalities') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
                <br v-if="checkPermission(Permissions.CITY_CREATE) ||
                  checkPermission(Permissions.CITY_LIST) ||
                  checkPermission(Permissions.NATIONALITY_CREATE) ||
                  checkPermission(Permissions.NATIONALITY_LIST)" />
                <h4 v-if="checkPermission(Permissions.SERVICE_LIST) ||
                  checkPermission(Permissions.SERVICE_CREATE)" class="column-heading">{{
    t('others_subnav.service.services') }}</h4>
                <ul>
                  <li v-permission="Permissions.SERVICE_CREATE">
                    <RouterLink to="/service/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.service.create_service') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.SERVICE_LIST">
                    <RouterLink to="/service">
                      <i class="lnir lnir-briefcase-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.service.services') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4" v-if="checkPermission(Permissions.DEPARTMENT_CREATE) ||
                checkPermission(Permissions.DEPARTMENT_LIST) ||
                checkPermission(Permissions.ROOM_CREATE) ||
                checkPermission(Permissions.SUPPLIER_CREATE) ||
                checkPermission(Permissions.SUPPLIER_LIST) ||
                checkPermission(Permissions.ROOM_LIST)">
                <h4 v-if="checkPermission(Permissions.DEPARTMENT_CREATE) ||
                  checkPermission(Permissions.DEPARTMENT_LIST) ||
                  checkPermission(Permissions.ROOM_CREATE) ||
                  checkPermission(Permissions.ROOM_LIST)" class="column-heading">{{
    t('others_subnav.departments_and_rooms')
  }}</h4>
                <ul>
                  <li v-permission="Permissions.DEPARTMENT_CREATE">
                    <RouterLink to="/department/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.department.create_department') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.DEPARTMENT_LIST">
                    <RouterLink to="/department">
                      <i class="lnir lnir-grid-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.department.departments') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ROOM_CREATE">
                    <RouterLink to="/room/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('others_subnav.room.create_room') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ROOM_LIST">
                    <RouterLink to="/room">
                      <i class="lnir lnir-door-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.room.rooms') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul><br v-if="checkPermission(Permissions.DEPARTMENT_CREATE) ||
                  checkPermission(Permissions.DEPARTMENT_LIST) ||
                  checkPermission(Permissions.ROOM_CREATE) ||
                  checkPermission(Permissions.ROOM_LIST)" />

                <h4 v-if="checkPermission(Permissions.SUPPLIER_CREATE) ||
                  checkPermission(Permissions.SUPPLIER_LIST)" class="column-heading">{{
    t('supplier.supplier_subnav.suppliers') }}
                </h4>
                <ul>
                  <li v-permission="Permissions.SUPPLIER_CREATE">
                    <RouterLink to="/supplier/add">
                      <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                      <span>{{ t('supplier.supplier_subnav.create_supplier') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.SUPPLIER_LIST">
                    <RouterLink to="/supplier">
                      <i class="lnil lnil-previous" aria-hidden="true"></i>
                      <span>{{ t('supplier.supplier_subnav.suppliers') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <div class="column is-4"
                v-if="checkPermission(Permissions.SETTING_EDIT) || checkPermission(Permissions.ROLE_LIST)">
                <h4 class="column-heading">{{
                  t('others_subnav.setting.settings') }}</h4>
                <ul>
                  <li v-permission="Permissions.SETTING_EDIT">
                    <RouterLink to="/settings">
                      <i class="fas fa-wrench mx-2" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.setting.edit_settings') }}</span>
                      <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                    </RouterLink>
                  </li>
                  <li v-permission="Permissions.ROLE_LIST">
                    <RouterLink to="/role">
                      <i class="lnir lnir-medal-alt" aria-hidden="true"></i>
                      <span>{{ t('others_subnav.role.roles') }}</span>
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
