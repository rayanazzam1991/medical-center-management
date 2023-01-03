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

        <!--Wizard Progress Bar-->
        <VProgress id="wizard-progress" class="wizard-progress" color="primary" size="smaller"
            :value="(itemHistoryForm.step / 2) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => itemHistoryForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(itemHistoryForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VLoader size="small" :active="itemHistoryStore.loading">
                            <VButton type="submit" class="wizard-button-previous"
                                :disabled="itemHistoryForm.validateStepFn === null"
                                :color="itemHistoryForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ itemHistoryForm.getStep() == 2 ? 'Submit & Finish' : 'Submit & Next'
}}
                            </VButton>
                        </VLoader>
                        <VButton v-if="itemHistoryForm.skipable === true" class="wizard-button-previous"
                            :color="itemHistoryForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => itemHistoryForm?.skipStepFn?.()">
                            {{ itemHistoryForm.getStep() == 2 ? 'Skip & Finish' : 'Skip'
                            }}
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
    