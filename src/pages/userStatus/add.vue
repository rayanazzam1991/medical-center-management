<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue'
import { addUserStatus } from '/@src/composable/Others/UserStatus/addUserStatus'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('UserStatus')

const head = useHead({
    title: 'Add UserStatus',
})


</script>

<template>
    <UserStatusForm :formType="'Add'" />
</template>
