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
    import { useToInventoryItemForm } from '../stores/Warehouse/InventoryItem/inventoryItemFormSteps';
    import { useInventoryItem } from '../stores/Warehouse/InventoryItem/inventoryItemStore';
    
    const {t} = useI18n()
    const inventoryItemStore = useInventoryItem()
    const inventoryItemForm = useToInventoryItemForm()
    
    useHead({
        title: computed(() => `${inventoryItemForm.stepTitle} - Item`),
    })
    </script>
    
    <template>
        <MinimalLayout>
            <!--Wizard Navbar-->
            <ToMainInventoryNavigation v-model:step="inventoryItemForm.step"
                :title="inventoryItemForm.stepTitle" />
    
            <!--Main Wrapper-->
            <form class="wizard-v1-wrapper" @submit.prevent="() => inventoryItemForm?.validateStepFn?.()">
                <RouterView />
    
                <!--Wizard Navigation Buttons-->
                <div class="wizard-buttons" :class="[(inventoryItemForm.canNavigate && 'is-active')]">
                    <div class="columns">
                        <div class="column is-one-quarter"></div>
                        <div class="wizard-buttons-inner">
                            <VLoader size="small" :active="inventoryItemStore.loading">
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
