<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { ErrorMessage } from 'vee-validate'
import { RouterLink } from 'vue-router'
import { boolean, custom, string } from 'zod'
import { addCustomer } from '/@src/composable/CRM/Customer/addCustomer'
import { getSocialMediasList } from '/@src/composable/CRM/SocialMedia/getSocialMediasList'
import { useNotyf } from '/@src/composable/useNotyf'
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps'
import { defaultMedicalInfo } from '/@src/stores/CRM/MedicaInfo/medicalInfoStore'
import { defaultSocialMediaSearchFilter, useSocialMedia } from '/@src/stores/CRM/SocialMedia/socialMediaStore'
import { useCity } from '/@src/stores/Others/City/cityStore'
import { useCustomerGroup } from '/@src/stores/Others/CustomerGroup/customerGroupStore'
import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { defaultCreateUpdateUser } from '/@src/stores/Others/User/userStore'
import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { SocialMedia, SocialMediaSearchFilter } from '/@src/utils/api/CRM/SocialMedia'
import { MedicalInfoConsts } from '/@src/utils/consts/medicalInfo'





const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Review')
const head = useHead({
    title: 'Customer',
})
const notif = useNotyf()
const customerForm = useCustomerForm()
const city = useCity()
const room = useRoom()
const userStatus = useUserStatus()
const customerGroup = useCustomerGroup()
const socialMedia = useSocialMedia()
const cities = city.cities
const rooms = room.rooms
const userStatuses = userStatus.userstatuses
const customerGroups = customerGroup.customerGroups
const socialMedias = socialMedia.socialMedias

customerForm.setStep({
    number: 5,
    canNavigate: true,
    skipable: false,
    validateStepFn: async () => {
        await onSubmitAdd()
    },
    previousStepFn: async () => {
        router.push({
            path: '/customer-add/social-media',
        })
    },

})
const route = useRoute()
const router = useRouter()

const pageTitle = 'Customer Add Review'

const onSubmitAdd = async () => {

    // const customer = await addCustomer(customerForm.data, customerForm.userForm, customerForm.medicalInfoForm, customerForm.customerSocialMediaForm)
    // @ts-ignore
    notif.success(`${customerForm.userForm.first_name} ${customerForm.userForm.last_name} was added successfully`)
}






</script>

<template>
    <div id="wizard-step-6" class="inner-wrapper is-active" data-step-title="Preview">
        <div class="step-content">
            <div class="step-title">
                <h2 class="dark-inverted">Add Customer</h2>
            </div>

            <VLoader size="xl" class="project-preview-wrapper" grey>
                <div class="project-preview-header">
                    <VAvatar color="h-green" size="big" />

                    <h3 class="title is-4 is-narrow is-thin">
                        <span>{{ customerForm.userForm.first_name }} {{ customerForm.userForm.last_name }}</span>
                        <!-- <span v-else>Project Title Goes Here</span> -->

                        <RouterLink class="edit-icon" to="/customer-add">
                            <i aria-hidden="true" class="lnil lnil-pencil"></i>
                        </RouterLink>
                    </h3>
                </div>

                <div class="project-preview-body">
                    <div class="columns is-multiline">
                        <div class="column is-12 is-tablet-100">
                            <div class="edit-box m-b-20">
                                <h1 class="has-text-primary is-size-5">Main Info</h1>

                                <RouterLink class="edit-icon" to="/customer-add">
                                    <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                </RouterLink>
                                <div v-if="customerForm.userForm.first_name != ''" class="columns is-multiline">
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Birth date:</h2>
                                        <span>{{ customerForm.userForm.birth_date }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Phone Number:</h2>
                                        <span>{{ customerForm.userForm.phone_number }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Address:</h2>
                                        <p>{{ customerForm.userForm.address }}</p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Gender:</h2>
                                        <p>{{ customerForm.userForm.gender }}</p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">City:</h2>
                                        <p>{{ cities.find((city: any) => city.id == customerForm.userForm.city_id)?.name
                                        }}
                                        </p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Room #:</h2>
                                        <p>{{ rooms.find((room: any) => room.id ==
                                                customerForm.userForm.room_id)?.number
                                        }}
                                        </p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Status:</h2>
                                        <p>{{ userStatuses.find((userStatus: any) => userStatus.id ==
                                                customerForm.userForm.user_status_id)?.name
                                        }}</p>
                                    </div>
                                </div>
                                <h2 v-else class="has-text-grey "> No Data Entered.</h2>


                            </div>
                            <div class="edit-box m-b-20">
                                <h1 class="has-text-primary is-size-5">Additional Info</h1>

                                <RouterLink class="edit-icon" to="/customer-add/additional-info">
                                    <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                </RouterLink>
                                <div v-if="(customerForm.data.customer_group_id != 0)" class="columns is-multiline">
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Emergency Contact Name:</h2>
                                        <span>{{ customerForm.data.emergency_contact_name }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Emergency Contact Name:</h2>
                                        <span>{{ customerForm.data.emergency_contact_phone }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Customer Group:</h2>
                                        <p>{{ customerGroups.find((customerGroup: any) => customerGroup.id ==
                                                customerForm.data.customer_group_id)?.name
                                        }}</p>
                                    </div>
                                </div>
                                <h2 v-else class="has-text-grey "> No Data Entered.</h2>

                            </div>
                            <div class="edit-box m-b-20">
                                <h1 class="has-text-primary is-size-5">Medical Info</h1>

                                <RouterLink class="edit-icon" to="/customer-add/medical-info">
                                    <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                </RouterLink>
                                <div v-if="customerForm.medicalInfoForm.blood_type != ''" class="columns is-multiline">
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Blood Type:</h2>
                                        <span>{{ customerForm.medicalInfoForm.blood_type }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Allergic Reactions:</h2>
                                        <span>{{ customerForm.medicalInfoForm.allergic }}</span>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Chronic Diseases:</h2>
                                        <p>{{ customerForm.medicalInfoForm.chronic_diseases }}</p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Infectious Diseases:</h2>
                                        <p>{{ customerForm.medicalInfoForm.infectious_diseases }}</p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Smoke:</h2>
                                        <p>{{ MedicalInfoConsts.showBoolean(customerForm.medicalInfoForm.smoking) }}
                                        </p>
                                    </div>
                                    <div class="column is-4">

                                        <h2 class="has-text-secondary">Other medical info:</h2>
                                        <p>{{ customerForm.medicalInfoForm.any_other_info }}</p>
                                    </div>
                                </div>
                                <h2 v-else class="has-text-grey "> No Data Entered.</h2>


                            </div>
                            <div class="edit-box m-b-20">
                                <h1 class="has-text-primary is-size-5">Social Media</h1>

                                <RouterLink class="edit-icon" to="/customer-add/social-media">
                                    <i aria-hidden="true" class="lnil lnil-pencil"></i>
                                </RouterLink>

                                <div class="columns is-multiline">

                                    <div v-for="socialMedia in customerForm.customerSocialMediaForm"
                                        class="column is-4">

                                        <h2 class="has-text-secondary">{{ socialMedias.find((socialMediaElemnt: any) =>
                                                socialMediaElemnt.id == socialMedia.social_media_id)?.name
                                        }} URL:</h2>
                                        <span>{{ socialMedia.url }}</span>
                                    </div>
                                    <h2 v-if="(customerForm.customerSocialMediaForm.length == 0)"
                                        class="has-text-grey column is-4"> No Data Entered.</h2>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </VLoader>
        </div>
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
