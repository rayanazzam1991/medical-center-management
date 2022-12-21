<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { Contractor, defaultContractor, defaultContractorPersonalId } from "/@src/models/Contractor/contractor"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getContractor, getPersonalId } from "/@src/services/Contractor/contractorService"
import { changeUserStatus } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useContractor } from "/@src/stores/Contractor/contractorStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { useContractorForm } from "/@src/stores/Contractor/contractorFormSteps"


const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const currentContractor = ref<Contractor>(defaultContractor)
const contractorId = ref(0)
const contractorPersonalId = ref(defaultContractorPersonalId)
const contractorForm = useContractorForm()

const notif = useNotyf()

// @ts-ignore
contractorId.value = route.params.id
viewWrapper.setPageTitle(`Contractor`)
useHead({
    title: 'Contractor',
})
const contractorStore = useContractor()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'Services'
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
    await getCurrentContractor()
    await getCurrentPersonalId()

})
const getCurrentContractor = async () => {
    const { contractor } = await getContractor(contractorId.value)
    currentContractor.value = contractor
    console.log(currentContractor.value)

}
const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}
const changestatusUser = async () => {
    const userData = currentContractor.value
    var userForm = currentChangeStatusUser.value
    userForm.id = userData.user.id
    userForm.user_status_id = userData.user.status?.id
    console.log(userForm)
    await changeUserStatus(userForm)
    getCurrentContractor()
    // @ts-ignore
    notif.dismissAll()
    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} ${userData.first_name} was edited successfully`)
    changeStatusPopup.value = false
}
const fetchContractor = async () => {

    const { contractor } = await getContractor(contractorId.value)
    for (let i = 0; i < contractor.services.length; i++) {
        // @ts-ignore
        contractorForm.contractorServicesForm.push({ service_id: contractor.services[i].id, price: contractor.services[i].price, contractor_service_amount: contractor.services[i].contractor_service_amount })


    }


    contractorForm.userForm.id = contractor.user.id
    contractorForm.userForm.first_name = contractor.user.first_name
    contractorForm.userForm.last_name = contractor.user.last_name
    contractorForm.userForm.gender = contractor.user.gender
    contractorForm.userForm.birth_date = contractor.user.birth_date
    contractorForm.userForm.phone_number = contractor.user.phone_number
    contractorForm.userForm.address = contractor.user.address
    contractorForm.userForm.room_id = contractor.user.room.id
    contractorForm.userForm.city_id = contractor.user.city.id
    contractorForm.userForm.user_status_id = contractor.user.status.id
    contractorForm.dataUpdate.starting_date = contractor.starting_date
    contractorForm.dataUpdate.payment_percentage = contractor.payment_percentage
    contractorForm.dataUpdate.id = contractorId.value


}

const onClickEditServices = async () => {
    await fetchContractor()
    router.push({
        path: `/contractor-edit/${contractorId.value}/services`
    })
}
const onClickEditMainInfo = async () => {
    await fetchContractor()
    router.push({
        path: `/contractor-edit/${contractorId.value}/`
    })
}
const getCurrentPersonalId = async () => {
    var personal_id = await getPersonalId(contractorId.value)
    await sleep(500)
    if (personal_id.media.length != 0)
        contractorPersonalId.value = personal_id.media[personal_id.media.length - 1]
}

</script>
<template>
    <div class="profile-wrapper">
        <div class="profile-header has-text-centered">
            <VLoader size="large" class="v-avatar" :active="contractorStore.loading">
                <VAvatar size="xl" :picture="contractorPersonalId?.relative_path" squared />
            </VLoader>

            <h3 class="title is-4 is-narrow is-thin">{{ currentContractor.user.first_name }}
                {{ currentContractor.user.last_name }}</h3>
            <div class="profile-stats">
                <div class="profile-stat">
                    <i aria-hidden="true" class="fas fa-city"></i>
                    <span>{{ currentContractor.user.city.name }}</span>
                </div>
                <div class="separator"></div>
                <div class="profile-stat">
                    <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                    <span>Status: <span
                            :class="currentContractor.user.status.name == 'Busy' ? 'has-text-danger' : 'has-text-primary'">{{
                                    currentContractor.user.status.name
                            }}</span></span>
                </div>
                <div class="separator"></div>
            </div>
        </div>
        <div class="project-details">
            <div class="tabs-wrapper is-slider">

                <div class="tabs-inner">
                    <div class="tabs tabs-width ">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>Details</span></a>
                            </li>
                            <li :class="[tab === 'Services' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Services'"
                                    @click="tab = 'Services'"><span>Services </span></a>
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
                                        <h4>Contractor Name</h4>
                                        <p>
                                            {{ currentContractor.user.first_name }} {{ currentContractor.user.last_name
                                            }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true"
                                            :class="currentContractor.user.gender == 'Male' ? 'lnir lnir-male' : 'lnir lnir-female'"></i>
                                        <h4>Gender</h4>
                                        <p>
                                            {{ currentContractor.user.gender }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-calendar"></i>
                                        <h4>Birth Date</h4>
                                        <p>
                                            {{ currentContractor.user.birth_date }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-phone"></i>
                                        <h4>Phone Number</h4>
                                        <p> {{ currentContractor.user.phone_number }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="fas fa-percentage"></i>
                                        <h4>Payment Percentage</h4>
                                        <p> {{ currentContractor.payment_percentage }}%
                                        </p>
                                    </div>
                                </div>

                                <div class="project-files">
                                    <h4>More Info</h4>
                                    <div class="columns is-multiline">
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Starting Date</span>
                                                    <span>
                                                        {{ currentContractor.starting_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Address</span>
                                                    <span>
                                                        {{ currentContractor.user.address }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>City</span>
                                                    <span>
                                                        {{ currentContractor.user.city.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Room Number</span>
                                                    <span>
                                                        {{ currentContractor?.user?.room?.number }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Room Floor</span>
                                                    <span>
                                                        {{ currentContractor?.user?.room?.floor }}
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
                <div v-if="tab === 'Services'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Contractor Services</h3>
                                    </div>

                                    <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                        @click="onClickEditServices" />
                                </div>

                                <div class="project-features">
                                    <div :key="service.id" v-for="service in currentContractor.services"
                                        class="project-feature">
                                        <h4>{{ service.name }}</h4>
                                        <p class="has-text-centered">Contractor Price:
                                            <span class="has-text-primary">{{ service.price }}</span>
                                        </p>
                                        <p class="has-text-centered">Contractor service amount:
                                            <span class="has-text-primary">{{ service.contractor_service_amount
                                            }}</span>
                                        </p>
                                    </div>
                                    <div v-if="(currentContractor.services.length == 0)" class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>Contractor have no services for now...</h4>
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
                                    <VSelect v-if="currentContractor.user.status"
                                        v-model="currentContractor.user.status.id">
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
    min-width: 350px;
    min-height: 40px;

    .is-active {
        min-height: 40px;

    }
}

.tabs-wrapper .tabs li a,
.tabs-wrapper-alt .tabs li a {
    height: 40px;

}

.tabs li {
    min-height: 40px !important;

}
</style>
  