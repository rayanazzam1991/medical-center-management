<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { RouterView } from 'vue-router';
import { useContractorForm } from '../stores/Contractor/contractorFormSteps';
import { useContractor } from '/@src/stores/Contractor/contractorStore';

const contractorStore = useContractor()

const contractorForm = useContractorForm()

useHead({
    title: computed(() => `${contractorForm.stepTitle} - Contractor`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <ContractorFormNavigation v-model:step="contractorForm.step" :title="contractorForm.stepTitle" />

        <!--Wizard Progress Bar-->
        <VProgress id="wizard-progress" class="wizard-progress" color="primary" size="smaller"
            :value="(contractorForm.step / 3) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => contractorForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[contractorForm.canNavigate && 'is-active']">
                <div class="wizard-buttons-inner">
                    <VLoader size="small" :active="contractorStore.loading">
                        <VButton type="submit" class="wizard-button-previous"
                            :disabled="contractorForm.validateStepFn === null"
                            :color="contractorForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                            {{ contractorForm.getStep() == 3 ? 'Submit & Finish' : 'Submit & Next'
                            }}
                        </VButton>
                    </VLoader>
                    <VButton class="wizard-button-previous" :disabled="contractorForm.skipable === false"
                        :color="contractorForm.skipable === true ? 'dark' : 'dark'"
                        @click="() => contractorForm?.skipStepFn?.()">
                        {{ contractorForm.getStep() == 3 ? 'Skip & Finish' : 'Skip'
                        }}
                    </VButton>
                </div>
            </div>
        </form>
    </MinimalLayout>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/wizardForm.scss';
</style>
