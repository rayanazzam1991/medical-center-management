<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue';
import { addUser } from '/@src/composable/Others/User/addUser'
import { editUser } from '/@src/composable/Others/User/editUser'
import { User } from '/@src/utils/api/Others/User'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'
import { getUser } from '/@src/composable/Others/User/getUser'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useNotyf } from '/@src/composable/useNotyf';
import { toFormValidator } from '@vee-validate/zod';
import { useForm, ErrorMessage } from 'vee-validate';
import { boolean, optional, z as zod } from 'zod'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartment, defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
import { defaultCreateUpdateUser, defaultUser } from '/@src/stores/Others/User/userStore';
import { defaultCity, defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore';
import { defaultRoom, defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore';
import { defaultUserStatus, defaultUserStatusSearchFilter } from '/@src/stores/Others/UserStatus/userStatusStore';
import { UserStatus } from '/@src/utils/api/Others/UserStatus';
import { getCitiesList } from '/@src/composable/Others/City/getCitiesList';
import { City } from '/@src/utils/api/Others/City';
import { Room } from '/@src/utils/api/Others/Room';
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList';
import { getUserStatusesList } from '/@src/composable/Others/UserStatus/getUserStatusesList';
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps';
import { getCustomerGroupsList } from '/@src/composable/Others/CustomerGroup/getCustomerGroupsList';
import { defaultCustomerGroup, defaultCustomerGroupSearchFilter } from '/@src/stores/Others/CustomerGroup/customerGroupStore';
import { CustomerGroup } from '/@src/utils/api/Others/CustomerGroup';
import { MedicalInfoConsts } from '/@src/utils/consts/medicalInfo'
import { defaultSocialMedia, defaultSocialMediaSearchFilter } from '/@src/stores/CRM/SocialMedia/socialMediaStore';
import { SocialMedia } from '/@src/utils/api/CRM/SocialMedia';
import { CreateUpdateCustomerSocialMediaHelper } from '/@src/utils/api/CRM/Customer';
import { defaultUpdateCustomer } from '/@src/stores/CRM/Customer/customerStore';
import { defaultMedicalInfo } from '/@src/stores/CRM/MedicaInfo/medicalInfoStore';
import { addSocialMedia } from '/@src/composable/CRM/SocialMedia/addSocialMedia';
import { addSocialMediasToCustomer } from '/@src/composable/CRM/Customer/addSocialMediasToCustomer';
import { getCustomer } from '/@src/composable/CRM/Customer/getCustomer';
import { getSocialMediasList } from '/@src/composable/CRM/SocialMedia/getSocialMediasList';
import { updateCustomer } from '/@src/composable/CRM/Customer/updateCustomer';

const viewWrapper = useViewWrapper()
const route = useRoute()
const router = useRouter()
const customerId = ref<number>(0)
// @ts-ignore
customerId.value = route.params?.id

viewWrapper.setPageTitle('Customer Social Media')
const head = useHead({
    title: 'Customer',
})
const notif = useNotyf()
const customerForm = useCustomerForm()
customerForm.setStep({
    number: 4,
    canNavigate: true,
    skipable: true,
    validateStepFn: async () => {
        var isValid = await onSubmitEdit()
        console.log(isValid)
        if (isValid) {
            router.push({
                path: `/customer/${customerId.value}`,
            })
        }

    },
    skipStepFn: async () => {
        customerForm.customerSocialMediaForm.splice(0, customerForm.customerSocialMediaForm.length)
        router.push({
            path: `/customer/${customerId.value}`,
        })
    }

})
const pageTitle = 'Step 5: Customer Social Media'
const socialMedias2 = ref<SocialMedia[]>([])
interface SocialMediaChecked {
    socialMedia: SocialMedia
    checked: boolean
    url: string
}

const fetchCustomer = async () => {

    const { customer } = await getCustomer(customerId.value)
    for (let i = 0; i < customer.social_medias.length; i++) {
        // @ts-ignore

        customerForm.customerSocialMediaForm.push({ social_media_id: customer.social_medias[i].id, url: customer.social_medias[i].url })

    }

    customerForm.medicalInfoForm.allergic = customer.medical_info.allergic
    customerForm.medicalInfoForm.any_other_info = customer.medical_info.any_other_info
    customerForm.medicalInfoForm.blood_type = customer.medical_info.blood_type
    customerForm.medicalInfoForm.chronic_diseases = customer.medical_info.chronic_diseases
    customerForm.medicalInfoForm.infectious_diseases = customer.medical_info.infectious_diseases
    customerForm.medicalInfoForm.smoking = customer.medical_info.smoking
    customerForm.medicalInfoForm.id = customer.medical_info.id

    customerForm.userForm.id = customer.user.id
    customerForm.userForm.first_name = customer.user.first_name
    customerForm.userForm.last_name = customer.user.last_name
    customerForm.userForm.gender = customer.user.gender
    customerForm.userForm.birth_date = customer.user.birth_date
    customerForm.userForm.phone_number = customer.user.phone_number
    customerForm.userForm.address = customer.user.address
    customerForm.userForm.room_id = customer.user.room.id
    customerForm.userForm.city_id = customer.user.status.id
    customerForm.userForm.user_status_id = customer.user.status.id
    customerForm.dataUpdate.emergency_contact_name = customer.emergency_contact_name
    customerForm.dataUpdate.emergency_contact_phone = customer.emergency_contact_phone
    customerForm.dataUpdate.customer_group_id = customer.customer_group.id
    customerForm.dataUpdate.id = customerId.value



}



const socialMediaChecked = ref<SocialMediaChecked[]>([])
onMounted(async () => {
    const { socialMedias } = await getSocialMediasList(defaultSocialMediaSearchFilter)
    socialMedias2.value = socialMedias
    if (customerForm.dataUpdate.id != customerId.value) {

        await fetchCustomer()
    }


    for (let index = 0; index < socialMedias2.value.length; index++) {
        // @ts-ignore
        var socialMedia = customerForm.customerSocialMediaForm.find((element) => element.social_media_id == socialMedias2.value[index].id)
        if (socialMedia) {

            socialMediaChecked.value.push({ socialMedia: socialMedias2.value[index], checked: true, url: socialMedia.url })
        }
        else {
            socialMediaChecked.value.push({ socialMedia: socialMedias2.value[index], checked: false, url: '' })
        }

    }


})



const onSubmitEdit = async () => {
    customerForm.customerSocialMediaForm.splice(0, customerForm.customerSocialMediaForm.length)
    for (let i = 0; i < socialMediaChecked.value.length; i++) {
        if (socialMediaChecked.value[i].checked == true) {
            customerForm.customerSocialMediaForm.push({ social_media_id: socialMediaChecked.value[i].socialMedia.id as number, url: socialMediaChecked.value[i].url })

        }

    }
    customerForm.dataUpdate.is_completed = true
    const customer = await updateCustomer(customerId.value, customerForm.dataUpdate, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
    if (customer.success) {
        // @ts-ignore
        notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} social medias was added successfully`)

        return true
    }
    else {
        // @ts-ignore

        notif.error(customer.success)

    }

}




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

                                <VField>

                                    <VControl v-for="socialMedia in socialMediaChecked" raw nogrow subcontrol>
                                        <VCheckbox :label="socialMedia.socialMedia.name"
                                            :name="socialMedia.socialMedia.id" color="primary"
                                            :key="socialMedia.socialMedia.id" v-model="socialMedia.checked" />
                                        <VIcon :icon="socialMedia.socialMedia.icon"
                                            class="has-text-primary is-size-5" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField v-for="socialMedia in socialMediaChecked" :id="socialMedia.socialMedia.name">

                                    <VLabel v-if="socialMedia.checked">Customer's {{ socialMedia.socialMedia.name }}
                                        URL:
                                    </VLabel>
                                    <VControl v-if="socialMedia.checked" icon="feather:chevrons-right">
                                        <VInput type="text" placeholder="" autocomplete="" v-model="socialMedia.url"
                                            :key="socialMedia.socialMedia.id" />

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
