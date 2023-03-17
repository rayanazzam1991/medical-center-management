<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "roles": [
            "Admin",
            "Human_Resources"
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
const {t} = useI18n()
useHead({
    title: computed(() => `${employeeForm.stepTitle} - Employee`),
})
</script>

<template>
    <MinimalLayout>
        <!--Wizard Navbar-->
        <EmployeeFormNavigation :title="employeeForm.stepTitle" />


        <!--Main Wrapper-->
        <form class="wizard-v1-wrapper" @submit.prevent="() => employeeForm?.validateStepFn?.()">
            <RouterView />

            <!--Wizard Navigation Buttons-->
            <div class="wizard-buttons" :class="[(employeeForm.canNavigate && 'is-active')]">
                <div class="columns buttons-width">
                    <div class="wizard-buttons-inner-padding">
                        <VLoader size="small" :active="employeeStore.loading">
                            <VButton type="submit" class="wizard-button-previous" :color="'primary'" bold elevated>
                                {{t('employee.form.edit_submit')}}
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
