<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ErrorMessage, useForm } from 'vee-validate'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultMedicalInfo } from '/@src/models/CRM/MedicalInfo/medicalInfo'
import { addMedicalInfo } from '/@src/services/CRM/Customer/customerService'
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { MedicalInfoConsts } from '/@src/models/CRM/MedicalInfo/medicalInfo'
import { medicalinfoAddValidationSchema } from '/@src/rules/CRM/MedicalInfo/medicalinfoAddValidation'
import sleep from "/@src/utils/sleep"
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'

const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const { t } = useI18n()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle(t('customer.form.step_2_title'))
const head = useHead({
    title: t('customer.form.page_title'),
})
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 2,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitAdd()
        if (isValid) {
            router.push({
                path: `/customer/${customerId.value}`,
            })
            customerForm.reset()
        }

    },
    skipStepFn: async () => {
        customerForm.medicalInfoForm.allergic = undefined
        customerForm.medicalInfoForm.blood_type = undefined
        customerForm.medicalInfoForm.chronic_diseases = undefined
        customerForm.medicalInfoForm.infectious_diseases = undefined
        customerForm.medicalInfoForm.smoking = undefined
        customerForm.medicalInfoForm.any_other_info = undefined
        router.push({
            path: `/customer/${customerId.value}`,
        })

    }

})
const getCurrentMedicalInfo = () => {

    currentMedicalInfo.value = customerForm.medicalInfoForm



}

const currentMedicalInfo = ref(defaultMedicalInfo)
const pageTitle = t('customer.form.step_2_subtitle')
onMounted(() => {
    getCurrentMedicalInfo()
}
)


const validationSchema = medicalinfoAddValidationSchema

const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        blood_type: currentMedicalInfo.value.blood_type,
        allergic: currentMedicalInfo.value.allergic,
        chronic_diseases: currentMedicalInfo.value.chronic_diseases,
        infectious_diseases: currentMedicalInfo.value.infectious_diseases,
        smoking: currentMedicalInfo.value.smoking,
        any_other_info: currentMedicalInfo.value.allergic,
    },
})

const onSubmitAdd = handleSubmit(async (values) => {
    var medicalInfoData = currentMedicalInfo.value
    customerForm.medicalInfoForm.allergic = medicalInfoData.allergic
    customerForm.medicalInfoForm.blood_type = medicalInfoData.blood_type
    customerForm.medicalInfoForm.chronic_diseases = medicalInfoData.chronic_diseases
    customerForm.medicalInfoForm.infectious_diseases = medicalInfoData.infectious_diseases
    customerForm.medicalInfoForm.smoking = medicalInfoData.smoking
    customerForm.medicalInfoForm.any_other_info = medicalInfoData.any_other_info
    if ((medicalInfoData.allergic == undefined || medicalInfoData.allergic == "") &&
        (medicalInfoData.blood_type == undefined || medicalInfoData.blood_type == "") &&
        (medicalInfoData.chronic_diseases == undefined || medicalInfoData.chronic_diseases == "") &&
        (medicalInfoData.infectious_diseases == undefined || medicalInfoData.infectious_diseases == "") &&
        (medicalInfoData.smoking == undefined) &&
        (medicalInfoData.any_other_info == undefined || medicalInfoData.any_other_info == "")) {
        await sleep(200);

        notif.error(t('toast.error.steps_error'))

        return false

    }
    const { customer, message, success } = await addMedicalInfo(customerId.value, customerForm.medicalInfoForm)

    if (success) {

        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.add'))

        return true
    }
    else {

        // @ts-ignore
        await sleep(200);

        notif.error(message)

    }


})



</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitAdd()">
            <div class="form-outer">
                <div class="form-body mb-6">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="blood_type">
                                    <VLabel class="optional">{{ t('customer.form.blood_type') }}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentMedicalInfo" v-model="currentMedicalInfo.blood_type">
                                            <VOption value="">{{}}</VOption>
                                            <VOption v-for="blood_type in MedicalInfoConsts.BLOOD_TYPES" :key="blood_type"
                                                :value="blood_type">{{ blood_type }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="blood_type" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField id="allergic">
                                    <VLabel class="optional">{{ t('customer.form.allergic') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentMedicalInfo.allergic" type="text" placeholder=""
                                            autocomplete="" />
                                        <ErrorMessage class="help is-danger" name="allergic" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="infectious_diseases">
                                    <VLabel class="optional">{{ t('customer.form.infectious_diseases') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentMedicalInfo.infectious_diseases" type="text" placeholder=""
                                            autocomplete="" />
                                        <ErrorMessage class="help is-danger" name="infectious_diseases" />
                                    </VControl>
                                </VField>
                            </div>

                            <div class="column is-6">
                                <VField id="chronic_diseases">
                                    <VLabel class="optional">{{ t('customer.form.chronic_diseases') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentMedicalInfo.chronic_diseases" type="text" placeholder=""
                                            autocomplete="" />
                                        <ErrorMessage class="help is-danger" name="chronic_diseases" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="smooking">
                                    <VLabel class="optional">{{ t('customer.form.smoke') }}</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentMedicalInfo.smoking" :value="MedicalInfoConsts.FALSE"
                                            :label="MedicalInfoConsts.showBoolean(MedicalInfoConsts.FALSE)" name="smooking"
                                            color="warning" />

                                        <VRadio v-model="currentMedicalInfo.smoking" :value="MedicalInfoConsts.TRUE"
                                            :label="MedicalInfoConsts.showBoolean(MedicalInfoConsts.TRUE)" name="smooking"
                                            color="success" />
                                        <ErrorMessage class="help is-danger" name="smooking" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="any_other_info">
                                    <VLabel class="optional">{{ t('customer.form.other_info') }}</VLabel>
                                    <VControl>
                                        <VTextarea v-model="currentMedicalInfo.any_other_info" />
                                        <ErrorMessage class="help is-danger" name="any_other_info" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.required::after {
    content: " *";
    color: var(--danger);
}


.form-layout .form-outer .form-body {
    padding: 20px 40px 40px;
}

.layout {
    min-width: 50%;
}

.form-fieldset {
    max-width: 40%;
}
</style>
