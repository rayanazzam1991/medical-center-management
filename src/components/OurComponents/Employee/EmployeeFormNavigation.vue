<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps'
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)

const employeeForm = useEmployeeForm()
</script>

<template>
  <nav class="wizard-navigation">
    <!-- 
    <RouterLink to="/" class="wizard-brand">
      <AnimatedLogo width="38px" height="38px" />
    </RouterLink> -->

    <div class="">
      <span class="title-wrap">
        <VButton class="navbar-item is-wizard-title" icon="lnir lnir-arrow-left rem-100" to="/employee" darkOutlined
          color="white">
          Back to employees page
        </VButton>
      </span>
    </div>
    <div class="navbar-item is-wizard-title wizard-brand">
      <span class="title-wrap">
        <span>{{ employeeForm.stepTitle }}</span>
      </span>
    </div>

    <div class="navbar-item is-dark-mode">
      <div class="navbar-icon">
        <label class="dark-mode">
          <input data-cy="dark-mode-toggle" type="checkbox" :checked="!darkmode.isDark" @change="darkmode.onChange" />
          <span></span>
        </label>
      </div>
    </div>

  </nav>
</template>

<style lang="scss" scoped>
@import '/@src/scss/styles/wizardFormNavigation.scss';
</style>
