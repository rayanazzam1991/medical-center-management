<script setup lang="ts">
import { Notyf } from "notyf";
import { useI18n } from "vue-i18n";
import { useNotyf } from "/@src/composable/useNotyf";
import { defaultEmployeeProfilePic, Employee } from "/@src/models/Employee/employee";
import { MediaConsts } from "/@src/models/Others/Media/media";
import { ChangePassword, defaultChangePassword } from "/@src/models/Others/User/auth";
import { defaultUser, User } from "/@src/models/Others/User/user";
import { getProfilePicture } from "/@src/services/Employee/employeeService";
import { changePassword } from "/@src/services/Others/User/authService";
import { useEmployee } from "/@src/stores/Employee/employeeStore";
import { useAuth } from "/@src/stores/Others/User/authStore";
import { Permissions } from "/@src/utils/consts/rolesPermissions";
import { useCurrency } from "/@src/stores/Accounting/Currency/currencyStore";
import { useSetting } from "/@src/stores/Others/Setting/settingStore";



const notif = useNotyf() as Notyf
const userAuth = useAuth();
const currencyStore = useCurrency();
const settingStore = useSetting();
const employeeStore = useEmployee();
const router = useRouter();
const { t, locale } = useI18n();
const user = ref<User>(defaultUser);
user.value = userAuth.getUser() ?? defaultUser
const userFullName = ref('')
const loggedEmployee = ref<Employee>()
userFullName.value = userAuth.getUserFulLName()
loggedEmployee.value = employeeStore.getEmployee()
const changePasswordPopup = ref(false)
const changePasswordPopupConfirmation = ref(false)
const loggedEmployeeProfilePic = ref(defaultEmployeeProfilePic)
const changePasswordData = ref<ChangePassword>(defaultChangePassword)
const keyIncrement = ref(0)
const passwordPattern = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
const passwordMatchPattern = ref(false)
const passwordMatchConfirmation = ref(false)
const showPasswordConfirmaion = ref(false)
const showPassword = ref(false)
const showCurrentPassword = ref(false)

if (loggedEmployee.value) {

  if (loggedEmployee.value.id) {
    loggedEmployeeProfilePic.value = loggedEmployee.value.media?.find((media) => media.is_featured) ?? defaultEmployeeProfilePic
    loggedEmployeeProfilePic.value.relative_path = MediaConsts.MEDIA_BASE_URL + loggedEmployeeProfilePic.value.relative_path
  }
}

const LR = locale.value == "ar" ? "left" : "right"
const logoutUser = async () => {
  try {
    await userAuth.logoutUser();
    employeeStore.removeFromStorage();
    currencyStore.removeFromStorage();
    settingStore.removeFromStorage();
    await router.push({
      name: '/auth/login'
    })
  } catch (err: any) {
    throw err;
  }

}
const openChangePassword = () => {
  changePasswordData.value.password = ''
  changePasswordData.value.password_confirmation = ''
  changePasswordData.value.current_password = ''
  passwordMatchPattern.value = false
  passwordMatchConfirmation.value = false
  keyIncrement.value++
  changePasswordPopup.value = true
}
const openChangePasswordConfirmation = () => {
  if (changePasswordData.value.password !== changePasswordData.value.password_confirmation) {
    notif.error({ message: t('toast.error.password_confirmation_no_match'), duration: 4000 })
    return
  } else if (!passwordPattern.test(changePasswordData.value.password)) {
    notif.error({ message: t('toast.error.password_dont_match_pattern'), duration: 4000 })

  } else {
    keyIncrement.value++
    changePasswordPopupConfirmation.value = true
  }
}
const onSubmitChangePassword = async () => {
  if (changePasswordData.value.password !== changePasswordData.value.password_confirmation) {
    notif.error({ message: t('toast.error.password_confirmation_no_match'), duration: 4000 })
    return
  } else {
    changePasswordData.value.user_id = user.value.id ?? 0
    const { message, success } = await changePassword(changePasswordData.value)
    if (success) {
      notif.success(t('toast.success.password_changed'))
      changePasswordPopupConfirmation.value = false
      changePasswordPopup.value = false
      await logoutUser()
    } else {
      notif.error({ message: message, duration: 4000 })
    }
  }
}
const checkPassword = () => {
  passwordMatchPattern.value = passwordPattern.test(changePasswordData.value.password)
  checkPasswordConfirmation()
}
const checkPasswordConfirmation = () => {
  passwordMatchConfirmation.value = changePasswordData.value.password === changePasswordData.value.password_confirmation
  checkPassword()
}
const onClickViewMyWaitingList = () => {
  router.push({ path: `/employee/${loggedEmployee.value?.id}/waiting-list` })
}
const toggleShowPassowordConfirmation = () => {
  showPasswordConfirmaion.value = !showPasswordConfirmaion.value

}
const toggleShowPassoword = () => {
  showPassword.value = !showPassword.value
}
const toggleShowCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

