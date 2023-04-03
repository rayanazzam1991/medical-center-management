<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>
  
<script lang="ts" setup>
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { User, defaultUser } from '/@src/models/Others/User/user';
import { useAuth } from '/@src/stores/Others/User/authStore';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('dashboards.title'))
const user = ref<User>(defaultUser)
const userAuth = useAuth();
user.value = userAuth.getUser() ?? defaultUser
const userRole = user?.value?.roles?.at(0)?.name as 'Admin' | 'Accountant' | 'Human_Resources' | 'Inventory' | 'Service_Provider' | 'Receptionist'

useHead({
  title: t('dashboards.title'),
})
</script>

<template>
  <div class="page-content-inner">
    <MyDashboard v-if="user.roles" :role="userRole" />
  </div>
</template>
