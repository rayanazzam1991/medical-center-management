<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useI18n } from "vue-i18n";
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { checkPermission } from '/@src/composable/checkPermission';

const { t } = useI18n()
const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
</script>

<template>
  <div class="toolbar-notifications is-hidden-mobile">
    <div ref="dropdownElement" class="dropdown is-spaced is-dots is-right dropdown-trigger mr-2">
      <div tabindex="0" class="is-trigger" aria-haspopup="true" @click="dropdown.toggle"
        @keydown.space.prevent="dropdown.toggle">
        <i class="fas fa-grip-vertical" aria-hidden="true"></i>
      </div>
      <div class="dropdown-menu">
        <div class="dropdown-content">
          <ul class="notification-list">
            <li v-permission="Permissions.ACTIVITY_LOG_LIST">
              <a class="notification-item">
                <div class="img-left">
                  <i class="iconify mr-2" data-icon="feather:activity" aria-hidden="true"></i>
                </div>
                <div class="user-content mr-2">
                  <RouterLink to="/activity-log">
                    <p class="is-size-6"> {{ t('others_subnav.setting.activity-log') }}</p>
                  </RouterLink>
                </div>
              </a>
            </li>
            <li>

              <a v-if="!checkPermission(Permissions.ACTIVITY_LOG_LIST)" role="menuitem" class="dropdown-item is-media">
                <div class=" icon">
                  <i class="fas fa-window-close" aria-hidden="true"></i>
                </div>
                <div class="meta">
                  <span>{{ t('drop_down.no_actions') }}</span>
                </div>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

