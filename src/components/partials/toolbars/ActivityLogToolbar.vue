<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useI18n } from "vue-i18n";

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
          <div class="heading">
            <div class="heading-left">
              <h6 class="heading-title">
                <i class="iconify mr-2" data-icon="feather:activity" aria-hidden="true"></i>
                <RouterLink to="/activity-log">
                  <span class="is-size-6"> {{ t('others_subnav.setting.activity-log') }}</span>
                </RouterLink>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

