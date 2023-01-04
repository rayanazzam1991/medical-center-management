<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">import { useHead } from '@vueuse/head';
import { RouterView } from 'vue-router';
import { useItemHistoryForm } from '../stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useitemHistory } from '../stores/Warehouse/ItemHistory/itemHistoryStore';

const itemHistoryStore = useitemHistory()
const itemHistoryForm = useItemHistoryForm()

useHead({
    title: computed(() => `${itemHistoryForm.stepTitle} - Contractor`),
})
</script>
    
<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <ItemHistoryFormNavigation v-model:step="itemHistoryForm.step" :title="itemHistoryForm.stepTitle" />


        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => itemHistoryForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(itemHistoryForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                            Submit
                        </VButton>

                    </div>
                </div>
            </div>
        </form>
    </MinimalLayout>
</template>
    
<style scoped lang="scss">
@import '/@src/scss/Styles/wizardForm.scss';
</style>
    