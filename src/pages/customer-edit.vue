<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps'
import { useCustomer } from '../stores/CRM/Customer/customerStore';

const customerStore = useCustomer()
const customerForm = useCustomerForm()

useHead({
    title: computed(() => `${customerForm.stepTitle} - Customer`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <CustomerFormNavigation v-model:step="customerForm.step" :title="customerForm.stepTitle" />

        <!--Wizard Progress Bar-->
        <VProgress id="wizard-progress" class="wizard-progress" color="primary" size="smaller"
            :value="(customerForm.step / 4) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => customerForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(customerForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VLoader size="small" :active="customerStore.loading">
                            <VButton type="submit" class="wizard-button-previous"
                                :disabled="customerForm.validateStepFn === null"
                                :color="customerForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ customerForm.getStep() == 4 ? 'Submit & Finish' : 'Submit & Next'
                                }}
                            </VButton>
                        </VLoader>

                        <VButton class="wizard-button-previous" :disabled="customerForm.skipable === false"
                            :color="customerForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => customerForm?.skipStepFn?.()">
                            {{ customerForm.getStep() == 4 ? 'Skip & Finish' : 'Skip'
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
