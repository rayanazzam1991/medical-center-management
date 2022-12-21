<route lang="json">
{
    "meta": {
        "requiresAuth": true
    }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps'
import { useEmployee } from '../stores/Employee/employeeStore';
const employeeStore = useEmployee()
const employeeForm = useEmployeeForm()

useHead({
    title: computed(() => `${employeeForm.stepTitle} - Employee`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <EmployeeFormNavigation v-model:step="employeeForm.step" :title="employeeForm.stepTitle" />

        <!--Wizard Progress Bar-->
        <VProgress id="wizard-progress" class="wizard-progress" color="primary" size="smaller"
            :value="(employeeForm.step / 2) * 100" :max="100" />

        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => employeeForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(employeeForm.canNavigate && 'is-active')]">
                <div class="columns">
                    <div class="column is-one-quarter"></div>
                    <div class="wizard-buttons-inner">
                        <VLoader size="small" :active="employeeStore.loading">
                            <VButton type="submit" class="wizard-button-previous"
                                :disabled="employeeForm.validateStepFn === null"
                                :color="employeeForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ employeeForm.getStep() == 2 ? 'Submit & Finish' : 'Submit & Next'
                                }}
                            </VButton>
                        </VLoader>
                        <VButton class="wizard-button-previous" :disabled="employeeForm.skipable === false"
                            :color="employeeForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => employeeForm?.skipStepFn?.()">
                            {{ employeeForm.getStep() == 2 ? 'Skip & Finish' : 'Skip'
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
