<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { Employee, defaultEmployee, defaultEmployeeProfilePic } from "/@src/models/Employee/employee"
import { defaultChangeStatusUser } from "/@src/models/Others/User/user"
import { UserStatus, defaultUserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { getEmployee, getEmployeeFiles, getProfilePicture, addEmployeeFile, deleteFile, addProfilePicture } from "/@src/services/Employee/employeeService"
import { changeUserStatus } from "/@src/services/Others/User/userService"
import { getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useEmployee } from "/@src/stores/Employee/employeeStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { useEmployeeForm } from "/@src/stores/Employee/employeeFormSteps"
import { Media, MediaConsts } from "/@src/models/Others/Media/media"


const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const currentEmployee = ref<Employee>(defaultEmployee)
const employeeId = ref(0)
const deleteFilePopup = ref(false)
const deleteFileId = ref()
const employeeProfilePicture = ref(defaultEmployeeProfilePic)
const employeeFiles = ref<Array<Media>>([])
const filesToUpload = ref<File>()
const profilePictureToUpload = ref<File>()
const updateProfilePicturePopup = ref(false)
const keyIncrement = ref(1)
const loading = ref(false)
const deleteLoading = ref(false)
const uploadLoading = ref(false)
const employeeForm = useEmployeeForm()

const notif = useNotyf()

// @ts-ignore
employeeId.value = route.params.id
viewWrapper.setPageTitle(`Employee`)
useHead({
    title: 'Employee',
})
const employeeStore = useEmployee()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'Files'
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
    loading.value = true

    await getCurrentEmployee()
    await fetchCurrentProfilePic()
    await fetchEmployeeFiles()
    loading.value = false


})
const getCurrentEmployee = async () => {
    const { employee } = await getEmployee(employeeId.value)
    currentEmployee.value = employee

}
const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}
const changestatusUser = async () => {
    const userData = currentEmployee.value
    var userForm = currentChangeStatusUser.value
    userForm.id = userData.user.id
    userForm.user_status_id = userData.user.status?.id
    await changeUserStatus(userForm)
    getCurrentEmployee()
    // @ts-ignore
    notif.dismissAll()
    await sleep(200);
    notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} was edited successfully`)
    changeStatusPopup.value = false
}
const fetchEmployee = async () => {

    const { employee } = await getEmployee(employeeId.value)
    employeeForm.userForm.id = employee.user.id
    employeeForm.userForm.first_name = employee.user.first_name
    employeeForm.userForm.last_name = employee.user.last_name
    employeeForm.userForm.gender = employee.user.gender
    employeeForm.userForm.birth_date = employee.user.birth_date
    employeeForm.userForm.phone_number = employee.user.phone_number
    employeeForm.userForm.address = employee.user.address
    employeeForm.userForm.room_id = employee.user.room.id
    employeeForm.userForm.city_id = employee.user.city.id
    employeeForm.userForm.user_status_id = employee.user.status.id
    employeeForm.dataUpdate.starting_date = employee.starting_date
    employeeForm.dataUpdate.basic_salary = employee.basic_salary
    employeeForm.dataUpdate.end_date = employee?.end_date
    employeeForm.dataUpdate.nationality_id = employee.nationality.id
    employeeForm.dataUpdate.position_id = employee.position.id
    employeeForm.dataUpdate.id = employeeId.value
}

const onClickEditMainInfo = async () => {
    await fetchEmployee()
    router.push({
        path: `/employee-edit/${employeeId.value}`
    })
}
const fetchCurrentProfilePic = async () => {
    let profile_pic = await getProfilePicture(employeeId.value)
    await sleep(500)
    if (profile_pic.media.length != 0) {
        employeeProfilePicture.value = profile_pic.media[profile_pic.media.length - 1]

    }

}
const fetchEmployeeFiles = async () => {
    const { media } = await getEmployeeFiles(employeeId.value)
    await sleep(500)
    if (media.length != 0) {
        media.forEach(mediaElemnt => {
            employeeFiles.value.push(mediaElemnt)
        });
    }
}

const onAddFile = async (event: any) => {
    const _file = event.target.files[0] as File
    let _message = ''
    if (_file) {

        if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
            _message = 'Please choose an accepted file type'
            await sleep(200);
            notif.error(_message)
        } else if (_file.size > (2 * 1024 * 1024)) {
            _message = 'File size must be less than 2MB '
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

    const { success, message, media } = await addEmployeeFile(employeeId.value, formData)

    if (success) {
        // @ts-ignore
        await sleep(200);

        notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} file was added successfully`)
        media[0].file_name = media[0].relative_path
        media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

        employeeFiles.value.push(media[0])
        filesToUpload.value = undefined
        uploadLoading.value = false
        return true
    }
    else {
        // @ts-ignore
        await sleep(200);
        filesToUpload.value = undefined
        uploadLoading.value = false
        notif.error(message)

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

        notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} file was deleted successfully`)

        employeeFiles.value.splice(employeeFiles.value.findIndex((element) => element.id == deleteFileId.value), 1)
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
        console.error(error)
        return

    }

    let _message = ''
    const _file = fileInfo.file as File

    if (_file) {

        if (_file.type != 'image/jpeg' && _file.type != 'image/png' && _file.type != 'image/webp') {
            _message = 'Please choose an accepted file type'
            await sleep(200);
            notif.error(_message)


        } else if (_file.size > (2 * 1024 * 1024)) {
            _message = 'File size must be less than 2MB '
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
    if (employeeProfilePicture.value.id != undefined && profilePictureToUpload.value != undefined) {
        const { message, success } = await deleteFile(employeeProfilePicture.value.id)
        _success = success
        _message = message
    } else if (employeeProfilePicture.value.id != undefined || profilePictureToUpload.value == undefined) {
        _success = false
        _message = 'Please select a valid image to be uploaded'
    }
    if (_success) {

        let formData = new FormData();
        if (profilePictureToUpload.value != undefined)
            formData.append('images[]', profilePictureToUpload.value);

        const { success, message, media } = await addProfilePicture(employeeId.value, formData)

        if (success) {
            // @ts-ignore
            await sleep(200);

            notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} profile picture was edited successfully`)
            employeeProfilePicture.value = media[0]
            employeeProfilePicture.value.relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

            keyIncrement.value++
            updateProfilePicturePopup.value = false
            profilePictureToUpload.value = undefined
            uploadLoading.value = false


        }
        else {
            // @ts-ignore
            await sleep(200);

            notif.error(message)
            keyIncrement.value++
            uploadLoading.value = false
            profilePictureToUpload.value = undefined

            updateProfilePicturePopup.value = false

        }
    } else {
        // @ts-ignore
        await sleep(200);
        uploadLoading.value = false

        notif.error(_message)
        keyIncrement.value++
        profilePictureToUpload.value = undefined

        updateProfilePicturePopup.value = false

    }


}
const RemoveProfilePicture = async () => {
    if (employeeProfilePicture.value.id != undefined) {
        deleteLoading.value = true
        const { message, success } = await deleteFile(employeeProfilePicture.value.id)
        if (success) {
            await sleep(200);

            notif.success(`${currentEmployee.value.user.first_name} ${currentEmployee.value.user.last_name} profile picture was deleted successfully`)
            employeeProfilePicture.value = defaultEmployeeProfilePic

        } else {
            await sleep(200);

            notif.error(message)

        }
        profilePictureToUpload.value = undefined
        keyIncrement.value++
        deleteLoading.value = false

        updateProfilePicturePopup.value = false

    }


}

