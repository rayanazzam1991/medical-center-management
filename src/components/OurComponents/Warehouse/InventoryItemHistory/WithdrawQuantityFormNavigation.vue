<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { useWithdrawItemForm } from '/@src/stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import { useI18n } from 'vue-i18n';

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
const {t} = useI18n()
const withdarwQuantityForm = useWithdrawItemForm()
</script>

<template>
    <nav class="wizard-navigation">

        <div class="">
            <span class="title-wrap">
                <VButton class="navbar-item is-wizard-title" icon="lnir lnir-arrow-left rem-100" to="/item" darkOutlined
                    color="white">
                    {{t('add_quantity.form.back_button')}}
                </VButton>
            </span>
        </div>
        <div class="navbar-item is-wizard-title wizard-brand">
            <span class="title-wrap">
                <span>{{ withdarwQuantityForm.stepTitle }}</span>
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

