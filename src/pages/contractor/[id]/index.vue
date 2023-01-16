<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { Contractor, defaultContractor, defaultContractorProfilePic } from "/@src/models/Contractor/contractor"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getContractor, getContractorFiles, getProfilePicture, addContractorFile, deleteFile, addProfilePicture } from "/@src/services/Contractor/contractorService"
import { changeUserStatus } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useContractor } from "/@src/stores/Contractor/contractorStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { useContractorForm } from "/@src/stores/Contractor/contractorFormSteps"
import { Media, MediaConsts } from "/@src/models/Others/Media/media"
import {useI18n} from "vue-i18n";
import { Notyf } from "notyf"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const currentContractor = ref<Contractor>(defaultContractor)
const contractorId = ref(0)
const deleteFilePopup = ref(false)
const deleteFileId = ref()
const contractorProfilePicture = ref(defaultContractorProfilePic)
const contractorFiles = ref<Array<Media>>([])
const filesToUpload = ref<File>()
const profilePictureToUpload = ref<File>()
const updateProfilePicturePopup = ref(false)
const keyIncrement = ref(1)
const loading = ref(false)
const uploadLoading = ref(false)
const deleteLoading = ref(false)
const contractorForm = useContractorForm()

const notif = useNotyf() as Notyf

// @ts-ignore
contractorId.value = route.params.id
viewWrapper.setPageTitle(t('contractor.details.title'))
useHead({
    title: t('contractor.details.title'),
})
const contractorStore = useContractor()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'Services' | 'Files'
    }>(),
    {
        activeTab: 'Details',
    }
)
const tab = ref(props.activeTab)
if (route.query.tab === 'Details' || route.query.tab === 'Services' || route.query.tab === 'Files') {
    tab.value = route.query.tab
}

const statusesList = ref<UserStatus[]>([])
onMounted(async () => {
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses
})
onMounted(async () => {
    loading.value = true

    await getCurrentContractor()
    await fetchCurrentProfilePic()
    await fetchContractorFiles()
    loading.value = false


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
    await changeUserStatus(userForm)
    getCurrentContractor()
    // @ts-ignore
    notif.dismissAll()
    await sleep(200);
    notif.success(t('toast.success.edit'))
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
    contractorForm.dataUpdate.end_date = contractor.end_date
    contractorForm.dataUpdate.speciality_id = contractor.speciality.id ?? 0
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
const fetchCurrentProfilePic = async () => {
    let profile_pic = await getProfilePicture(contractorId.value)
    await sleep(500)
    if (profile_pic.media.length != 0) {

        contractorProfilePicture.value = profile_pic.media[profile_pic.media.length - 1]
    }

}
const fetchContractorFiles = async () => {
    const { media } = await getContractorFiles(contractorId.value)
    await sleep(500)
    if (media.length != 0) {
        media.forEach(mediaElemnt => {
            contractorFiles.value.push(mediaElemnt)
        });
    }
}

const onAddFile = async (event: any) => {
    const _file = event.target.files[0] as File
    let _message = ''
    if (_file) {

        if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
            _message = t('toast.file.type')
            await sleep(200);
            notif.error(_message)


        } else if (_file.size > (2 * 1024 * 1024)) {
            _message = t('toast.file.size')
            await sleep(200);
            notif.error(_message)

        } else {

            filesToUpload.value = _file

        }
    }

}
const UploadFile = async () => {
    uploadLoading.value = true
    let formData = new FormData();
    if (filesToUpload.value != undefined)
        formData.append('images[]', filesToUpload.value);

    const { success, message, media } = await addContractorFile(contractorId.value, formData)

    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.add'))
        media[0].file_name = media[0].relative_path
        media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

        contractorFiles.value.push(media[0])
        filesToUpload.value = undefined
        uploadLoading.value = false

        return true
    }
    else {

        // @ts-ignore
        await sleep(200);

        notif.error(message)
        filesToUpload.value = undefined
        uploadLoading.value = false

    }

}

const onDeleteFile = (file_id: number) => {
    deleteFilePopup.value = true
    deleteFileId.value = file_id

}
const removefile = async () => {
    deleteLoading.value = true
    const { message, success } = await deleteFile(deleteFileId.value)

    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(t('toast.success.remove'))

        contractorFiles.value.splice(contractorFiles.value.findIndex((element) => element.id == deleteFileId.value), 1)
        deleteFilePopup.value = false
        deleteLoading.value = false

        return true
    }
    else {
        deleteLoading.value = false

        // @ts-ignore
        await sleep(200);

        notif.error(message)

    }

}

