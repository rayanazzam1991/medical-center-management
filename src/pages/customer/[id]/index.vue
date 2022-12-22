
<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { changeUserStatus } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { Customer, defaultCustomer, defaultCustomerProfilePic } from "/@src/models/CRM/Customer/customer"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getCustomer, getProfilePicture } from "/@src/services/CRM/Customer/customerService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { MedicalInfoConsts } from "/@src/models/CRM/MedicalInfo/medicalInfo"
import { useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { useCustomerForm } from "/@src/stores/CRM/Customer/customerFormSteps"
const route = useRoute()
const router = useRouter()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const viewWrapper = useViewWrapper()
const currentCustomer = ref<Customer>(defaultCustomer)
const customerId = ref(0)
const notif = useNotyf()
const customerForm = useCustomerForm()

const customerProfilePicture = ref(defaultCustomerProfilePic)

// @ts-ignore
customerId.value = route.params.id
viewWrapper.setPageTitle(`Customer`)
useHead({
    title: 'Customer',
})
const customerStore = useCustomer()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'Medical Info' | 'Social Media'
    }>(),
    {
        activeTab: 'Details',
    }
)
const tab = ref(props.activeTab)

const statusesList = ref<UserStatus[]>([])
onMounted(async () => {
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses
})
onMounted(async () => {
    await getCurrentCustomer()
    await getCurrentProfilePic()
    console.log(currentCustomer.value)
})
const getCurrentCustomer = async () => {
    const { customer } = await getCustomer(customerId.value)
    currentCustomer.value = customer

}

const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}
const changestatusUser = async () => {
    const userData = currentCustomer.value
    var userForm = currentChangeStatusUser.value
    userForm.id = userData.user.id
    userForm.user_status_id = userData.user?.status?.id
    await changeUserStatus(userForm)
    getCurrentCustomer()
    // @ts-ignore
    notif.dismissAll()
    await sleep(200);

    // @ts-ignore
    notif.success(`${currentCustomer.value.user.first_name} ${currentCustomer.value.user.last_name} was edited successfully`)
    // router.push({ path: `/employee/${userData.id}` })
    changeStatusPopup.value = false
}

const onClickEditSocialMedia = async () => {
    await fetchCustomer()
    router.push({
        path: `/customer-edit/${customerId.value}/social-media`
    })
}
const onClickEditMainInfo = async () => {
    await fetchCustomer()

    router.push({
        path: `/customer-edit/${customerId.value}/`
    })
}
const onClickEditMedicalInfo = async () => {
    await fetchCustomer()

    router.push({
        path: `/customer-edit/${customerId.value}/medical-info`
    })
}
const fetchCustomer = async () => {
    const { customer } = await getCustomer(customerId.value)
    customerForm.userForm.id = customer.user.id
    customerForm.userForm.first_name = customer.user.first_name
    customerForm.userForm.last_name = customer.user.last_name
    customerForm.userForm.gender = customer.user?.gender
    customerForm.userForm.birth_date = customer.user?.birth_date
    customerForm.userForm.phone_number = customer.user.phone_number
    customerForm.userForm.address = customer.user?.address
    customerForm.userForm.city_id = customer.user?.city?.id
    customerForm.userForm.room_id = undefined
    customerForm.userForm.user_status_id = customer.user?.status?.id
    customerForm.dataUpdate.emergency_contact_name = customer.emergency_contact_name
    customerForm.dataUpdate.emergency_contact_phone = customer.emergency_contact_phone
    customerForm.dataUpdate.customer_group_id = customer.customer_group.id
    customerForm.dataUpdate.id = customer.id
    customerForm.dataUpdate.user.id = customer.user.id
    if (customer.medical_info) {
        customerForm.medicalInfoForm.allergic = customer.medical_info.allergic
        customerForm.medicalInfoForm.any_other_info = customer.medical_info.any_other_info
        customerForm.medicalInfoForm.blood_type = customer.medical_info.blood_type
        customerForm.medicalInfoForm.chronic_diseases = customer.medical_info.chronic_diseases
        customerForm.medicalInfoForm.infectious_diseases = customer.medical_info.infectious_diseases
        customerForm.medicalInfoForm.smoking = customer.medical_info.smoking
        customerForm.medicalInfoForm.id = customer.medical_info.id
    }
    for (let i = 0; i < customer.social_medias.length; i++) {
        // @ts-ignore
        customerForm.customerSocialMediaForm.push({ social_media_id: customer.social_medias[i].id, url: customer.social_medias[i].url })
    }
}

const getCurrentProfilePic = async () => {
    var profile_pic = await getProfilePicture(customerId.value)
    await sleep(500)
    if (profile_pic.media.length != 0) {

        customerProfilePicture.value = profile_pic.media[profile_pic.media.length - 1]
    }
}

