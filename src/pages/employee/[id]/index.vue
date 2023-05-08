<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "employee_show"
    ]
  }
}
</route>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf'
import {
  Employee,
  defaultEmployee,
  defaultEmployeeProfilePic,
} from '/@src/models/Employee/employee'
import { defaultChangeStatusUser } from '/@src/models/Others/User/user'
import {
  UserStatus,
  defaultUserStatusSearchFilter,
  UserStatusConsts,
} from '/@src/models/Others/UserStatus/userStatus'
import {
  getEmployee,
  getEmployeeFiles,
  getProfilePicture,
  addEmployeeFile,
  deleteFile,
  addProfilePicture,
  getMaxEmployeeNumber,
  updateEmployeeNumber,
  toggleEmployeeAvailability,
} from '/@src/services/Employee/employeeService'
import { changeUserStatus } from '/@src/services/Others/User/userService'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import sleep from '/@src/utils/sleep'
import { ErrorMessage, useForm } from 'vee-validate'
import { useEmployeeForm } from '/@src/stores/Employee/employeeFormSteps'
import { Media, MediaConsts } from '/@src/models/Others/Media/media'
import { employeeNumberEditValidationSchema } from '/@src/rules/Employee/employeeNumberEditValidation'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency'
import { getCurrenciesFromStorage } from '/@src/services/Accounting/Currency/currencyService'
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
import { checkPermission } from '/@src/composable/checkPermission'
import { useAuth } from '/@src/stores/Others/User/authStore'
import { resetPassword } from '/@src/services/Others/User/authService'
import { EmployeeStatusConsts } from '/@src/models/Employee/employeeHistory'
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency
const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const changeStatus = ref()
const currentChangeStatusUser = ref(defaultChangeStatusUser)
const changeStatusPopup = ref(false)
const resetPasswordPopup = ref(false)
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
const updateLoading = ref(false)
const editEmployeeNumberTrigger = ref(false)
const newEmployeeNumber = ref<number>()
const maxEmployeeNumber = ref(0)
const employeeAccountCurrentBalance = ref('0')
const employeeAccountCurrency = ref('')
const employeeForm = useEmployeeForm()
const { t } = useI18n()
const notif = useNotyf() as Notyf
const authStore = useAuth()
// @ts-ignore
employeeId.value = route.params.id
viewWrapper.setPageTitle(t('employee.details.title'))
useHead({
  title: t('employee.details.title'),
})
const employeeStore = useEmployee()
const props = withDefaults(
  defineProps<{
    activeTab?: 'Details' | 'Services' | 'Files' | 'Tickets' | 'Ticket Services' | 'Cash Receipts' | 'Balances' | 'History Record' | 'Availability History'
  }>(),
  {
    activeTab: 'Details',
  }
)
const tab = ref(props.activeTab)
if (route.query.tab === 'Details'
  || route.query.tab === 'Services'
  || route.query.tab === 'Files') {
  tab.value = route.query.tab
}


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
  await fetchMaxEmployeeNumber()
  loading.value = false
})
const getCurrentEmployee = async () => {
  const { employee } = await getEmployee(employeeId.value)
  currentEmployee.value = employee
  newEmployeeNumber.value = currentEmployee.value.employee_number
}
const fetchMaxEmployeeNumber = async () => {
  const { result } = await getMaxEmployeeNumber()
  maxEmployeeNumber.value = result
  newEmployeeNumber.value = currentEmployee.value.employee_number
}
const onOpen = () => {
  changeStatusPopup.value = !changeStatusPopup.value
}
const openResetPasswordConfirmation = () => {
  resetPasswordPopup.value = !resetPasswordPopup.value
}

const onSubmitResetPassword = async () => {
  if (currentEmployee.value.user.id) {
    const { success, message } = await resetPassword(currentEmployee.value.user.id)
    if (success) {
      await sleep(200);
      notif.success(t('toast.success.reset_password'))
    }
    else {
      await sleep(200);
      notif.error(message)

    }
    resetPasswordPopup.value = false
  }
  else return


}