const editProfilePicture = async () => {
    updateProfilePicturePopup.value = true

}
const onEditProfilePicture = async (error: any, fileInfo: any) => {
    if (error) {
        // @ts-ignore
        await sleep(200);

        notif.error(`${error.main}: ${error.sub}`)
        return

    }

    let _message = ''
    const _file = fileInfo.file as File

    if (_file) {

        if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
            _message = t('toast.file.type')
            await sleep(200);
            notif.error(_message)


        } else if (_file.size > (2 * 1024 * 1024)) {
            _message = t('toast.file.size')
            await sleep(200);
            notif.error(_message)

        } else {

            profilePictureToUpload.value = _file
        }
    }
}
const UploadProfilePicture = async () => {
    uploadLoading.value = true

    let _success = true
    let _message = ''
    if (contractorProfilePicture.value.id != undefined && profilePictureToUpload.value == undefined) {
        const { message, success } = await deleteFile(contractorProfilePicture.value.id)
        _success = success
        _message = message
    } else if (contractorProfilePicture.value.id != undefined || profilePictureToUpload.value == undefined) {
        _success = false
        _message = 'Please select a valid image to be uploaded'
    }
    if (_success) {

        let formData = new FormData();
        if (profilePictureToUpload.value != undefined)
            formData.append('images[]', profilePictureToUpload.value);

        const { success, message, media } = await addProfilePicture(contractorId.value, formData)

        if (success) {
            // @ts-ignore
            await sleep(200);

            notif.success(t('toast.success.edit'))
            contractorProfilePicture.value = media[0]
            contractorProfilePicture.value.relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path
            profilePictureToUpload.value = undefined

            keyIncrement.value++
            updateProfilePicturePopup.value = false
            uploadLoading.value = false


        }
        else {
            // @ts-ignore
            await sleep(200);
            profilePictureToUpload.value = undefined

            notif.error(message)
            keyIncrement.value++
            uploadLoading.value = false
            updateProfilePicturePopup.value = false

        }
    } else {
        // @ts-ignore
        await sleep(200);
        notif.error(_message)
        keyIncrement.value++
        uploadLoading.value = false
        updateProfilePicturePopup.value = false
        profilePictureToUpload.value = undefined


    }


}
const RemoveProfilePicture = async () => {
    if (contractorProfilePicture.value.id != undefined) {
        deleteLoading.value = true

        const { message, success } = await deleteFile(contractorProfilePicture.value.id)
        if (success) {
            await sleep(200);
            notif.success(t('toast.success.remove'))
            contractorProfilePicture.value = defaultContractorProfilePic
            deleteLoading.value = false


        } else {
            deleteLoading.value = false
            await sleep(200);
            notif.error(message)

        }
        profilePictureToUpload.value = undefined
        keyIncrement.value++
        updateProfilePicturePopup.value = false
    }
}

