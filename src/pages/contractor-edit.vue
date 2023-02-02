<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';
import { useContractorForm } from '../stores/Contractor/contractorFormSteps';
import { useContractor } from '/@src/stores/Contractor/contractorStore';

const contractorStore = useContractor()

const contractorForm = useContractorForm()
const {t} = useI18n()
useHead({
    title: computed(() => `${contractorForm.stepTitle} - Contractor`),
})
</script>

<template>
    <MinimalLayout>
        <ContractorFormNavigation :title="contractorForm.stepTitle" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => contractorForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(contractorForm.canNavigate && 'is-active')]">
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding">
                        <VLoader size="small" :active="contractorStore.loading">
                            <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                                {{ t('contractor.form.edit_submit')}}
                            </VButton>
                        </VLoader>
                    </div>
                </div>
            </div>
        </form>
    </MinimalLayout>
</template>

<style lang="scss">
@import '/@src/scss/Styles/wizardForm.scss';

.buttons-width {

max-width: 40%;
margin: 0 auto !important;

}
.wizard-buttons-inner-padding {

padding : 1rem !important;
}

</style>
