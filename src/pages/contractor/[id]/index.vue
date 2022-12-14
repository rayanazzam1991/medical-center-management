
<script setup lang="ts">

import { useHead } from "@vueuse/head"
import { changeUserStatus } from "/@src/composable/Others/User/changeUserStatus"
import { getUserStatusesList } from "/@src/composable/Others/UserStatus/getUserStatusesList"
import { useNotyf } from "/@src/composable/useNotyf"
import { Contractor, defaultContractor, defaultContractorPersonalId } from "/@src/models/Contractor/contractor"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getContractor, getPersonalId } from "/@src/services/Contractor/contractorService"
import { useViewWrapper } from "/@src/stores/viewWrapper"


const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const currentContractor = ref<Contractor>(defaultContractor)
const contractorId = ref(0)
const contractorPersonalId = ref(defaultContractorPersonalId)

const notif = useNotyf()

// @ts-ignore
contractorId.value = route.params.id
viewWrapper.setPageTitle(`Contractor`)
useHead({
    title: 'Contractor',
})
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
    // router.push({ path: `/contractor/${userData.id}` })
    changeStatusPopup.value = false
}

const onClickEditServices = () => {
    router.push({
        path: `/contractor-edit/${contractorId.value}/services`
    })
}
const onClickEditMainInfo = () => {
    router.push({
        path: `/contractor-edit/${contractorId.value}/`
    })
}
const getCurrentPersonalId = async () => {
    var personal_id = await getPersonalId(contractorId.value)
    if (personal_id.media.length != 1)
        contractorPersonalId.value = personal_id.media[personal_id.media.length - 1]
}

</script>
<template>
    <div class="profile-wrapper">
        <div class="profile-header has-text-centered">
            <VAvatar size="xl" :picture="contractorPersonalId?.relative_path" squared />

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
                    <div class="tabs ">
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
                                                        {{ currentContractor.user.room.number }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Room Floor</span>
                                                    <span>
                                                        {{ currentContractor.user.room.floor }}
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
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/profile-stats';

.is-navbar {
    .profile-wrapper {
        margin-top: 30px;
    }
}

.profile-wrapper {
    max-width: 1040px;
    margin: 0 auto;


    .profile-header {
        text-align: center;

        >img {
            display: block;
            margin: 0 auto;
            max-width: 300px;
        }

        .v-avatar {
            margin: 0 auto 12px;
        }

        .anim-icon {
            margin-bottom: 12px;
        }

        .title {
            margin-bottom: 6px;
        }

        p {
            font-size: 1rem;
            max-width: 540px;
            margin: 0 auto;
            line-height: 1.3;
        }
    }

}

.project-details {
    .tabs-wrapper {
        .tabs-inner {
            .tabs {
                display: list-item;
                margin: 0 auto;
                background: var(--white);
            }
        }
    }

    .project-details-inner {
        padding: 20px 0;

        .project-details-card {
            @include vuero-s-card;

            padding: 40px;

            .card-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;

                .title-wrap {
                    h3 {
                        font-family: var(--font-alt);
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--dark-text);
                        line-height: 1.2;
                        transition: all 0.3s; // transition-all test
                    }
                }
            }

            .project-overview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 0;

                p {
                    max-width: 420px;
                }
            }

            .project-features {
                display: flex;
                justify-content: center;
                padding: 25px 0;
                border-top: 1px solid var(--fade-grey-dark-3);
                border-bottom: 1px solid var(--fade-grey-dark-3);
                display: flex;
                justify-content: space-around;

                .project-feature {
                    margin-right: 20px;
                    width: calc(25% - 20px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    i {
                        font-size: 1.6rem;
                        color: var(--primary);
                        margin-bottom: 8px;
                    }

                    h4 {
                        font-family: var(--font-alt);
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: var(--dark);
                    }

                    p {
                        line-height: 1.2;
                        font-size: 0.85rem;
                        color: var(--light-text);
                        margin-bottom: 0;
                    }
                }
            }

            .project-files {
                padding: 20px 0;

                h4 {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: var(--primary);
                    margin-bottom: 12px;
                }

                .file-box {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    background: var(--white);
                    border: 1px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s; // transition-all test

                    &:hover {
                        border-color: var(--fade-grey-dark-3);
                        box-shadow: var(--light-box-shadow);
                    }

                    img {
                        display: block;
                        width: 48px;
                        min-width: 48px;
                        height: 48px;
                    }

                    .meta {
                        margin-left: 12px;
                        line-height: 1.3;

                        span {
                            display: block;

                            &:first-child {
                                font-family: var(--font-alt);
                                font-size: 0.9rem;
                                font-weight: 600;
                                color: var(--dark-text);
                            }

                            &:nth-child(2) {
                                font-size: 0.9rem;
                                color: var(--light-text);

                                i {
                                    position: relative;
                                    top: -3px;
                                    font-size: 0.3rem;
                                    color: var(--light-text);
                                    margin: 0 4px;
                                }
                            }
                        }
                    }

                    .dropdown {
                        margin-left: auto;
                    }
                }
            }
        }

        .side-card {
            @include vuero-s-card;

            padding: 40px;
            margin-bottom: 1.5rem;

            h4 {
                font-family: var(--font-alt);
                font-weight: 600;
                font-size: 0.8rem;
                text-transform: uppercase;
                color: var(--primary);
                margin-bottom: 16px;
            }
        }

        .project-team-card {
            @include vuero-s-card;

            padding: 40px;
            max-width: 940px;
            display: block;
            margin: 0 auto;

            .column {
                padding: 1.5rem;

                &:nth-child(odd) {
                    border-right: 1px solid var(--fade-grey-dark-3);
                }

                &.has-border-bottom {
                    border-bottom: 1px solid var(--fade-grey-dark-3);
                }
            }
        }

        .task-grid {
            .grid-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;

                h3 {
                    font-family: var(--font-alt);
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--dark-text);
                    line-height: 1.2;
                }

                .filter {
                    display: flex;
                    align-items: center;
                    background: var(--white);
                    padding: 8px 24px;
                    border-radius: 100px;

                    >span {
                        font-family: var(--font-alt);
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: var(--dark-text);
                        margin-right: 20px;
                    }

                    .multiselect {
                        min-width: 140px;

                        .multiselect-input {
                            border: none;
                        }
                    }
                }
            }

            .task-card {
                @include vuero-s-card;

                min-height: 200px;
                display: flex !important;
                flex-direction: column;
                justify-content: space-between;
                padding: 30px;
                cursor: pointer;
                transition: all 0.3s; // transition-all test

                &:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--light-box-shadow);
                }

                .title-wrap {
                    h3 {
                        font-size: 1.1rem;
                        font-family: var(--font-alt);
                        font-weight: 600;
                        color: var(--dark-text);
                        line-height: 1.2;
                        margin-bottom: 4px;
                    }

                    span {
                        font-family: var(--font);
                        font-size: 0.9rem;
                        color: var(--light-text);
                    }
                }

                .content-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left {
                        .avatar-stack {
                            margin-bottom: 6px;
                        }

                        .attachments {
                            display: flex;
                            align-items: center;

                            i {
                                font-size: 15px;
                                color: var(--light-text);
                            }

                            span {
                                margin-left: 2px;
                                font-size: 0.9rem;
                                font-family: var(--font);
                                color: var(--light-text);
                            }
                        }
                    }
                }
            }
        }
    }
}

