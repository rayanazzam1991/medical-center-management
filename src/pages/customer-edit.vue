<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "roles": [
            "Admin",
            "Receptionist"
        ]
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
const { t } = useI18n()
useHead({
    title: computed(() => `${customerForm.stepTitle} - Customer`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <CustomerFormNavigation :title="customerForm.stepTitle" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => customerForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(customerForm.canNavigate && 'is-active')]">
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding">
                        <VLoader size="small" :active="customerStore.loading">
                            <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                                {{ t('customer.form.edit_submit') }}
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
