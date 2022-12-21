<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerCreateFormSteps'
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)

const customerForm = useCustomerForm()
</script>

<template>
    <nav class="wizard-navigation">
        <div class="">
            <span class="title-wrap">
                <VButton class="navbar-item is-wizard-title" icon="lnir lnir-arrow-left rem-100" to="/customer"
                    darkOutlined color="white">
                    Back to customers page
                </VButton>
            </span>
        </div>
        <div class="navbar-item is-wizard-title wizard-brand">
            <span class="title-wrap">
                Step {{ customerForm.step }}: <span>{{ customerForm.stepTitle }}</span>
            </span>
        </div>
        <div class="navbar-item is-dark-mode">
            <div class="navbar-icon">
                <label class="dark-mode">
                    <input data-cy="dark-mode-toggle" type="checkbox" :checked="!darkmode.isDark"
                        @change="darkmode.onChange" />
                    <span></span>
                </label>
            </div>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
@import '/@src/scss/styles/wizardFormNavigation.scss';
</style>
