<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import {  useToInventoryItemForm } from '/@src/stores/Warehouse/InventoryItem/inventoryItemFormSteps';
import { useDarkmode } from '/@src/stores/darkmode'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import { useI18n } from 'vue-i18n';

const darkmode = useDarkmode()

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
const {t} = useI18n()
const inventoryItemForm = useToInventoryItemForm()
const locale = useStorage('locale','ar')
const iconArrow = locale.value =="ar" ? "lnir-arrow-right":"lnir-arrow-left"
</script>

<template>
    <nav class="wizard-navigation">

        <div class="">
            <span class="title-wrap">
                <VButton class="navbar-item is-wizard-title" :icon="`lnir ${iconArrow} rem-100`" to="/list-internal-movement" darkOutlined
                    color="white">
                    {{t('inventoryItem.back_button')}}
                </VButton>
            </span>
        </div>
        <div class="navbar-item is-wizard-title wizard-brand">
            <span class="title-wrap">
                <span>{{ inventoryItemForm.stepTitle }}</span>
            </span>
        </div>

        <div class="navbar-item is-dark-mode">
            <div class="navbar-icon">
                <label class="dark-mode ">
                    <input data-cy="dark-mode-toggle" type="checkbox" :checked="!darkmode.isDark"
                        @change="darkmode.onChange" />
                    <span></span>
                </label>
            </div>
        </div>

    </nav>
</template>

