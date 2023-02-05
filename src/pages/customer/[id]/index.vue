
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { changeUserStatus } from '/@src/services/Others/User/userService'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { useNotyf } from '/@src/composable/useNotyf'
import {
  Customer,
  defaultCustomer,
  defaultCustomerProfilePic,
  defaultUpdateNotes,
  UpdateNotes,
} from '/@src/models/CRM/Customer/customer'
import { defaultChangeStatusUser } from '/@src/models/Others/User/user'
import {
  UserStatus,
  defaultUserStatusSearchFilter,
UserStatusConsts,
} from '/@src/models/Others/UserStatus/userStatus'
import {
  getCustomer,
  getProfilePicture,
  updateCustomerNotes,
  getCustomerFiles,
  addCustomerFile,
  deleteFile,
  addProfilePicture,
} from '/@src/services/CRM/Customer/customerService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { MedicalInfoConsts } from '/@src/models/CRM/MedicalInfo/medicalInfo'
import { useCustomer } from '/@src/stores/CRM/Customer/customerStore'
import sleep from '/@src/utils/sleep'
import { ErrorMessage } from 'vee-validate'
import { useCustomerForm } from '/@src/stores/CRM/Customer/customerFormSteps'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Media, MediaConsts } from '/@src/models/Others/Media/media'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const deleteFilePopup = ref(false)
const deleteFileId = ref()
const viewWrapper = useViewWrapper()
const currentCustomer = ref<Customer>(defaultCustomer)
const customerId = ref(0)
const notif = useNotyf() as Notyf
const { t } = useI18n()
const customerForm = useCustomerForm()
const customerProfilePicture = ref(defaultCustomerProfilePic)
const customerFiles = ref<Array<Media>>([])
const filesToUpload = ref<File>()
const profilePictureToUpload = ref<File>()
const updateProfilePicturePopup = ref(false)
const notesEditor = ref(false)
const loading = ref(false)
const deleteLoading = ref(false)
const uploadLoading = ref(false)
const CKEditor = CKE.component
const editorData = ref()
const keyIncrement = ref(1)
const config = {
  fontFamily: {
    options: ['"Montserrat", sans-serif', '"Roboto", sans-serif'],
  },
  toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList'],
}
// @ts-ignore
customerId.value = route.params.id
viewWrapper.setPageTitle(t('customer.details.title'))
useHead({
  title: t('customer.details.title'),
})
const customerStore = useCustomer()
const props = withDefaults(
  defineProps<{
    activeTab?: 'Details' | 'Medical Info' | 'Social Media' | 'Files'
  }>(),
  {
    activeTab: 'Details',
  }
)
const tab = ref(props.activeTab)
if (
  route.query.tab === 'Details' ||
  route.query.tab === 'Medical Info' ||
  route.query.tab === 'Social Media' ||
  route.query.tab === 'Files'
) {
  tab.value = route.query.tab
}

const statusesList = ref<UserStatus[]>([])
onMounted(async () => {
  const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
  statusesList.value = userstatuses
})
onMounted(async () => {
  loading.value = true
  await getCurrentCustomer()
  await fetchCurrentProfilePic()

  await fetchCustomerFiles()

  loading.value = false
  editorData.value = currentCustomer.value.notes
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
  await sleep(200)

  // @ts-ignore
  notif.success( t('toast.success.edit') )
  changeStatusPopup.value = false
}

const onClickEditSocialMedia = async () => {
  await fetchCustomer()
  router.push({
    path: `/customer-edit/${customerId.value}/social-media`,
  })
}
const onClickEditMainInfo = async () => {
  await fetchCustomer()

  router.push({
    path: `/customer-edit/${customerId.value}/`,
  })
}
const onClickEditMedicalInfo = async () => {
  await fetchCustomer()

  router.push({
    path: `/customer-edit/${customerId.value}/medical-info`,
  })
}
const openNotesEditor = async () => {
  notesEditor.value = true
}
const editNotes = async () => {
  const newNote: UpdateNotes = defaultUpdateNotes
  newNote.notes = editorData.value
  const { success, message, customer } = await updateCustomerNotes(
    customerId.value,
    newNote
  )
  if (success) {
    notif.dismissAll()
    await sleep(200)
    // @ts-ignore
    notif.success(t('toast.success.customer_note'))
    currentCustomer.value.notes = customer.notes
    currentCustomer.value.notes_by = customer.notes_by
    currentCustomer.value.notes_timestamp = customer.notes_timestamp
    notesEditor.value = false
  } else {
    await sleep(200)
    notif.error(message)
  }
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
    customerForm.medicalInfoForm.infectious_diseases =
      customer.medical_info.infectious_diseases
    customerForm.medicalInfoForm.smoking = customer.medical_info.smoking
    customerForm.medicalInfoForm.id = customer.medical_info.id
  }
  for (let i = 0; i < customer.social_medias.length; i++) {
    // @ts-ignore
    customerForm.customerSocialMediaForm.push({
      social_media_id: customer.social_medias[i].id,
      url: customer.social_medias[i].url,
    })
  }
}