const changestatusUser = async () => {
  const userData = currentEmployee.value
  var userForm = currentChangeStatusUser.value
  userForm.id = userData.user.id
  userForm.user_status_id = userData.user.status?.id
  await changeUserStatus(userForm)
  getCurrentEmployee()

  notif.dismissAll()
  await sleep(200)
  notif.success(t('toast.success.edit'))
  changeStatusPopup.value = false
}
const fetchEmployee = async () => {
  const { employee } = await getEmployee(employeeId.value)
  employeeForm.employeeServicesForm.splice(0, employeeForm.employeeServicesForm.length)
  employeeForm.originalServices.splice(0, employeeForm.originalServices.length)

  employee.services.forEach((service) => {
    employeeForm.employeeServicesForm.push({ service_id: service.service?.id ?? 0, price: service.price })
    employeeForm.originalServices.push({ service_id: service.service?.id ?? 0, price: service.price })
  });
  employeeForm.userForm.id = employee.user.id
  employeeForm.userForm.first_name = employee.user.first_name
  employeeForm.userForm.last_name = employee.user.last_name
  employeeForm.userForm.gender = employee.user.gender
  employeeForm.userForm.birth_date = employee.user.birth_date
  employeeForm.userForm.phone_number = employee.user.phone_number
  employeeForm.userForm.address = employee.user.address
  employeeForm.userForm.room_id = employee.user.room.id
  employeeForm.userForm.city_id = employee.user.city.id
  employeeForm.userForm.roles = employee.user.roles?.map(function (element) { return element.name }) ?? []
  employeeForm.userForm.user_status_id = employee.user.status.id
  employeeForm.userForm.default_role_id = employee.user.default_role?.id
  employeeForm.dataUpdate.starting_date = employee.starting_date
  employeeForm.dataUpdate.basic_salary = employee.basic_salary
  employeeForm.dataUpdate.end_date = employee?.end_date
  employeeForm.dataUpdate.nationality_id = employee.nationality.id
  employeeForm.dataUpdate.position_id = employee.position.id
  employeeForm.dataUpdate.type = employee.type
  employeeForm.dataUpdate.id = employeeId.value
  employeeForm.dataUpdate.payment_percentage = employee.payment_percentage
}
const onClickEditServices = async () => {
  await fetchEmployee()
  router.push({
    path: `/employee-edit/${employeeId.value}/services`
  })
}

