<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';
import { useItemHistoryForm } from '../stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useitemHistory } from '../stores/Warehouse/ItemHistory/inventoryItemHistoryStoretoryStore';

const itemHistoryStore = useitemHistory()
const itemHistoryForm = useItemHistoryForm()
const {t} = useI18n()
useHead({
    title: computed(() => t('add_quantity.form.title')),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <AddQuantityFormNavigation v-model:step="itemHistoryForm.step" :title="itemHistoryForm.stepTitle" />


        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => itemHistoryForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(itemHistoryForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VLoader size="small" :active="itemHistoryStore.loading">
                            <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                                {{t('add_quantity.form.submit')}}
                            </VButton>
                        </VLoader>
                    </div>
                </div>
            </div>
        </form>
    </MinimalLayout>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/wizardForm.scss';
</style>