</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="customerStore.loading">
            <div class="profile-header has-text-centered">
                <!-- <VLoader size="large" class="v-avatar" :active="customerStore.loading">
                <VAvatar size="xl" :picture="customerProfilePicture?.relative_path" />
            </VLoader> -->
                <h3 class="title is-4 is-narrow is-thin">{{ currentCustomer.user.first_name }}
                    {{ currentCustomer.user.last_name }}
                </h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-p"></i>
                        <span>{{ currentCustomer.user?.city?.name }}</span>
                    </div>
                    <div class="separator"></div>
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>Status: <span
                                :class="currentCustomer.user.status.name == 'Pending' ? 'has-text-warning' : 'has-text-primary'">{{
                                        currentCustomer.user.status.name
                                }}</span></span>
                    </div>
                </div>
            </div>
        </VLoader>

        <div class="project-details">
            <div class="tabs-wrapper is-triple-slider">

                <div class="tabs-inner" :hidden="customerStore.loading">
                    <div class="tabs tabs-width ">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>Details</span></a>
                            </li>
                            <li :class="[tab === 'Medical Info' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Medical Info'"
                                    @click="tab = 'Medical Info'"><span>Medical Info </span></a>
                            </li>
                            <li :class="[tab === 'Social Media' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Social Media'"
                                    @click="tab = 'Social Media'"><span>Social Media </span></a>
                            </li>
                            <li class="tab-naver"></li>
                        </ul>
                    </div>
                </div>
                <div v-if="tab === 'Details'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Main Details</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton @click.prevent="onOpen" color="dark"> Change User Status
                                        </VButton>
                                        <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                            @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-user"></i>
                                        <h4>Customer Name</h4>
                                        <p>
                                            {{ currentCustomer.user.first_name }} {{ currentCustomer.user.last_name
                                            }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true"
                                            :class="currentCustomer.user.gender == 'Male' ? 'lnir lnir-male' : 'lnir lnir-female'"></i>
                                        <h4>Gender</h4>
                                        <p>
                                            {{ currentCustomer.user.gender }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-calendar"></i>
                                        <h4>Birth Date</h4>
                                        <p>
                                            {{ currentCustomer.user.birth_date }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-phone"></i>
                                        <h4>Phone Number</h4>
                                        <p> {{ currentCustomer.user.phone_number }}.
                                        </p>
                                    </div>
                                </div>

                                <div class="project-files">
                                    <h4>More Info</h4>
                                    <div class="columns is-multiline">
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Customer Group</span>
                                                    <span>
                                                        {{ currentCustomer.customer_group.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Address</span>
                                                    <span>
                                                        {{ currentCustomer.user.address }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Emergency Contact Name</span>
                                                    <span>
                                                        {{ currentCustomer.emergency_contact_name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Emergency Contact Phone</span>
                                                    <span>
                                                        {{ currentCustomer.emergency_contact_phone }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div v-if="tab === 'Medical Info'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Customer Medical Info</h3>
                                    </div>

                                    <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                        @click="onClickEditMedicalInfo" />
                                </div>

                                <div v-if="currentCustomer.medical_info" class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnir lnir-drop-alt"></i>
                                        <h4>Blood Type</h4>
                                        <p>
                                            {{ currentCustomer?.medical_info?.blood_type }}
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnir lnir-grow"></i>
                                        <h4>Smoke</h4>
                                        <p>
                                            {{ MedicalInfoConsts.showBoolean(currentCustomer?.medical_info?.smoking)
                                            }}.
                                        </p>
                                    </div>
                                </div>
                                <div v-else class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>Customer have no medical info...</h4>
                                    </div>
                                </div>


                                <div v-if="currentCustomer.medical_info" class="project-files">
                                    <h4>More Info</h4>
                                    <div class="columns is-multiline">
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Allergic</span>
                                                    <span>
                                                        {{ currentCustomer?.medical_info?.allergic }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Chronic Diseases</span>
                                                    <span>
                                                        {{ currentCustomer?.medical_info?.chronic_diseases }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Infectious Diseases</span>
                                                    <span>
                                                        {{ currentCustomer?.medical_info?.infectious_diseases }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Other Medical Info</span>
                                                    <span>
                                                        {{ currentCustomer?.medical_info?.any_other_info }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>


                    </div>
                </div>
                <div v-if="tab === 'Social Media'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Customer Social Media</h3>
                                    </div>

                                    <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                        @click="onClickEditSocialMedia" />
                                </div>

                                <div class="project-features">
                                    <div v-for="socialMedia in currentCustomer.social_medias" class="project-feature">
                                        <i aria-hidden="true" :class="socialMedia.icon"></i>
                                        <h4>{{ socialMedia.name }}</h4>
                                        <p class="has-text-centered">Customer URL:
                                            <span class="has-text-primary">{{ socialMedia.url }}</span>
                                        </p>
                                    </div>
                                    <div v-if="(currentCustomer.social_medias.length == 0)" class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>Customer have no social media...</h4>
                                    </div>

                                </div>

                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    </div>

    <VModal title="Change User Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VSelect v-if="currentCustomer.user.status"
                                        v-model="currentCustomer.user.status.id">
                                        <VOption value="">User Status</VOption>
                                        <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                                                status.name
                                        }}
                                        </VOption>
                                    </VSelect>
                                    <ErrorMessage name="user_status_id" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusUser()">Confirm</VButton>
        </template>
    </VModal>
</template>
  
<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
    min-width: 380px;
    min-height: 40px;

    .is-active {
        min-height: 40px;

    }
}

.tabs-wrapper.is-triple-slider .tabs li a,
.tabs-wrapper-alt.is-triple-slider .tabs li a {
    height: 40px;

}

.tabs li {
    min-height: 40px !important;

}
</style>
