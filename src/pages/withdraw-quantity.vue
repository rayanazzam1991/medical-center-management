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
import { useWithdrawItemForm } from '../stores/Warehouse/ItemHistory/itemHistoryFormSteps';
import { useitemHistory } from '../stores/Warehouse/ItemHistory/itemHistoryStore';

const {t} = useI18n()
const itemHistoryStore = useitemHistory()
const withdarwQuantityForm = useWithdrawItemForm()

useHead({
    title: computed(() => `${withdarwQuantityForm.stepTitle} - Item`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <WithdrawQuantityFormNavigation v-model:step="withdarwQuantityForm.step"
            :title="withdarwQuantityForm.stepTitle" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => withdarwQuantityForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(withdarwQuantityForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VLoader size="small" :active="itemHistoryStore.loading">
                            <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                                {{ t('withdraw_quantity.form.submit')}}
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
