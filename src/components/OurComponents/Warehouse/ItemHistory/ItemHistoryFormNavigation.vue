<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useItemHistoryForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)

const itemHistoryForm = useItemHistoryForm()
</script>

<template>
    <nav class="wizard-navigation">

        <div class="">
            <span class="title-wrap">
                <VButton class="navbar-item is-wizard-title" icon="lnir lnir-arrow-left rem-100" to="/item" darkOutlined
                    color="white">
                    Back to items page
                </VButton>
            </span>
        </div>
        <div class="navbar-item is-wizard-title wizard-brand">
            <span class="title-wrap">
                <span>{{ itemHistoryForm.stepTitle }}</span>
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
