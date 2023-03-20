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



const notif = useNotyf() as Notyf
const userAuth = useAuth();
const employeeStore = useEmployee();
const router = useRouter();
const { t, locale } = useI18n();
const user = ref<Partial<User>>(userAuth.getUser());
const userFullName = ref('')
const loggedEmployee = ref<Employee>()
userFullName.value = userAuth.getUserFulLName()
loggedEmployee.value = employeeStore.getEmployee()
const changePasswordPopup = ref(false)
const changePasswordPopupConfirmation = ref(false)
const loggedEmployeeProfilePic = ref(defaultEmployeeProfilePic)
const changePasswordData = ref<ChangePassword>(defaultChangePassword)
const keyIncrement = ref(0)
const passwordPattern = new RegExp(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/)
const passwordMatchPattern = ref(false)
const passwordMatchConfirmation = ref(false)

if (loggedEmployee.value) {

  if (loggedEmployee.value.id) {

    const profilePic = await getProfilePicture(loggedEmployee.value.id)
    if (profilePic.media.length != 0) {
      loggedEmployeeProfilePic.value = profilePic.media[profilePic.media.length - 1]
    }
  }
}

const LR = locale.value == "ar" ? "left" : "right"
const logoutUser = async () => {
  try {
    await userAuth.logoutUser();
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


</script>
<template>
  <VDropdown LR spaced class="user-dropdown profile-dropdown">
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
        <VAvatar size="large" picture="/images/avatars/svg/vuero-1.svg" />
        <div class="meta">
          <span>{{ userFullName }}</span>
          <!-- <span>Product Manager</span> -->
        </div>
      </div>

      <!-- <a href="#" role="menuitem" class="dropdown-item is-media">
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-user-alt"></i>
            </div>
            <div class="meta">
              <span>Profile</span>
              <span>View your profile</span>
            </div>
          </a> -->

      <!-- <hr class="dropdown-divider" />

          <a href="#" role="menuitem" class="dropdown-item is-media">
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-briefcase"></i>
            </div>
            <div class="meta">
              <span>Projects</span>
              <span>All my projects</span>
            </div>
          </a> -->

      <!-- <a href="#" role="menuitem" class="dropdown-item is-media">
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-users-alt"></i>
            </div>
            <div class="meta">
              <span>Team</span>
              <span>Manage your team</span>
            </div>
          </a> -->

      <!-- <hr class="dropdown-divider" />

          <a href="#" role="menuitem" class="dropdown-item is-media">
            <div class="icon">
              <i aria-hidden="true" class="lnil lnil-cog"></i>
            </div>
            <div class="meta">
              <span>Settings</span>
              <span>Account settings</span>
            </div>
          </a> -->

      <hr class="dropdown-divider" />

      <div class="dropdown-item is-button">
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
            <div class="column is-12 pr-0 is-flex is-jsutify-content-center is-align-items-center">

              <div class="column is-11 pl-0">
                <VField class="column">
                  <VLabel>{{ t('user_profile_dropdown.change_password_popup.password') }}</VLabel>
                  <VControl>
                    <VInput :icon="passwordMatchPattern ? 'feather:check' : 'feather:x'" @input="checkPassword"
                      v-model="changePasswordData.password" type="password" />
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
                  <VLabel>{{ t('user_profile_dropdown.change_password_popup.password_confirmation') }}</VLabel>
                  <VControl>
                    <VInput @input="checkPasswordConfirmation" v-model="changePasswordData.password_confirmation"
                      type="password" />
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
</style>