const onClickEditMainInfo = async () => {
  await fetchEmployee()
  router.push({
    path: `/employee-edit/${employeeId.value}`,
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
    media.forEach((mediaElemnt) => {
      employeeFiles.value.push(mediaElemnt)
    })
  }
}

const onAddFile = async (event: any) => {
  const file = event.target.files[0] as File
  let _message = ''
  if (file) {
    if (
      file.type != 'image/jpeg' &&
      file.type != 'image/png' &&
      file.type != 'image/webp' &&
      file.type != 'application/pdf'
    ) {
      _message = t('toast.file.type')
      await sleep(200)
      notif.error(_message)
    } else if (file.size > 2 * 1024 * 1024) {
      _message = t("toast.file.size")
      await sleep(200)
      notif.error(_message)
    } else {
      filesToUpload.value = file
    }
  }
}
const UploadFile = async () => {
  uploadLoading.value = true
  let formData = new FormData()
  if (filesToUpload.value != undefined) formData.append('images[]', filesToUpload.value)

  const { success, message, media } = await addEmployeeFile(employeeId.value, formData)

  if (success) {

    await sleep(200)

    notif.success(t('toast.success.add'))
    media[0].file_name = media[0].relative_path
    media[0].relative_path = import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

    employeeFiles.value.push(media[0])
    filesToUpload.value = undefined
    uploadLoading.value = false
    return true
  } else {

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

    await sleep(200)

    notif.success(t('toast.success.remove'))

    employeeFiles.value.splice(
      employeeFiles.value.findIndex((element) => element.id == deleteFileId.value),
      1
    )
    deleteFilePopup.value = false
    deleteLoading.value = false

    return true
  } else {
    deleteLoading.value = false


    await sleep(200)

    notif.error(message)
  }
}

const editProfilePicture = async () => {
  updateProfilePicturePopup.value = true
}
const onEditProfilePicture = async (error: any, fileInfo: any) => {
  if (error) {

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
    employeeProfilePicture.value.id != undefined &&
    profilePictureToUpload.value != undefined
  ) {
    const { message, success } = await deleteFile(employeeProfilePicture.value.id)
    _success = success
    _message = message
  } else if (
    employeeProfilePicture.value.id != undefined ||
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
      employeeId.value,
      formData
    )

    if (success) {

      await sleep(200)

      notif.success(t('toast.success.edit'))
      employeeProfilePicture.value = media[0]
      employeeProfilePicture.value.relative_path =
        import.meta.env.VITE_MEDIA_BASE_URL + media[0].relative_path

      keyIncrement.value++
      updateProfilePicturePopup.value = false
      profilePictureToUpload.value = undefined
      uploadLoading.value = false
    } else {

      await sleep(200)

      notif.error(message)
      keyIncrement.value++
      uploadLoading.value = false
      profilePictureToUpload.value = undefined

      updateProfilePicturePopup.value = false
    }
  } else {

    await sleep(200)
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
      await sleep(200)

      notif.success(t('toast.success.remove'))
      employeeProfilePicture.value = defaultEmployeeProfilePic
    } else {
      await sleep(200)

      notif.error(message)
    }
    profilePictureToUpload.value = undefined
    keyIncrement.value++
    deleteLoading.value = false

    updateProfilePicturePopup.value = false
  }
}
const validationSchema = employeeNumberEditValidationSchema
const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    employee_number: newEmployeeNumber.value
  }

})
const onSubmitEditEmployeeNumber = handleSubmit(async (values) => {
  if (
    newEmployeeNumber.value == undefined ||
    newEmployeeNumber.value == currentEmployee.value.employee_number
  ) {
    editEmployeeNumberTrigger.value = false
    return
  }
  updateLoading.value = true
  const { message, success } = await updateEmployeeNumber(
    employeeId.value,
    newEmployeeNumber.value
  )
  if (success) {
    currentEmployee.value.employee_number = newEmployeeNumber.value
    editEmployeeNumberTrigger.value = false
    await fetchMaxEmployeeNumber()

    notif.dismissAll()
    await sleep(200)


    notif.success(t('toast.success.edit'))
    await sleep(500)
  } else {
    await sleep(200)


    notif.error(message)
  }
  updateLoading.value = false

})
const permissionCheck = async () => {
  if (tab.value == 'Tickets' && !checkPermission(Permissions.TICKET_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Services' && !checkPermission(Permissions.SERVICE_PROVIDER_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Cash Receipts' && !checkPermission(Permissions.CLIENT_CASH_RECEIPT_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Ticket Services' && !checkPermission(Permissions.TICKET_SERVICE_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Details' && !checkPermission(Permissions.EMPLOYEE_SHOW)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Files' && !checkPermission(Permissions.MEDIA_ACCESS)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Balances' && !checkPermission(Permissions.JOURNAL_ENTRY_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'History Record' && !checkPermission(Permissions.EMPLOYEE_RECORD_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }
  if (tab.value == 'Availability History' && !checkPermission(Permissions.EMPLOYEES_AVAILABILITY_HISTORY_LIST)) {
    notif.error({ message: t('toast.error.no_permission'), duration: 4000 })
  }

}
const setAccountBalance = (accountBalance: string, accountCurrency: string) => {
  employeeAccountCurrentBalance.value = accountBalance
  employeeAccountCurrency.value = accountCurrency
}
const toggleAvailability = async () => {
  const { message, success } = await toggleEmployeeAvailability(currentEmployee.value.id ?? 0)
  if (success) {
    notif.success(t('toast.success.edit'))
    currentEmployee.value.is_available = !currentEmployee.value.is_available
    keyIncrement.value++

  } else {
    notif.error({ message: message, duration: 3000 })
  }

}

</script>
<template>
  <div class="profile-wrapper">
    <VLoader size="large" :active="loading">
      <div class="profile-header has-text-centered">
        <VAvatar v-if="employeeProfilePicture.id == undefined" size="xl"
          :picture="MediaConsts.getAvatarIcon(currentEmployee.user.gender)"
          :edit="checkPermission(Permissions.MEDIA_CREATE)" @edit="editProfilePicture" />
        <VAvatar v-else size="xl" :picture="employeeProfilePicture.relative_path"
          :edit="checkPermission(Permissions.MEDIA_CREATE)" @edit="editProfilePicture" />

        <h3 class="title is-4 is-narrow is-thin">
          <span v-permission="Permissions.EMPLOYEE_AVAILABILITY_TOGGLE" v-if="currentEmployee.services.length > 0" @dblclick="toggleAvailability" class="clickable-cursor">
            <i class="fas fa-circle ml-0" :class="currentEmployee.is_available ? 'has-text-success' : 'has-text-danger'"
              aria-hidden="true"></i>
          </span>
          {{ currentEmployee.user.first_name }} {{ currentEmployee.user.last_name }}
        </h3>
        <div class="profile-stats">
          <div class="profile-stat">
            <i aria-hidden="true" class="fas fa-city"></i>
            <span>{{ currentEmployee.user.city.name }}</span>
          </div>
          <div class="separator"></div>
          <div class="profile-stat">
            <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
            <span>{{ t('employee.details.status') }}:
              <span v-if="currentEmployee.is_dismissed == true"
                :class="`has-text-${EmployeeStatusConsts.getStatusColor(EmployeeStatusConsts.DISMISSED)}`">{{
                  EmployeeStatusConsts.getStatusName(EmployeeStatusConsts.DISMISSED)
                }}</span></span>

            <span v-if="currentEmployee.is_dismissed == false"
              :class="`has-text-${UserStatusConsts.getStatusColor(currentEmployee.user.status.id)}`">{{
                UserStatusConsts.getStatusName(currentEmployee.user.status.id)
              }}</span>
          </div>
          <div class="separator"></div>
          <div class="profile-stat">
            <i class="lnir lnir-medal-alt" aria-hidden="true"></i>
            <span>{{ t('employee.details.roles') }}:
              <span v-if="currentEmployee.user.roles" v-for="(role, index) in currentEmployee.user.roles">
                {{ role.display_name }} {{ index != currentEmployee.user.roles?.length - 1 ? ' | ' : '' }} </span>
            </span>
          </div>

        </div>
      </div>
    </VLoader>

    <div class="project-details">
      <div class="tabs-wrapper is-9-slider">
        <div :hidden="loading" class="tabs-inner">
          <div class="tabs tabs-width">
            <ul>
              <li @click="permissionCheck()" :class="[tab === 'Details' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Details'" @click="tab = 'Details'"><span>{{
                  t('employee.details.tabs.details')
                }}</span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Services' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Services'" @click="tab = 'Services'"><span>{{
                  t('employee.details.tabs.services')
                }}</span></a>
              </li>

              <li @click="permissionCheck()" :class="[tab === 'Files' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Files'" @click="tab = 'Files'"><span>{{
                  t('employee.details.tabs.files')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Tickets' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Tickets'" @click="tab = 'Tickets'"><span>{{
                  t('employee.details.tabs.tickets')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Ticket Services' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Ticket Services'" @click="tab = 'Ticket Services'"><span>{{
                  t('employee.details.tabs.ticket_services')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Cash Receipts' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Cash Receipts'" @click="tab = 'Cash Receipts'"><span>{{
                  t('employee.details.tabs.cash_receipts')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Balances' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Balances'" @click="tab = 'Balances'"><span>{{
                  t('employee.details.tabs.balances')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'History Record' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'History Record'" @click="tab = 'History Record'"><span>{{
                  t('employee.details.tabs.history_record')
                }} </span></a>
              </li>
              <li @click="permissionCheck()" :class="[tab === 'Availability History' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Availability History'"
                  @click="tab = 'Availability History'"><span>{{
                    t('employee.details.tabs.availability_history')
                  }} </span></a>
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
                    <h3>{{ t('employee.details.main_details') }}</h3>
                  </div>
                  <div class="buttons">
                    <VButton v-permission="Permissions.EMPLOYEE_EDIT" @click.prevent="onOpen" color="dark">
                      {{ t('employee.table.modal_title.status') }}
                    </VButton>
                    <VButton v-permission="Permissions.RESET_PASSWORD" @click.prevent="openResetPasswordConfirmation"
                      class="mr-0" color="dark">
                      {{ t('employee.details.reset_password_button') }}
                    </VButton>
                    <VIconButton v-permission="Permissions.EMPLOYEE_EDIT" size="small" icon="feather:edit-3" tabindex="0"
                      @click="onClickEditMainInfo" />
                  </div>
                </div>

                <div class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-user"></i>
                    <h4>{{ t('employee.details.name', { title: viewWrapper.pageTitle }) }}</h4>
                    <p>
                      {{ currentEmployee.user.first_name }}
                      {{ currentEmployee.user.last_name }}
                    </p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" :class="currentEmployee.user.gender == 'Male'
                      ? 'lnir lnir-male'
                      : 'lnir lnir-female'
                      "></i>
                    <h4>{{ t('employee.details.gender') }}</h4>
                    <p>{{ t(`gender.${currentEmployee.user.gender.toLowerCase()}`) }}</p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-calendar"></i>
                    <h4>{{ t('employee.details.birth_date') }}</h4>
                    <p>{{ currentEmployee.user.birth_date }}</p>
                  </div>
                  <div class="project-feature">
                    <i class="fas fa-id-badge" aria-hidden="true"></i>
                    <h4>{{ t('employee.details.position') }}</h4>
                    <p>{{ currentEmployee.position.name }}</p>
                  </div>
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-phone"></i>
                    <h4>{{ t('employee.details.phone_number') }}</h4>
                    <p>{{ currentEmployee.user.phone_number }}</p>
                  </div>
                </div>

                <div class="project-files">
                  <h4>{{ t('employee.details.more_info') }}</h4>
                  <div class="columns is-multiline">
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.starting_date') }}</span>
                          <span>
                            {{ currentEmployee.starting_date }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.end_date') }}</span>
                          <span>
                            {{ currentEmployee.end_date ?? t('place_holder.none') }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.department') }}</span>
                          <span>
                            {{ currentEmployee?.user?.room?.department?.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.room_number') }}</span>
                          <span>
                            {{ currentEmployee?.user?.room?.number }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.basic_salary') }}{{ addParenthesisToString(mainCurrency.name)
                          }}</span>
                          <span>
                            {{ currentEmployee.basic_salary }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.payment_percentage') }}</span>
                          <span>
                            {{ currentEmployee.payment_percentage }}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.nationality') }}</span>
                          <span>
                            {{ currentEmployee.nationality?.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.address') }}</span>
                          <span>
                            {{ currentEmployee.user.address }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta full-width">
                          <div class="is-justify-content-space-between is-align-items-flex-start is-flex mt-2 ">
                            <div class="columns is-multiline">
                              <span class="column is-12 pb-0" :class="editEmployeeNumberTrigger ? 'required' : ''">{{
                                t('employee.details.employee_number') }}</span>
                              <span v-if="!editEmployeeNumberTrigger" class="column py-2">
                                {{ currentEmployee.employee_number ?? 'None' }}
                              </span>
                              <div v-else class="column is-12 mb-0 pb-0">
                                <form @submit.prevent="onSubmitEditEmployeeNumber">

                                  <VField id="employee_number">
                                    <VControl icon="feather:hash">
                                      <VInput type="number" v-model="newEmployeeNumber" />
                                      <ErrorMessage name="employee_number" class="is-size-7 mt-1 has-text-danger" />
                                    </VControl>
                                  </VField>
                                </form>

                              </div>

                              <div v-if="editEmployeeNumberTrigger"
                                class="column is-12 has-text-info is-size-7 mt-0 pt-2">
                                {{ t('employee.details.last_employee_number') }}: {{ maxEmployeeNumber ?? 0 }}
                              </div>
                            </div>
                            <div>
                              <VIconButton v-permission="Permissions.EMPLOYEE_EDIT" v-if="!editEmployeeNumberTrigger"
                                class="mb-3 mx-2" icon="feather:edit-3" tabindex="0"
                                @click="editEmployeeNumberTrigger = true" />
                              <VIconButton :loading="updateLoading" v-if="editEmployeeNumberTrigger" class="mx-2"
                                icon="feather:x" tabindex="0" @click="editEmployeeNumberTrigger = false" />
                              <VIconButton :loading="updateLoading" type="submit" v-if="editEmployeeNumberTrigger"
                                class="mx-2" icon="feather:check-square" color="primary" tabindex="0"
                                @click="onSubmitEditEmployeeNumber" />

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
        <div v-if="tab === 'Services'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <div class="card-head pb-4 border-buttom">
                  <div class="title-wrap">
                    <h3>{{ t('employee.details.services') }}</h3>
                  </div>
                  <VIconButton v-permission="Permissions.SERVICE_PROVIDER_EDIT" size="small" icon="feather:edit-3"
                    tabindex="0" @click="onClickEditServices" />
                </div>
                <div v-if="checkPermission(Permissions.SERVICE_PROVIDER_LIST)">
                  <div v-if="currentEmployee.services.length == 0" class="project-features">
                    <div class="project-feature">
                      <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                      <h4>{{ t('employee.details.tabs_content_placeholder.services') }}</h4>
                    </div>
                  </div>
                  <div class="project-files">
                    <div class="columns is-multiline border-buttom" v-for="service in currentEmployee.services"
                      :key="service.service.id">

                      <div class="column is-6">
                        <div class="file-box">
                          <div class="meta">
                            <span>{{ t('employee.details.service_name') }}</span>
                            <span>
                              {{ service.service.name }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="file-box">
                          <div class="meta">
                            <span>{{ t('employee.details.service_price') }}</span>
                            <span>
                              {{ service.price }} {{ addParenthesisToString(mainCurrency.name) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{ t('toast.error.no_permission') }}</h4>
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
                    <h3>{{ t('employee.details.employee_files') }}</h3>
                  </div>
                </div>
                <div v-if="checkPermission(Permissions.MEDIA_ACCESS)">
                  <div v-if="employeeFiles.length == 0" class="project-features">
                    <div class="project-feature">
                      <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                      <h4>{{ t('employee.details.tabs_content_placeholder.files') }}</h4>
                    </div>
                  </div>
                  <div v-permission="Permissions.MEDIA_CREATE" class="project-files project-section">
                    <h4>{{ t('employee.details.upload_file') }}</h4>
                    <div class="is-flex is-justify-content-space-between">
                      <VField class="mr-6" grouped>
                        <VControl>
                          <div class="file has-name">
                            <label class="file-label">
                              <input class="file-input" type="file" v-on:change="onAddFile" />
                              <span class="file-cta">
                                <span class="file-icon">
                                  <i class="fas fa-cloud-upload-alt"></i>
                                </span>
                                <span class="file-label"> {{ t('images.image_name_placeholder') }} </span>
                              </span>
                              <span class="file-name light-text">
                                {{ filesToUpload?.name ?? t('images.image_select_file') }}
                              </span>
                            </label>
                          </div>
                        </VControl>
                      </VField>
                      <VLoader size="small" :active="uploadLoading">
                        <VButton v-if="filesToUpload != undefined" @click="UploadFile" class=""
                          icon="lnir lnir-add-files rem-100" light dark-outlined>
                          {{ t('employee.details.upload') }}
                        </VButton>
                      </VLoader>
                    </div>
                    <h6 class="ml-2 mt-2 help">
                      {{ t('images.accepted_file') }}
                    </h6>
                  </div>
                  <div v-if="employeeFiles.length != 0" class="project-files project-section">
                    <div>
                      <h4>{{ t('employee.details.tabs.files') }}</h4>
                      <div class="columns is-multiline">
                        <div v-for="(file, index) in employeeFiles" class="column is-6">
                          <div class="file-box is-flex is-justify-content-space-between">
                            <div class="file-box">

                              <img :src="MediaConsts.getMediaIcon(file.mime_type ?? '')" alt="" />
                              <div class="meta">
                                <span class="file-link">
                                  <a target="_blank" class="file-link" :href="file.relative_path">
                                    {{ (index + 1) + ' ' + (file.mime_type ?? '') }}</a>
                                </span>
                                <span>
                                  {{
                                    file.size != undefined
                                    ? (file.size / (1024 * 1024)).toFixed(2)
                                    : 'Unknown'
                                  }}
                                  {{ file.size != undefined ? t('images.megabyte') : '' }}
                                  <i aria-hidden="true" class="fas fa-circle"></i>
                                  {{ file.created_at }}
                                  <i aria-hidden="true" class="fas fa-circle"></i>
                                  {{ t('images.by') }} {{ file.uploaded_by?.first_name
                                  }}{{ file.uploaded_by?.last_name }}
                                </span>
                              </div>
                            </div>
                            <VIconButton v-if="file.id" class="is-right is-dots is-spaced dropdown end-action mr-2"
                              size="small" icon="feather:trash" tabindex="0" color="danger"
                              @click="onDeleteFile(file.id ?? 0)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{ t('toast.error.no_permission') }}</h4>
                  </div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'Tickets'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <TicketTable is-for-employee :employee-id="employeeId" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'Ticket Services'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <TicketServiceTable is-for-employee :employee-id="employeeId" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'Cash Receipts'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <SupplierEmployeeCashReceiptsTable is-for-employee :employee-id="employeeId" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'Balances'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card py-5">
                <div class="card-head my-1">
                  <div class="title-wrap">
                    <h3>{{ t('employee.details.current_balance') }} <span
                        :class="employeeAccountCurrentBalance.includes('-') ? 'has-text-danger' : 'has-text-primary'">{{
                          employeeAccountCurrentBalance }}</span> {{ addParenthesisToString(employeeAccountCurrency) }}</h3>
                  </div>
                </div>
              </div>
              <div class="project-details-card">
                <JournalEntryTable is-for-employee :employee-id="employeeId" @update-balance="setAccountBalance" />
              </div>
            </div>
          </div>

        </div>
        <div v-if="tab === 'History Record'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <EmployeesHistoryTable is-for-employee :employee-id="employeeId" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'Availability History'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <EmployeeAvailabilityHistoryTable is-for-employee :employee-id="employeeId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <VModal :title="t('employee.table.modal_title.status')" :open="changeStatusPopup" actions="center"
    @close="changeStatusPopup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField class="column" id="user_status_id">
                <VLabel>{{ t('employee.details.employee_status') }}</VLabel>
                <VControl>
                  <VSelect v-if="currentEmployee.user.status" v-model="currentEmployee.user.status.id">
                    <VOption value="">{{ t('employee.details.select_employee_status') }}</VOption>
                    <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
                      UserStatusConsts.getStatusName(status.id)
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
  <VModal :title="t('employee.table.modal_title.delete_file')" :open="deleteFilePopup" actions="center"
    @close="deleteFilePopup = false">
    <template #content>
      <VPlaceholderSection :title="t('employee.table.modal_title.placeholderSection.title')"
        :subtitle="t('employee.table.modal_title.placeholderSection.subtitle')" />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="deleteLoading">
        <VButton color="primary" raised @click="removefile()">{{ t('modal.buttons.confirm') }}</VButton>
      </VLoader>
    </template>
  </VModal>
  <VModal :key="keyIncrement" :title="t('employee.table.modal_title.profile_picture')" :open="updateProfilePicturePopup"
    actions="center" @close="updateProfilePicturePopup = false">
    <template #content>
      <VField class="is-flex is-justify-content-center">
        <VControl>
          <VFilePond size="large" class="profile-filepond" name="profile_filepond" :chunk-retry-delays="[500, 1000, 3000]"
            label-idle="<i class='lnil lnil-cloud-upload'></i>"
            :accepted-file-types="['image/png', 'image/jpeg', 'image/webp']" :image-preview-height="140"
            :image-resize-target-width="140" :image-resize-target-height="140" image-crop-aspect-ratio="1:1"
            style-panel-layout="compact circle" style-load-indicator-position="center bottom"
            style-progress-indicator-position="right bottom" style-button-remove-item-position="left bottom"
            style-button-process-item-position="right bottom" @addfile="onEditProfilePicture" />
        </VControl>
      </VField>
      <h6 class="is-flex is-justify-content-center help">
        {{ t('images.accepted_image_file') }}
      </h6>
    </template>

    <template #action="{ close }">
      <VLoader size="small" :active="deleteLoading">
        <VButton v-if="employeeProfilePicture.id != undefined" color="danger" outlined class="mr-2"
          @click="RemoveProfilePicture">
          {{ t('modal.buttons.delete') }}</VButton>
      </VLoader>
      <VLoader size="small" :active="uploadLoading">
        <VButton color="primary" raised @click="UploadProfilePicture">{{ t('modal.buttons.update') }}</VButton>
      </VLoader>
    </template>
  </VModal>
  <VModal :title="t('employee.details.reset_password_confirm_popup.title')" :open="resetPasswordPopup" actions="center"
    @close="resetPasswordPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('employee.details.reset_password_confirm_popup.confirmation')"
        :subtitle="t('employee.details.reset_password_confirm_popup.caution')" />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="authStore.loading">
        <VButton color="primary" raised @click="onSubmitResetPassword">{{ t('modal.buttons.confirm') }}
        </VButton>
      </VLoader>
    </template>
  </VModal>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.profile-wrapper {
  max-width: 100%;
}

.tabs-width {
  min-width: 1250px;
  min-height: 40px;

  .is-active {
    min-height: 40px;

  }
}

.tabs-wrapper.is-9-slider .tabs li a,
.tabs-wrapper-alt.is-9-slider .tabs li a {
  height: 40px;

}

.tabs li {
  min-height: 38px !important;

}


.file-link {
  color: var(--primary-grey) !important;
}

.file-link:hover {
  color: var(--primary) !important;
}

.full-width {
  width: 100%;
  margin-right: 12px;
}

.availability-pointer {
  position: fixed;
  top: 30px;
  right: 0;
}

.clickable-cursor {
  cursor: pointer;
}
</style>
