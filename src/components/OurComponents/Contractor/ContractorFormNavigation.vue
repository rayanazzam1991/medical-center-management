<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDropdown } from '/@src/composable/useDropdown'
import { useContractorForm } from '/@src/stores/Contractor/contractorFormSteps';
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
const {t} = useI18n()
const contractorForm = useContractorForm()
const locale = useStorage('locale','ar')
console.log("lang",locale.value)
const iconArrow = locale.value =="ar" ? "lnir-arrow-right":"lnir-arrow-left"
</script>

<template>
  <nav class="wizard-navigation">

    <div class="">
      <span class="title-wrap">
        <VButton class="navbar-item is-wizard-title" :icon="`lnir ${iconArrow} rem-100`" to="/contractor" darkOutlined
          color="white">
          {{t('contractor.form.back_button')}}
        </VButton>
      </span>
    </div>
    <div class="navbar-item is-wizard-title wizard-brand">
      <span class="title-wrap">
        <span>{{ contractorForm.stepTitle }}</span>
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
