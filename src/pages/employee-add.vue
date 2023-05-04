<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "employee_create"
        ]
    }
}
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps'
import { useEmployee } from '../stores/Employee/employeeStore';
import { useI18n } from 'vue-i18n';
const employeeStore = useEmployee()
const employeeForm = useEmployeeForm()
const { t } = useI18n()
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
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding is-flex is-justify-content-start">
                        <VLoader size="small" :active="employeeStore.loading">
                            <VButton type="submit" class="wizard-button-previous mr-2"
                                :disabled="employeeForm.validateStepFn === null"
                                :color="employeeForm.validateStepFn === null ? 'light' : 'primary'" bold elevated>
                                {{ employeeForm.getStep() == 2 ? t('employee.form.submit_and_finish_button') :
                                    t('employee.form.submit_and_next_button')
                                }}
                            </VButton>
                        </VLoader>
                        <VButton v-if="employeeForm.skipable === true" class="wizard-button-previous"
                            :color="employeeForm.skipable === true ? 'dark' : 'dark'"
                            @click="() => employeeForm?.skipStepFn?.()">
                            {{ employeeForm.getStep() == 2 ? t('employee.form.skip_and_finish_button') :
                                t('employee.form.skip_button')
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
