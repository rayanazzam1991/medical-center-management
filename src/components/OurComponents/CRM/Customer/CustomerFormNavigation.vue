<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useDropdown} from '/@src/composable/useDropdown'
import {useCustomerForm} from '/@src/stores/CRM/Customer/customerFormSteps'
import {useDarkmode} from '/@src/stores/darkmode'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
const {t, locale} = useI18n()
const customerForm = useCustomerForm()
const iconArrow = locale.value == "ar" ? "lnir-arrow-right" : "lnir-arrow-left"
</script>

<template>
  <nav class="wizard-navigation">
    <div class="">
      <span class="title-wrap">
        <VButton :icon="`lnir ${iconArrow} rem-100`" class="navbar-item is-wizard-title" color="white" darkOutlined
                 to="/customer">
          {{ t('customer.form.back_button') }}
        </VButton>
      </span>
    </div>
    <div class="navbar-item is-wizard-title wizard-brand">
      <span class="title-wrap">
        <span>{{ customerForm.stepTitle }}</span>
      </span>
    </div>
    <div class="navbar-item is-dark-mode">
      <div class="navbar-icon">
        <label class="dark-mode">
          <input :checked="!darkmode.isDark" data-cy="dark-mode-toggle" type="checkbox" @change="darkmode.onChange"/>
          <span></span>
        </label>
      </div>
    </div>
  </nav>
</template>

