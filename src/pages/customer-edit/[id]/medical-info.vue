<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { optional, z as zod } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { ErrorMessage, useForm } from 'vee-validate';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultMedicalInfo } from '/@src/models/CRM/MedicalInfo/medicalInfo';
import { getCustomer, updateCustomer, addMedicalInfo } from '/@src/services/CRM/Customer/customerService';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { MedicalInfoConsts } from '/@src/models/CRM/MedicalInfo/medicalInfo';



const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const notif = useNotyf()

const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle('Customer Medical Info')
const head = useHead({
    title: 'Customer',
})
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 3,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        if (isValid) {
            router.push({
                path: `/customer-edit/${customerId.value}/social-media`,
            })
        }

    },
    skipStepFn: async () => {
        router.push({
            path: `/customer-edit/${customerId.value}/social-media`,
        })

    }

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
    customerForm.userForm.room_id = customer.user.room.id
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
const pageTitle = 'Step 4: Customer Medical Info'
onMounted(async () => {
    if (customerForm.dataUpdate.id != customerId.value) {

        await fetchCustomer()
    }
}
)


const validationSchema = toFormValidator(zod
    .object({
        blood_type:
            zod
                .string({

                }).optional()
        ,

        allergic:
            zod
                .any().optional(),
        chronic_diseases:
            zod
                .any().optional(),
        infectious_diseases:
            zod
                .any().optional(),
        smoking: zod.number().optional(),
        any_other_info: zod.any().optional(),
    }));

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
    var customer
    if (customerForm.dataUpdate.medical_info.id) {

        customer = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
    }
    else {
        console.log('true')
        customer = await addMedicalInfo(customerId.value, customerForm.medicalInfoForm)

    }

    if (customer.success) {
        // @ts-ignore
        notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} medical info was updated successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(customer.success)

    }


})



</script>

<template>
    <div class="page-content-inner">
        <form class="form-layout" @submit.prevent="onSubmitEdit()">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="blood_type">
                                    <VLabel>Blood Type</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentMedicalInfo" v-model="currentMedicalInfo.blood_type">
                                            <VOption value="">Blood Type</VOption>
                                            <VOption v-for="blood_type in MedicalInfoConsts.BLOOD_TYPES"
                                                :key="blood_type" :value="blood_type">{{ blood_type }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="blood_type" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="allergic">
                                    <VLabel>Allergic Reactions:</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentMedicalInfo.allergic" type="text" placeholder=""
                                            autocomplete="" />
                                        <ErrorMessage class="help is-danger" name="allergic" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="chronic_diseases">
                                    <VLabel>Chronic Diseases:</VLabel>
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
                                <VField id="infectious_diseases">
                                    <VLabel>Infectious Diseases:</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentMedicalInfo.infectious_diseases" type="text"
                                            placeholder="" autocomplete="" />
                                        <ErrorMessage class="help is-danger" name="infectious_diseases" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="smooking">
                                    <VLabel>Smoke?</VLabel>

                                    <VControl>
                                        <VRadio v-model="currentMedicalInfo.smoking" :value="MedicalInfoConsts.FALSE"
                                            :label="MedicalInfoConsts.showBoolean(MedicalInfoConsts.FALSE)"
                                            name="smooking" color="warning" />

                                        <VRadio v-model="currentMedicalInfo.smoking" :value="MedicalInfoConsts.TRUE"
                                            :label="MedicalInfoConsts.showBoolean(MedicalInfoConsts.TRUE)"
                                            name="smooking" color="success" />
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
                                    <VLabel>Other Info:</VLabel>
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

.is-navbar {
    .form-layout {
        margin-top: 30px;
    }
}

.filter {
    margin: 1rem;
}

.justify-content {
    display: flex;
    align-items: baseline;
}

.form-layout {
    &.is-split {
        max-width: 840px;

        .form-outer {
            .form-body {
                padding: 0;
                width: 100%;

                .form-section {
                    display: flex;
                    padding: 20px;

                    &.is-grey {
                        background: #fafafa;
                    }

                    .left,
                    .right {
                        padding: 20px 40px;
                        width: 50%;

                        h3 {
                            font-family: var(--font-alt);
                            font-weight: 600;
                            font-size: 0.95rem;
                            color: var(--dark-text);
                            margin-bottom: 20px;
                        }
                    }


                    .left {
                        width: 20%;
                        position: relative;
                        border-right: 1px solid var(--fade-grey-dark-3);

                        .operator {
                            position: absolute;
                            top: 17px;
                            right: -10px;
                            text-transform: uppercase;
                            font-family: var(--font);
                            font-weight: 500;
                            color: var(--dark-text);
                            background: var(--white);
                            padding: 4px 0;
                        }
                    }

                    .radio-pills {
                        display: flex;
                        justify-content: space-between;

                        .radio-pill {
                            position: relative;

                            input {
                                position: absolute;
                                top: 0;
                                left: 0;
                                height: 100%;
                                width: 100%;
                                opacity: 0;
                                cursor: pointer;

                                &:checked {
                                    +.radio-pill-inner {
                                        background: var(--primary);
                                        border-color: var(--primary);
                                        box-shadow: var(--primary-box-shadow);
                                        color: var(--white);
                                    }
                                }
                            }

                            .radio-pill-inner {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 60px;
                                height: 40px;
                                background: var(--white);
                                border: 1px solid var(--fade-grey-dark-3);
                                border-radius: 8px;
                                font-family: var(--font);
                                font-weight: 600;
                                font-size: 0.9rem;
                                transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                                    height 0.3s, width 0.3s;
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        &.is-grey {
                            background: var(--dark-sidebar-light-4) !important;
                        }

                        h3 {
                            color: var(--dark-dark-text);
                        }

                        .left {
                            border-color: var(--dark-sidebar-light-12) !important;

                            .operator {
                                background: var(--dark-sidebar-light-6) !important;
                                color: var(--dark-dark-text);
                            }

                            .radio-pills {
                                .radio-pill {
                                    input {
                                        &:checked+.radio-pill-inner {
                                            border-color: var(--primary);
                                            background: var(--primary);
                                            box-shadow: var(--primary-box-shadow);
                                            color: var(--smoke-white);
                                        }
                                    }

                                    .radio-pill-inner {
                                        background: var(--dark-sidebar-light-2);
                                        border-color: var(--dark-sidebar-light-12);
                                        color: var(--dark-dark-text);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        flex-direction: column;
                        padding-right: 0;
                        padding-left: 0;

                        .left,
                        .right {
                            width: 100%;
                            padding-right: 30px;
                            padding-left: 30px;
                        }


                        .left {
                            border-right: none;
                            border-bottom: 1px solid var(--fade-grey-dark-3);
                            padding-bottom: 40px;

                            .operator {
                                top: unset;
                                bottom: -14px;
                                left: 0;
                                right: 0;
                                margin: 0 auto;
                                text-align: center;
                                max-width: 60px;
                            }
                        }

                        .right {
                            padding-top: 30px;
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .form-layout {
        &.is-split {
            .form-outer {
                .form-body {
                    .form-section {
                        padding-right: 0;
                        padding-left: 0;
                    }
                }
            }
        }
    }
}
</style>