const fetchCurrentProfilePic = async () => {
  let profile_pic = await getProfilePicture(customerId.value)
  await sleep(500)
  if (profile_pic.media.length != 0) {
    customerProfilePicture.value = profile_pic.media[profile_pic.media.length - 1]
  }
}
const fetchCustomerFiles = async () => {
  const { media } = await getCustomerFiles(customerId.value)
  await sleep(500)
  if (media.length != 0) {
    media.forEach((mediaElemnt) => {
      customerFiles.value.push(mediaElemnt)
    })
  }
}

const onAddFile = async (event: any) => {
  const _file = event.target.files[0] as File
  let _message = ''
  if (_file) {
    if (
      _file.type != 'image/jpeg' &&
      _file.type != 'image/png' &&
      _file.type != 'image/webp'
    ) {
      _message = t('toast.file.type')
      await sleep(200)
      notif.error(_message)
    } else if (_file.size > 2 * 1024 * 1024) {
      _message = t('toast.file.size')
      await sleep(200)
      notif.error(_message)
    } else {
      filesToUpload.value = _file
    }
  }
}
const UploadFile = async () => {
  uploadLoading.value = true

  let formData = new FormData()
  if (filesToUpload.value != undefined) formData.append('images[]', filesToUpload.value)

  const { success, message, media } = await addCustomerFile(customerId.value, formData)

  if (success) {
    // @ts-ignore
    await sleep(200)

    notif.success(t('toast.success.add'))
    media[0].file_name = media[0].relative_path
    media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

    customerFiles.value.push(media[0])
    filesToUpload.value = undefined
    uploadLoading.value = false
    return true
  } else {
    // @ts-ignore
    await sleep(200)
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
    await sleep(200)

    notif.success(t('toast.success.remove'))

    customerFiles.value.splice(
      customerFiles.value.findIndex((element) => element.id == deleteFileId.value),
      1
    )
    deleteLoading.value = false
    deleteFilePopup.value = false

    return true
  } else {
    // @ts-ignore
    await sleep(200)
    deleteLoading.value = false

    notif.error(message)
  }
}

