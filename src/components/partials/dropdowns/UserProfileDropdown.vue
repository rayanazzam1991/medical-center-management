<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { User } from "/@src/models/Others/User/user";
import { useAuth } from "/@src/stores/Others/User/authStore";

const userAuth = useAuth();
const router = useRouter();
const {t,locale} = useI18n();
const user = ref<Partial<User>>(userAuth.getUser());
const userFullName = ref('')
userFullName.value = userAuth.getUserFulLName()
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
</script>
<template>
  <VDropdown LR spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a tabindex="0" class="is-trigger dropdown-trigger" aria-haspopup="true" @keydown.space.prevent="toggle"
        @click="toggle">
        <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
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
          {{t('user_profile_dropdown.logout')}}
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
