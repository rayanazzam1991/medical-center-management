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
import { useI18n } from 'vue-i18n';

const customerStore = useCustomer()
const customerForm = useCustomerForm()
const {t} = useI18n()

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
            :value="(customerForm.step / 2) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => customerForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(customerForm.canNavigate && 'is-active')]">
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding is-flex is-justify-content-start">
                        <VLoader size="small" :active="customerStore.loading">
                            <VButton type="submit" class="wizard-button-previous mr-2"
                                :disabled="customerForm.validateStepFn === null"
                                :color="customerForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ customerForm.getStep() == 2 ? t('customer.form.submit_and_finish_button') : t('customer.form.submit_and_next_button')
                                }}
                            </VButton>
                        </VLoader>
                        <VButton v-if="customerForm.skipable === true" class="wizard-button-previous"
                            :color="customerForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => customerForm?.skipStepFn?.()">
                            {{ customerForm.getStep() == 2 ? t('customer.form.skip_and_finish_button') : t('customer.form.skip_button')
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