const editProfilePicture = async () => {
  updateProfilePicturePopup.value = true
}
const onEditProfilePicture = async (error: any, fileInfo: any) => {
  if (error) {
    // @ts-ignore
    await sleep(200)

    notif.error(`${error.main}: ${error.sub}`)
    console.error(error)
    return
  }

  let _message = ''
  const _file = fileInfo.file as File

  if (_file) {
    if (
      _file.type != 'image/jpeg' &&
      _file.type != 'image/png' &&
      _file.type != 'image/webp'
    ) {
      _message = t('toast.file.type')
      await sleep(200)
      notif.error(_message)
    } else if (_file.size > 2 * 1024 * 1024) {
      _message = t('toast.file.size')
      await sleep(200)
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
  if (
    customerProfilePicture.value.id != undefined &&
    profilePictureToUpload.value != undefined
  ) {
    const { message, success } = await deleteFile(customerProfilePicture.value.id)
    _success = success
    _message = message
  } else if (
    customerProfilePicture.value.id != undefined ||
    profilePictureToUpload.value == undefined
  ) {
    _success = false
    _message = t('toast.file.image')
  }
  if (_success) {
    let formData = new FormData()
    if (profilePictureToUpload.value != undefined)
      formData.append('images[]', profilePictureToUpload.value)

    const { success, message, media } = await addProfilePicture(
      customerId.value,
      formData
    )

    if (success) {
      // @ts-ignore
      await sleep(200)

      notif.success(t('toast.success.edit'))
      customerProfilePicture.value = media[0]
      customerProfilePicture.value.relative_path =
        import.meta.env.VITE_MEDIA_BASE_URL + customerProfilePicture.value.relative_path
      profilePictureToUpload.value = undefined
      keyIncrement.value++
      updateProfilePicturePopup.value = false
      uploadLoading.value = false
    } else {
      uploadLoading.value = false

      // @ts-ignore
      await sleep(200)

      notif.error(message)
      keyIncrement.value++
      profilePictureToUpload.value = undefined

      updateProfilePicturePopup.value = false
    }
  } else {
    uploadLoading.value = false

    // @ts-ignore
    await sleep(200)

    notif.error(_message)
    keyIncrement.value++
    profilePictureToUpload.value = undefined

    updateProfilePicturePopup.value = false
  }
}
const RemoveProfilePicture = async () => {
  if (customerProfilePicture.value.id != undefined) {
    deleteLoading.value = true
    const { message, success } = await deleteFile(customerProfilePicture.value.id)
    if (success) {
      await sleep(200)

      notif.success(t('toast.success.remove'))
      customerProfilePicture.value = defaultCustomerProfilePic
    } else {
      await sleep(200)

      notif.error(message)
    }
    keyIncrement.value++
    profilePictureToUpload.value = undefined

    updateProfilePicturePopup.value = false
    deleteLoading.value = false
  }
}
</script>
<template>
  <div class="profile-wrapper">
    <VLoader size="large" :active="loading">
      <div class="profile-header has-text-centered">
        <VAvatar
          v-if="customerProfilePicture.id == undefined"
          size="xl"
          :picture="MediaConsts.getAvatarIcon(currentCustomer.user.gender)"
          edit
          @edit="editProfilePicture"
        />
        <VAvatar
          v-else
          size="xl"
          :picture="customerProfilePicture.relative_path"
          edit
          @edit="editProfilePicture"
        />
        <h3 class="title is-4 is-narrow is-thin">
          {{ currentCustomer.user.first_name }}
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
            <span
              >{{t('customer.details.status')}}:
              <span
                :class="`has-text-${UserStatusConsts.getStatusColor(currentCustomer.user.status.id)}`
                "
                >{{ UserStatusConsts.getStatusName(currentCustomer.user.status.id) }}</span
              ></span
            >
          </div>
        </div>
      </div>
    </VLoader>

    <div class="project-details">
      <div class="tabs-wrapper is-quad-slider">
        <div class="tabs-inner" :hidden="loading">
          <div class="tabs tabs-width">
            <ul>
              <li :class="[tab === 'Details' && 'is-active']">
                <a
                  tabindex="0"
                  @keydown.space.prevent="tab = 'Details'"
                  @click="tab = 'Details'"
                  ><span>{{t('customer.details.tabs.details')}}</span></a
                >
              </li>
              <li :class="[tab === 'Medical Info' && 'is-active']">
                <a
                  tabindex="0"
                  @keydown.space.prevent="tab = 'Medical Info'"
                  @click="tab = 'Medical Info'"
                  ><span>{{t('customer.details.tabs.medical_info')}}</span></a
                >
              </li>
              <li :class="[tab === 'Social Media' && 'is-active']">
                <a
                  tabindex="0"
                  @keydown.space.prevent="tab = 'Social Media'"
                  @click="tab = 'Social Media'"
                  ><span>{{t('customer.details.tabs.social_media')}}</span></a
                >
              </li>
              <li :class="[tab === 'Files' && 'is-active']">
                <a
                  tabindex="0"
                  @keydown.space.prevent="tab = 'Files'"
                  @click="tab = 'Files'"
                  ><span>{{t('customer.details.tabs.files')}}</span></a
                >
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
                    <h3>{{t('customer.details.main_details')}}</h3>
                  </div>
                  <div class="buttons">
                    <VButton @click.prevent="onOpen" color="dark">
                      {{t('customer.table.modal_title.status')}}
                    </VButton>
                    <VIconButton
                      size="small"
                      icon="feather:edit-3"
                      tabindex="0"
                      @click="onClickEditMainInfo"
                    />
                  </div>
                </div>

                <div class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-user"></i>
                    <h4>{{t('customer.details.name',{title :viewWrapper.pageTitle  })}}</h4>
                    <p>
                      {{ currentCustomer.user.first_name }}
                      {{ currentCustomer.user.last_name }}.
                    </p>
                  </div>
                  <div class="project-feature">
                    <i
                      aria-hidden="true"
                      :class="
                        currentCustomer.user.gender == 'Male'
                          ? 'lnir lnir-male'
                          : 'lnir lnir-female'
                      "
                    ></i>
                    <h4>{{ t('customer.details.gender') }}</h4>
                    <p>
                      {{
                        currentCustomer.user.gender == 'Not_Selected'
                          ? t('gender.not_selected')
                          : t(`gender.${currentCustomer.user.gender.toLowerCase()}`)
                      }}.
                    </p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-calendar"></i>
                    <h4>{{ t('customer.details.birth_date') }}</h4>
                    <p>{{ currentCustomer.user.birth_date }}.</p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-phone"></i>
                    <h4>{{ t('customer.details.phone_number') }}</h4>
                    <p>{{ currentCustomer.user.phone_number }}.</p>
                  </div>
                </div>

                <div class="project-files">
                  <h4>{{ t('customer.details.more_info')}}</h4>
                  <div class="columns is-multiline">
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('customer.details.group') }}</span>
                          <span>
                            {{ currentCustomer.customer_group.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('customer.details.address') }}</span>
                          <span>
                            {{ currentCustomer.user.address }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('customer.details.emergency_contact_name') }}</span>
                          <span>
                            {{ currentCustomer.emergency_contact_name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('customer.details.emergency_contact_phone') }}</span>
                          <span>
                            {{ currentCustomer.emergency_contact_phone }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div v-if="!notesEditor" class="column is-12">
                      <div class="file-box">
                        <div class="meta full-width">
                          <div
                            class="
                              is-justify-content-space-between
                              is-align-items-center
                              is-flex
                              mt-2
                            "
                          >
                            <span class="mb-2">{{ t('customer.details.note') }}</span>
                            <VIconButton
                              class="mb-3"
                              size="small"
                              icon="feather:edit-3"
                              tabindex="0"
                              @click="openNotesEditor"
                            />
                          </div>
                          <VFlex class="mb-3">
                            <!-- use any components inside --->
                            <VCard>
                              <div v-html="currentCustomer.notes" class="ml-3 mb-3"></div>
                              <div
                                v-if="currentCustomer.notes != undefined"
                                class="has-text-primary"
                              >
                                -{{ t('customer.details.last_update') }}: {{ currentCustomer.notes_timestamp }} |
                                {{ t('customer.details.by') }}: {{ currentCustomer.notes_by?.first_name }}
                                {{ currentCustomer.notes_by?.last_name }}
                              </div>
                            </VCard>
                          </VFlex>
                        </div>
                      </div>
                    </div>
                    <div v-else class="column is-12 editor-wrapper">
                      <CKEditor
                        :config="config"
                        class="editor"
                        v-model="editorData"
                        :editor="ClassicEditor"
                      >
                      </CKEditor>
                      <VButton
                        class="mt-4 editor-button"
                        @click.prevent="editNotes"
                        color="dark"
                      >
                        {{t('modal.buttons.save')}}
                      </VButton>
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
                    <h3>{{ t('customer.details.medical_info') }}</h3>
                  </div>
                  <VIconButton
                    size="small"
                    icon="feather:edit-3"
                    tabindex="0"
                    @click="onClickEditMedicalInfo"
                  />
                </div>

                <div v-if="currentCustomer.medical_info" class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnir lnir-drop-alt"></i>
                    <h4>{{t('customer.details.blood_type')}}</h4>
                    <p>
                      {{ currentCustomer?.medical_info?.blood_type }}
                    </p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnir lnir-grow"></i>
                    <h4>{{t('customer.details.smooke')}}</h4>
                    <p>
                      {{
                        MedicalInfoConsts.showBoolean(
                          currentCustomer?.medical_info?.smoking
                        )
                      }}.
                    </p>
                  </div>
                </div>
                <div v-else class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{ t('customer.details.tabs_content_placeholder.medical_info') }}</h4>
                  </div>
                </div>

                <div v-if="currentCustomer.medical_info" class="project-files">
                  <h4>{{t('customer.details.more_info')}}</h4>
                  <div class="columns is-multiline">
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{t('customer.details.allergic')}}</span>
                          <span>
                            {{ currentCustomer?.medical_info?.allergic }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{t('customer.details.chronic_diseases')}}</span>
                          <span>
                            {{ currentCustomer?.medical_info?.chronic_diseases }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{t('customer.details.infectious_diseases')}}</span>
                          <span>
                            {{ currentCustomer?.medical_info?.infectious_diseases }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{t('customer.details.other_medical_info')}}</span>
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
                    <h3>{{t('customer.details.customer_social_media')}}</h3>
                  </div>

                  <VIconButton
                    size="small"
                    icon="feather:edit-3"
                    tabindex="0"
                    @click="onClickEditSocialMedia"
                  />
                </div>

                <div class="project-features">
                  <div
                    v-for="socialMedia in currentCustomer.social_medias"
                    class="project-feature"
                  >
                    <i aria-hidden="true" :class="socialMedia.icon"></i>
                    <h4>{{ socialMedia.name }}</h4>
                    <p class="has-text-centered">
                      {{t('customer.details.customer_URL')}}:
                      <a target="_blank" class="has-text-primary" :href="socialMedia.url">
                        {{ socialMedia.url }}</a
                      >
                    </p>
                  </div>
                  <div
                    v-if="currentCustomer.social_medias.length == 0"
                    class="project-feature"
                  >
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{ t('customer.details.tabs_content_placeholder.social_modia') }}</h4>
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
                    <h3>{{ t('customer.details.customer_files') }}</h3>
                  </div>
                </div>
                <div v-if="customerFiles.length == 0" class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{t('customer.details.tabs_content_placeholder.files')}}</h4>
                  </div>
                </div>

                <div class="project-files project-section">
                  <h4>{{t('customer.details.upload_file')}}</h4>
                  <div class="is-flex is-justify-content-space-between">
                    <VField class="mr-6" grouped>
                      <VControl>
                        <div class="file has-name">
                          <label class="file-label">
                            <input
                              class="file-input"
                              type="file"
                              v-on:change="onAddFile"
                            />
                            <span class="file-cta">
                              <span class="file-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                              </span>
                              <span class="file-label">{{t('images.image_name_placeholder')}}</span>
                            </span>
                            <span class="file-name light-text">
                              {{ filesToUpload?.name ?? t('images.image_select_file') }}
                            </span>
                          </label>
                        </div>
                      </VControl>
                    </VField>
                    <VLoader size="small" :active="uploadLoading">
                      <VButton
                        v-if="filesToUpload != undefined"
                        @click="UploadFile"
                        class=""
                        icon="lnir lnir-add-files rem-100"
                        light
                        dark-outlined
                      >
                        {{t('customer.details.upload')}}
                      </VButton>
                    </VLoader>
                  </div>
                  <h6 class="ml-2 mt-2 help">
                    {{t('images.accepted_file')}}
                  </h6>
                </div>
                <div
                  v-if="customerFiles.length != 0"
                  class="project-files project-section"
                >
                  <div>
                    <h4>{{t('customer.details.tabs.files')}}</h4>
                    <div class="columns is-multiline">
                      <div v-for="file in customerFiles" class="column is-6">
                        <div class="file-box">
                          <img
                            :src="MediaConsts.getMediaIcon(file.mime_type ?? '')"
                            alt=""
                          />
                          <div class="meta">
                            <span class="file-link">
                              <a
                                target="_blank"
                                class="file-link"
                                :href="file.relative_path"
                              >
                                {{ file.file_name }}</a
                              >
                            </span>
                            <span>
                              {{
                                file.size != undefined
                                  ? (file.size / (1024 * 1024)).toFixed(2)
                                  : 'Unknown'
                              }}
                              {{ file.size != undefined ? 'MB' : '' }}
                              <i aria-hidden="true" class="fas fa-circle"></i>
                              {{ file.created_at }}
                              <i aria-hidden="true" class="fas fa-circle"></i>
                              {{t('images.by')}} {{ file.uploaded_by?.first_name
                              }}{{ file.uploaded_by?.last_name }}
                            </span>
                          </div>
                          <VIconButton
                            v-if="file.id"
                            class="is-right is-dots is-spaced dropdown end-action mr-2"
                            size="small"
                            icon="feather:trash"
                            tabindex="0"
                            color="danger"
                            @click="onDeleteFile(file.id ?? 0)"
                          />
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
  <VModal
    :title="t('customer.table.modal_title.status')"
    :open="changeStatusPopup"
    actions="center"
    @close="changeStatusPopup = false"
  >
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField class="column" id="user_status_id">
                <VLabel>{{t('customer.details.customer_status')}}</VLabel>
                <VControl>
                  <VSelect
                    v-if="currentCustomer.user.status"
                    v-model="currentCustomer.user.status.id"
                  >
                    <VOption value="">{{t('customer.details.select_customer_status')}}</VOption>
                    <VOption
                      v-for="status in statusesList"
                      :key="status.id"
                      :value="status.id"
                      >{{ status.name }}
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
      <VButton color="primary" raised @click="changestatusUser()">{{t('modal.buttons.confirm')}}</VButton>
    </template>
  </VModal>
  <VModal
    :title="t('customer.table.modal_title.delete_file')"
    :open="deleteFilePopup"
    actions="center"
    @close="deleteFilePopup = false"
  >
    <template #content>
      <VPlaceholderSection
        :title="t('customer.table.modal_title.placeholderSection.title')"
        :subtitle="t('customer.table.modal_title.placeholderSection.subtitle')"
      />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="deleteLoading">
        <VButton color="primary" raised @click="removefile()">{{t('modal.buttons.confirm')}}</VButton>
      </VLoader>
    </template>
  </VModal>
  <VModal
    :key="keyIncrement"
    :title="t('customer.table.modal_title.profile_picture')"
    :open="updateProfilePicturePopup"
    actions="center"
    @close="updateProfilePicturePopup = false"
  >
    <template #content>
      <VField class="is-flex is-justify-content-center">
        <VControl>
          <VFilePond
            size="large"
            class="profile-filepond"
            name="profile_filepond"
            :chunk-retry-delays="[500, 1000, 3000]"
            label-idle="<i class='lnil lnil-cloud-upload'></i>"
            :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
            :image-preview-height="140"
            :image-resize-target-width="140"
            :image-resize-target-height="140"
            image-crop-aspect-ratio="1:1"
            style-panel-layout="compact circle"
            style-load-indicator-position="center bottom"
            style-progress-indicator-position="right bottom"
            style-button-remove-item-position="left bottom"
            style-button-process-item-position="right bottom"
            @addfile="onEditProfilePicture"
          />
        </VControl>
      </VField>
      <h6 class="is-flex is-justify-content-center help">
        {{t('images.accepted_file')}}
      </h6>
    </template>

    <template #action="{ close }">
      <VLoader size="small" :active="deleteLoading">
        <VButton
          v-if="customerProfilePicture.id != undefined"
          color="danger"
          outlined
          class="mr-2"
          @click="RemoveProfilePicture"
        >
          {{t('modal.buttons.delete')}}</VButton
        >
      </VLoader>

      <VLoader size="small" :active="uploadLoading">
        <VButton color="primary" raised @click="UploadProfilePicture">{{ t('customer.details.upload') }}</VButton>
      </VLoader>
    </template>
  </VModal>
</template>
  
<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
  min-width: 700px;
  min-height: 40px;

  .is-active {
    min-height: 40px;
  }
}

.tabs-wrapper.is-quad-slider .tabs li a,
.tabs-wrapper-alt.is-quad-slider .tabs li a {
  height: 40px;
}

.tabs li {
  min-height: 40px !important;
}

.full-width {
  width: 100%;
  margin-right: 12px;
}

.editor-wrapper {
  flex-direction: column;
  display: flex;

  .editor {
    align-self: normal;
  }

  .editor-button {
    align-self: flex-end;
  }
}

.project-section {
  border-bottom: 1px solid var(--fade-grey-dark-3);
  border-top: 1px solid var(--fade-grey-dark-3);
}

.file-link {
  color: var(--primary-grey) !important;
}

.file-link:hover {
  color: var(--primary) !important;
}

.is-dark {
  .project-section {
    border-color: var(--dark-sidebar-light-12);
  }
}

.profile-picture-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 16px;
  width: 16px;
  border: 1px solid var(--white);
}
</style>
