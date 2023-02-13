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
import { useContractorForm } from '../stores/Contractor/contractorFormSteps';
import { useContractor } from '/@src/stores/Contractor/contractorStore';
const {t} = useI18n()
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
            :value="(contractorForm.step / 2) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => contractorForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(contractorForm.canNavigate && 'is-active')]">
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding is-flex is-justify-content-start">
                        <VLoader size="small" :active="contractorStore.loading">
                            <VButton type="submit" class="wizard-button-previous mr-2"
                                :disabled="contractorForm.validateStepFn === null"
                                :color="contractorForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ contractorForm.getStep() == 2 ? t('contractor.form.submit_and_finish_button') : t('contractor.form.submit_and_next_button')
}}
                            </VButton>
                        </VLoader>
                        <VButton v-if="contractorForm.skipable === true" class="wizard-button-previous"
                            :color="contractorForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => contractorForm?.skipStepFn?.()">
                            {{ contractorForm.getStep() == 2 ? t('contractor.form.skip_and_finish_button') : t('contractor.form.skip_button')
                            }}
                        </VButton>

                    </div>
                </div>
            </div>
        </form>
    </MinimalLayout>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles_rtl/wizardForm.scss';

</style>