.is-dark {
    .profile-wrapper {
        .profile-header {
            .v-avatar {
                .badge {
                    border-color: var(--dark-sidebar-light-6);
                }
            }
        }

    }

    .icon-wrap,
    .icon-wrap.is-placeholder {
        background: var(--dark-sidebar-light-2) !important;
        border-color: var(--dark-sidebar-light-12) !important;
    }

    .project-details {
        .project-details-inner {
            .project-details-card {
                @include vuero-card--dark;

                .card-head {
                    .title-wrap {
                        h3 {
                            color: var(--dark-dark-text) !important;
                        }
                    }
                }

                .project-features {
                    border-color: var(--dark-sidebar-light-12);

                    .project-feature {
                        i {
                            color: var(--primary);
                        }

                        h4 {
                            color: var(--dark-dark-text);
                        }
                    }
                }

                .project-files {
                    h4 {
                        color: var(--primary);
                    }

                    .file-box {
                        background: var(--dark-sidebar-light-3);

                        &:hover,
                        &:focus {
                            border-color: var(--dark-sidebar-light-10);
                        }

                        .meta {
                            span {
                                &:first-child {
                                    color: var(--dark-dark-text);
                                }
                            }
                        }
                    }
                }
            }

            .side-card {
                @include vuero-card--dark;

                h4 {
                    color: var(--primary);
                }
            }

            .project-team-card {
                @include vuero-card--dark;

                .column {
                    border-color: var(--dark-sidebar-light-12);
                }
            }

            .task-grid {
                .grid-header {
                    h3 {
                        color: var(--dark-dark-text);
                    }

                    .filter {
                        background: var(--dark-sidebar-light-1) !important;
                        border-color: var(--dark-sidebar-light-4) !important;

                        >span {
                            color: var(--dark-dark-text);
                        }
                    }
                }

                .task-card {
                    @include vuero-card--dark;

                    .title-wrap {
                        h3 {
                            color: var(--dark-dark-text);
                        }
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 767px) {
    .profile-wrapper {
        .profile-body {
            .profile-card {
                padding: 20px;

                .profile-card-section {
                    .section-content {

                        .experience-wrapper,
                        .languages-wrapper,
                        .recommendations-wrapper {

                            .experience-item,
                            .languages-item,
                            .recommendations-item {
                                width: calc(100% - 16px);
                            }
                        }

                        .skills-wrapper {
                            .skills-item {
                                .people {
                                    .v-avatar {
                                        &:not(:last-child) {
                                            display: none !important;
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

    .project-details {
        .project-details-inner {
            .project-details-card {
                padding: 30px;

                .project-overview {
                    flex-direction: column;

                    p {
                        margin-bottom: 20px;
                    }
                }

                .project-features {
                    flex-wrap: wrap;
                    display: flex;
                    justify-content: space-around;

                    .project-feature {
                        width: calc(50% - 20px);
                        text-align: center;
                        margin: 0 10px;

                        &:first-child,
                        &:nth-child(2) {
                            margin-bottom: 20px;
                        }
                    }
                }
            }

            .project-team-card {
                padding: 30px;

                .column {
                    border-right: none !important;
                }
            }
        }
    }

}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
    .project-details {
        .project-details-inner {
            .project-details-card {
                .project-files {
                    .columns {
                        display: flex;

                        .column {
                            min-width: 50%;
                        }
                    }
                }
            }

            .project-team-card {
                .columns {
                    display: flex;

                    .column {
                        min-width: 50%;
                    }
                }
            }

            .task-grid {
                .columns {
                    display: flex;

                    .column {
                        min-width: 50%;
                    }
                }
            }
        }
    }
}
</style>
  