</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">

            <div class="profile-header has-text-centered">
                <VAvatar v-if="contractorProfilePicture.id == undefined" size="xl"
                    :picture="MediaConsts.getAvatarIcon(currentContractor.user.gender)" edit
                    @edit="editProfilePicture" />
                <VAvatar v-else size="xl" :picture="contractorProfilePicture.relative_path" edit
                    @edit="editProfilePicture" />

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
                        <span>{{t('contractor.details.status')}}: <span
                                :class="currentContractor.user.status.name == 'Busy' ? 'has-text-danger' : 'has-text-primary'">{{
        currentContractor.user.status.name
}}</span></span>
                    </div>
                    <div class="separator"></div>
                </div>
            </div>
        </VLoader>

        <div class="project-details">
            <div class="tabs-wrapper is-triple-slider">

                <div :hidden="loading" class="tabs-inner">
                    <div class="tabs tabs-width">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>{{t('contractor.details.tabs.details')}}</span></a>
                            </li>
                            <li :class="[tab === 'Services' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Services'"
                                    @click="tab = 'Services'"><span>{{t('contractor.details.tabs.services')}}</span></a>
                            </li>
                            <li :class="[tab === 'Files' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Files'"
                                    @click="tab = 'Files'"><span>{{t('contractor.details.tabs.files')}} </span></a>
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
                                        <VButton @click.prevent="onOpen" color="dark"> {{t('contractor.table.modal_title')}}
                                        </VButton>
                                        <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                            @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-user"></i>
                                        <h4>{{t('contractor.details.name',{title :viewWrapper.pageTitle  })}}</h4>
                                        <p>
                                            {{ currentContractor.user.first_name }} {{
        currentContractor.user.last_name
}}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i class="fas fa-medal" aria-hidden="true"></i>
                                        <h4>{{t('contractor.details.speciality',{title :viewWrapper.pageTitle  })}}</h4>
                                        <p>
                                            {{ currentContractor.speciality.name }}
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true"
                                            :class="currentContractor.user.gender == 'Male' ? 'lnir lnir-male' : 'lnir lnir-female'"></i>
                                        <h4>{{t('contractor.details.gender')}}</h4>
                                        <p>
                                            {{ currentContractor.user.gender }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-calendar"></i>
                                        <h4>{{t('contractor.details.birth_date')}}</h4>
                                        <p>
                                            {{ currentContractor.user.birth_date }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-phone"></i>
                                        <h4>{{t('contractor.details.phone_number')}}</h4>
                                        <p> {{ currentContractor.user.phone_number }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="fas fa-percentage"></i>
                                        <h4>{{t('contractor.details.payment_percentage')}}</h4>
                                        <p> {{ currentContractor.payment_percentage }}%
                                        </p>
                                    </div>
                                </div>

                                <div class="project-files">
                                    <h4>More Info</h4>
                                    <div class="columns is-multiline">
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{t('contractor.details.starting_date')}}</span>
                                                    <span>
                                                        {{ currentContractor.starting_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{t('contractor.details.end_date')}}</span>
                                                    <span>
                                                        {{ currentContractor.end_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{t('contractor.details.department')}}</span>
                                                    <span>
                                                        {{ currentContractor?.user?.room?.department?.name }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{t('contractor.details.room_number')}}</span>
                                                    <span>
                                                        {{ currentContractor?.user?.room?.number }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{t('contractor.details.address')}}</span>
                                                    <span>
                                                        {{ currentContractor.user.address }}
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
                                        <h3>{{t('contractor.details.service')}}</h3>
                                    </div>

                                    <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                        @click="onClickEditServices" />
                                </div>

                                <div class="project-features">
                                    <div :key="service.id" v-for="service in currentContractor.services"
                                        class="project-feature">
                                        <h4>{{ service.name }}</h4>
                                        <p class="has-text-centered">{{t('contractor.details.price',{title :viewWrapper.pageTitle  })}}:
                                            <span class="has-text-primary">{{ service.price }}</span>
                                        </p>
                                        <p class="has-text-centered">{{t('contractor.details.service_ammount',{title :viewWrapper.pageTitle  })}}:
                                            <span class="has-text-primary">{{ service.contractor_service_amount
}}</span>
                                        </p>
                                    </div>
                                    <div v-if="(currentContractor.services.length == 0)" class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>{{ t('contractor.details.tabs_content_placeholder.service') }}</h4>
                                    </div>

                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                <div v-if="tab === 'Files'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>{{t('contractor.details.file')}}</h3>
                                    </div>

                                </div>
                                <div v-if="contractorFiles.length == 0" class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>{{ t('contractor.details.tabs_content_placeholder.files') }}</h4>
                                    </div>

                                </div>


                                <div class="project-files project-section">
                                    <h4>{{t('contractor.details.upload_file')}}</h4>
                                    <div class="is-flex is-justify-content-space-between ">
                                        <VField class="mr-6" grouped>
                                            <VControl>
                                                <div class="file has-name">
                                                    <label class="file-label">
                                                        <input class="file-input" type="file" v-on:change="onAddFile" />
                                                        <span class="file-cta">
                                                            <span class="file-icon">
                                                                <i class="fas fa-cloud-upload-alt"></i>
                                                            </span>
                                                            <span class="file-label"> {{t('contractor.details.choose_file')}}</span>
                                                        </span>
                                                        <span class="file-name light-text"> {{ filesToUpload?.name ??
        'Select File'
}}
                                                        </span>
                                                    </label>
                                                </div>
                                            </VControl>
                                        </VField>
                                        <VLoader size="small" :active="uploadLoading">
                                            <VButton v-if="filesToUpload != undefined" @click="UploadFile" class=""
                                                icon="lnir lnir-add-files rem-100" light dark-outlined>
                                                {{t('contractor.details.upload')}}
                                            </VButton>
                                        </VLoader>
                                    </div>
                                    <h6 class="ml-2 mt-2 help">{{ t('contractor.details.accepted_file') }}
                                    </h6>
                                </div>
                                <div v-if="contractorFiles.length != 0" class="project-files project-section">
                                    <div>
                                        <h4>{{t('contractor.details.tabs.files')}}</h4>
                                        <div class="columns is-multiline">
                                            <div v-for="file in contractorFiles" class="column is-6">
                                                <div class="file-box">
                                                    <img :src="MediaConsts.getMediaIcon(file.mime_type ?? '')" alt="" />
                                                    <div class="meta">
                                                        <span class="file-link"> <a target="_blank" class="file-link"
                                                                :href="file.relative_path"> {{
        file.file_name
}}</a>
                                                        </span>
                                                        <span>
                                                            {{ file.size != undefined ? (file.size / (1024 *
        1024)).toFixed(2) :
        'Unknown'
}} {{ file.size != undefined ? 'MB' : '' }} <i
                                                                aria-hidden="true" class="fas fa-circle"></i> {{
        file.created_at
}}
                              <i aria-hidden="true" class="fas fa-circle"></i>
                              By: {{ file.uploaded_by.first_name }}{{ file.uploaded_by.last_name }}
    
                                                        </span>
                                                    </div>
                                                    <VIconButton v-if="file.id"
                                                        class="is-right is-dots is-spaced dropdown end-action mr-2"
                                                        size="small" icon="feather:trash" tabindex="0" color="danger"
                                                        @click="onDeleteFile(file.id ?? 0)" />


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    </div>
    <VModal :title="t('contractor.table.modal_title.status')" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{t('contractor.details.status',{title :viewWrapper.pageTitle  })}}</VLabel>
                                <VControl>
                                    <VSelect v-if="currentContractor.user.status"
                                        v-model="currentContractor.user.status.id">
                                        <VOption value="">{{t('contractor.details.user_status')}}</VOption>
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
            <VButton color="primary" raised @click="changestatusUser()">{{ t('modal.buttons.confirm') }}</VButton>
        </template>
    </VModal>
    <VModal :title="t('contractor.table.modal_title.delete_file')" :open="deleteFilePopup" actions="center" @close="deleteFilePopup = false">
        <template #content>
            <VPlaceholderSection :title="t('contractor.table.modal_title.placeholderSection.title')" :subtitle="t('contractor.table.modal_title.placeholderSection.subtitle')" />
        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="deleteLoading">
                <VButton color="primary" raised @click="removefile()">{{ t('modal.buttons.confirm') }}</VButton>
            </VLoader>
        </template>
    </VModal>
    <VModal :key="keyIncrement" :title="t('contractor.table.modal_title.profile_picture')" :open="updateProfilePicturePopup" actions="center"
        @close="updateProfilePicturePopup = false">
        <template #content>
            <VField class="is-flex is-justify-content-center">
                <VControl>
                    <VFilePond size="large" class="profile-filepond" name="profile_filepond"
                        :chunk-retry-delays="[500, 1000, 3000]" label-idle="<i class='lnil lnil-cloud-upload'></i>"
                        :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']" :image-preview-height="140"
                        :image-resize-target-width="140" :image-resize-target-height="140" image-crop-aspect-ratio="1:1"
                        style-panel-layout="compact circle" style-load-indicator-position="center bottom"
                        style-progress-indicator-position="right bottom" style-button-remove-item-position="left bottom"
                        style-button-process-item-position="right bottom" @addfile="onEditProfilePicture" />

                </VControl>
            </VField>
            <h6 class="is-flex is-justify-content-center help">{{ t('contractor.details.accepted_file') }}
            </h6>

        </template>

        <template #action="{ close }">
            <VLoader size="small" :active="deleteLoading">

                <VButton v-if="contractorProfilePicture.id != undefined" color="danger" outlined class="mr-2"
                    @click="RemoveProfilePicture">
                    >{{ t('modal.buttons.delete') }}</VButton>
            </VLoader>
            <VLoader size="small" :active="uploadLoading">

                <VButton color="primary" raised @click="UploadProfilePicture">{{ t('modal.buttons.update') }}</VButton>
            </VLoader>
        </template>
    </VModal>

</template>
  
<style  lang="scss">
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

.file-link {

    color: var(--primary-grey) !important;

}

.file-link:hover {
    color: var(--primary) !important;

}
</style>
  