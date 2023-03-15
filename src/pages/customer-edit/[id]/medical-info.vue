<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultMedicalInfo } from '/@src/models/CRM/MedicalInfo/medicalInfo';
import { getCustomer, updateCustomer, addMedicalInfo } from '/@src/services/CRM/Customer/customerService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { MedicalInfoConsts } from '/@src/models/CRM/MedicalInfo/medicalInfo';
import { medicalinfoEditValidationSchema } from '/@src/rules/CRM/MedicalInfo/medicalinfoEditValidation';
import sleep from "/@src/utils/sleep"
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';



const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const notif = useNotyf() as Notyf
const { t } = useI18n()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle(t('customer.form.edit_step_2_title'))
const head = useHead({
    title: t('customer.form.page_title'),
})
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 2,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/customer/${customerId.value}`,
                query: { tab: 'Medical Info' }
            })
            customerForm.reset()

        }

    },
})

const fetchCustomer = async () => {
    const { customer } = await getCustomer(customerId.value)
    if (customer.medical_info) {
        customerForm.medicalInfoForm.allergic = customer.medical_info.allergic
        customerForm.medicalInfoForm.any_other_info = customer.medical_info.any_other_info
        customerForm.medicalInfoForm.blood_type = customer.medical_info.blood_type
        customerForm.medicalInfoForm.chronic_diseases = customer.medical_info.chronic_diseases
        customerForm.medicalInfoForm.infectious_diseases = customer.medical_info.infectious_diseases
        customerForm.medicalInfoForm.smoking = customer.medical_info.smoking
        customerForm.medicalInfoForm.id = customer.medical_info.id

    }

    customerForm.userForm.id = customer.user.id
    customerForm.userForm.first_name = customer.user.first_name
    customerForm.userForm.last_name = customer.user.last_name
    customerForm.userForm.gender = customer.user.gender
    customerForm.userForm.birth_date = customer.user.birth_date
    customerForm.userForm.phone_number = customer.user.phone_number
    customerForm.userForm.address = customer.user.address
    customerForm.userForm.room_id = undefined
    customerForm.userForm.city_id = customer.user.city.id
    customerForm.userForm.user_status_id = customer.user.status.id
    customerForm.dataUpdate.user.id = customer.user.id
    customerForm.dataUpdate.emergency_contact_name = customer.emergency_contact_name
    customerForm.dataUpdate.emergency_contact_phone = customer.emergency_contact_phone
    customerForm.dataUpdate.customer_group_id = customer.customer_group.id
    customerForm.dataUpdate.id = customerId.value
    for (let i = 0; i < customer.social_medias.length; i++) {
        // @ts-ignore

        customerForm.customerSocialMediaForm.push({ social_media_id: customer.social_medias[i].id, url: customer.social_medias[i].url })


    }
    getCurrentMedicalInfo()

}

const getCurrentMedicalInfo = () => {

    currentMedicalInfo.value = customerForm.medicalInfoForm



}

const currentMedicalInfo = ref(defaultMedicalInfo)
onMounted(async () => {
    if (customerForm.dataUpdate.id != customerId.value) {

        await fetchCustomer()
    }
}
)


const validationSchema = medicalinfoEditValidationSchema

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

const onSubmitEdit = handleSubmit(async (values) => {
    var medicalInfoData = currentMedicalInfo.value
    customerForm.medicalInfoForm.allergic = medicalInfoData.allergic
    customerForm.medicalInfoForm.blood_type = medicalInfoData.blood_type
    customerForm.medicalInfoForm.chronic_diseases = medicalInfoData.chronic_diseases
    customerForm.medicalInfoForm.infectious_diseases = medicalInfoData.infectious_diseases
    customerForm.medicalInfoForm.smoking = medicalInfoData.smoking
    customerForm.medicalInfoForm.any_other_info = medicalInfoData.any_other_info
    if (medicalInfoData.allergic == undefined &&
        medicalInfoData.blood_type == undefined &&
        medicalInfoData.chronic_diseases == undefined &&
        medicalInfoData.infectious_diseases == undefined &&
        medicalInfoData.smoking == undefined &&
        medicalInfoData.any_other_info == undefined) {
        await sleep(200);

        notif.error(t('toast.error.steps_error'))

        return false

    }

    var _customer, _message, _success
    if (customerForm.dataUpdate.medical_info.id) {

        const { customer, message, success } = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
        _customer = customer
        _message = message
        _success = success
    }
    else {
        const { customer, message, success } = await addMedicalInfo(customerId.value, customerForm.medicalInfoForm)
        _customer = customer
        _message = message
        _success = success

    }

    if (_success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.edit'))

        return true
    }
    else {
        // @ts-ignore
        await sleep(200);

        notif.error(_message)

    }


})



</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitEdit()">
            <div class="form-outer">
                <div class="form-body mb-6">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <VField id="blood_type">
                                    <VLabel class="optional">{{ t('customer.form.blood_type') }}</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentMedicalInfo" v-model="currentMedicalInfo.blood_type">
                                            <VOption value="">{{ t('customer.form.blood_type') }}</VOption>
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