</script>
<template>
  <VDropdown :right="true" spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a tabindex="0" class="is-trigger dropdown-trigger" aria-haspopup="true" @keydown.space.prevent="toggle"
        @click="toggle">
        <VAvatar v-if="!loggedEmployee"
          :picture="MediaConsts.getAvatarIcon(user.gender ? user.gender : 'not_selected')" />

        <VAvatar v-else-if="loggedEmployeeProfilePic.id == undefined"
          :picture="MediaConsts.getAvatarIcon(loggedEmployee.user.gender)" />

        <VAvatar v-else :picture="loggedEmployeeProfilePic.relative_path" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar v-if="!loggedEmployee"
          :picture="MediaConsts.getAvatarIcon(user.gender ? user.gender : 'not_selected')" />

        <VAvatar v-else-if="loggedEmployeeProfilePic.id == undefined"
          :picture="MediaConsts.getAvatarIcon(loggedEmployee.user.gender)" />

        <VAvatar v-else :picture="loggedEmployeeProfilePic.relative_path" />
        <div class="meta mr-4">
          <div>
            <span class="is-size-7">{{ t('user_profile_dropdown.name') }}</span>
            <span class="is-size-5">{{ userFullName }}</span>
          </div>
        </div>
      </div>

      <a role="menuitem" class="dropdown-item is-media no-cursor">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt"></i>
        </div>
        <div class="mr-2">
          <h1>{{ t('user_profile_dropdown.roles') }}</h1>
          <span class="is-size-6" v-if="user.roles" v-for="(role, index) in user.roles">{{ role.display_name }}
            {{ index != user.roles?.length - 1 ? ' | ' : '' }}</span>
        </div>
      </a>
      <div class="dropdown-item is-button mt-2">
        <VButton v-permission="Permissions.SHOW_WAITING_LIST_SERVE_CLIENT" class=" logout-button mb-2" icon="feather:list"
          color="info" role="menuitem" @click="onClickViewMyWaitingList" raised fullwidth>
          {{ t('user_profile_dropdown.view_my_waiting_list') }}
        </VButton>

        <VButton v-permission="Permissions.CHANGE_PASSWORD" class=" logout-button mb-2" icon="carbon:password"
          color="info" role="menuitem" @click="openChangePassword" raised fullwidth>
          {{ t('user_profile_dropdown.change_password') }}
        </VButton>
        <VButton class="logout-button" icon="feather:log-out" color="primary" role="menuitem" @click="logoutUser" raised
          fullwidth>
          {{ t('user_profile_dropdown.logout') }}
        </VButton>
      </div>
    </template>
  </VDropdown>
  <VModal class="is-disabled" :title="t('user_profile_dropdown.change_password_popup.title')" :open="changePasswordPopup"
    actions="center" @close="changePasswordPopup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="columns is-multiline">
            <div class="column is-12">
              <VField class="column">
                <div class="is-flex is-align-items-center">
                  <span class="label ml-2">{{ t('user_profile_dropdown.change_password_popup.current_password')
                  }}</span>
                  <span @click="toggleShowCurrentPassword">
                    <i aria-hidden="true" class="iconify clickable" data-icon="feather:eye"></i>
                  </span>
                </div>
                <VControl>
                  <VInput v-model="changePasswordData.current_password"
                    :type="showCurrentPassword ? 'text' : 'password'" />
                </VControl>
              </VField>
            </div>
            <div class="column is-12 pr-0 is-flex is-jsutify-content-center is-align-items-center">
              <div class="column is-11 pl-0">
                <VField class="column">
                  <div class="is-flex is-align-items-center">
                    <span class="label ml-2">{{ t('user_profile_dropdown.change_password_popup.password')
                    }}</span>
                    <span @click="toggleShowPassoword">
                      <i aria-hidden="true" class="iconify clickable" data-icon="feather:eye"></i>
                    </span>
                  </div>
                  <VControl>
                    <VInput @input="checkPassword" v-model="changePasswordData.password"
                      :type="showPassword ? 'text' : 'password'" />
                  </VControl>
                  <p class="is-info help">{{ t('user_profile_dropdown.change_password_popup.helper') }}</p>
                </VField>
              </div>
              <div class="column is-1 p-0 pt-2">
                <i v-if="passwordMatchPattern" class="fas fa-check is-size-4 has-text-success" aria-hidden="true"></i>
                <i v-else class="fas fa-times is-size-4 has-text-danger" aria-hidden="true"></i>
              </div>
            </div>
            <div class="column is-12 pr-0 is-flex is-jsutify-content-center is-align-items-center">

              <div class="column is-11 pl-0">
                <VField class="column">
                  <div class="is-flex is-align-items-center">
                    <span class="label ml-2">{{ t('user_profile_dropdown.change_password_popup.password_confirmation')
                    }}</span>
                    <span @click="toggleShowPassowordConfirmation">
                      <i aria-hidden="true" class="iconify clickable" data-icon="feather:eye"></i>
                    </span>
                  </div>
                  <VControl>
                    <VInput @input="checkPasswordConfirmation" v-model="changePasswordData.password_confirmation"
                      :type="showPasswordConfirmaion ? 'text' : 'password'" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-1 p-0 pt-5">
                <i v-if="passwordMatchConfirmation" class="fas fa-check-double is-size-4 has-text-success"
                  aria-hidden="true"></i>
                <i v-else class="fas fa-times is-size-4 has-text-danger" aria-hidden="true"></i>
              </div>

            </div>

          </div>
        </div>
      </form>
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="openChangePasswordConfirmation()">{{ t('modal.buttons.confirm') }}</VButton>
    </template>
  </VModal>
  <VModal :title="t('user_profile_dropdown.change_password_popup_confirmation.title')"
    :open="changePasswordPopupConfirmation" actions="center" @close="changePasswordPopupConfirmation = false">
    <template #content>
      <VPlaceholderSection :title="t('user_profile_dropdown.change_password_popup_confirmation.confirmation')"
        :subtitle="t('user_profile_dropdown.change_password_popup_confirmation.caution')" />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="userAuth.loading">
        <VButton color="primary" raised @click="onSubmitChangePassword">{{ t('modal.buttons.confirm') }}
        </VButton>
      </VLoader>
    </template>
  </VModal>
</template>
<style lang="scss" scoped>
.no-cursor {
  cursor: default;
}

.meta {
  .h1 {
    display: block;
  }
}

.label {
  font-family: var(--font);
  font-size: 0.9rem;
  color: var(--light-text) !important;
  font-weight: 400;
  margin-bottom: 0.5em;
  cursor: pointer;
}

.clickable {
  cursor: pointer;

  &:hover {
    color: var(--primary);
  }
}
</style>