</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">

            <div class="profile-header has-text-centered">
                <VAvatar v-if="employeeProfilePicture.id == undefined" size="xl"
                    :picture="MediaConsts.getAvatarIcon(currentEmployee.user.gender)" edit @edit="editProfilePicture" />
                <VAvatar v-else size="xl" :picture="employeeProfilePicture.relative_path" edit
                    @edit="editProfilePicture" />

                <h3 class="title is-4 is-narrow is-thin">{{ currentEmployee.user.first_name }}
                    {{ currentEmployee.user.last_name }}</h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <i aria-hidden="true" class="fas fa-city"></i>
                        <span>{{ currentEmployee.user.city.name }}</span>
                    </div>
                    <div class="separator"></div>
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>Status: <span
                                :class="currentEmployee.user.status.name == 'Busy' ? 'has-text-danger' : 'has-text-primary'">{{
        currentEmployee.user.status.name
}}</span></span>
                    </div>
                    <div class="separator"></div>
                </div>
            </div>
        </VLoader>

        <div class="project-details">
            <div class="tabs-wrapper is-slider">
                <div :hidden="loading" class="tabs-inner">
                    <div class="tabs tabs-width">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>Details</span></a>
                            </li>
                            <li :class="[tab === 'Files' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Files'"
                                    @click="tab = 'Files'"><span>Files </span></a>
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
                                        <h4>Employee Name</h4>
                                        <p>
                                            {{ currentEmployee.user.first_name }} {{
        currentEmployee.user.last_name
}}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true"
                                            :class="currentEmployee.user.gender == 'Male' ? 'lnir lnir-male' : 'lnir lnir-female'"></i>
                                        <h4>Gender</h4>
                                        <p>
                                            {{ currentEmployee.user.gender }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-calendar"></i>
                                        <h4>Birth Date</h4>
                                        <p>
                                            {{ currentEmployee.user.birth_date }}.
                                        </p>
                                    </div>
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-phone"></i>
                                        <h4>Phone Number</h4>
                                        <p> {{ currentEmployee.user.phone_number }}.
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
                                                        {{ currentEmployee.starting_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>End Date</span>
                                                    <span>
                                                        {{ currentEmployee.end_date }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Address</span>
                                                    <span>
                                                        {{ currentEmployee.user.address }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Department</span>
                                                    <span>
                                                        {{ currentEmployee?.user?.room?.department?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Room Number</span>
                                                    <span>
                                                        {{ currentEmployee?.user?.room?.number }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Nationality</span>
                                                    <span>
                                                        {{ currentEmployee.nationality?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Position</span>
                                                    <span>
                                                        {{ currentEmployee.position?.name }}
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
                <div v-if="tab === 'Files'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>Employee Files</h3>
                                    </div>
                                </div>
                                <div v-if="employeeFiles.length == 0" class="project-features">
                                    <div class="project-feature">
                                        <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                                        <h4>Employee have no files...</h4>
                                    </div>
                                </div>
                                <div class="project-files project-section">
                                    <h4>Upload File</h4>
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
                                                            <span class="file-label"> Choose a file… </span>
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
                                                Upload
                                            </VButton>
                                        </VLoader>
                                    </div>
                                    <h6 class="ml-2 mt-2 help">Max size: 2 MB | Accepted file types :
                                        png,
                                        jpg,
                                        webp
                                    </h6>
                                </div>
                                <div v-if="employeeFiles.length != 0" class="project-files project-section">
                                    <div>
                                        <h4>Files</h4>
                                        <div class="columns is-multiline">
                                            <div v-for="file in employeeFiles" class="column is-6">
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
                                    <VSelect v-if="currentEmployee.user.status"
                                        v-model="currentEmployee.user.status.id">
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
    <VModal title="Delete Employee File" :open="deleteFilePopup" actions="center" @close="deleteFilePopup = false">
        <template #content>
            <VPlaceholderSection title="Are you sure?" :subtitle="`you are about to delete this file permenantly`" />
        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="deleteLoading">

                <VButton color="primary" raised @click="removefile()">Confirm</VButton>
            </VLoader>
        </template>
    </VModal>
    <VModal :key="keyIncrement" title="Update Profile Picture" :open="updateProfilePicturePopup" actions="center"
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
            <h6 class="is-flex is-justify-content-center help">Max size: 2 MB | Accepted file types :
                png,
                jpg,
                webp
            </h6>

        </template>

        <template #action="{ close }">
            <VLoader size="small" :active="deleteLoading">

                <VButton v-if="employeeProfilePicture.id != undefined" color="danger" outlined class="mr-2"
                    @click="RemoveProfilePicture">
                    Delete</VButton>
            </VLoader>
            <VLoader size="small" :active="uploadLoading">

                <VButton color="primary" raised @click="UploadProfilePicture">Update</VButton>
            </VLoader>

        </template>
    </VModal>

</template>
  
<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
    min-width: 50px;
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
  