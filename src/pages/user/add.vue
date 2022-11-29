<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VRadio from '/@src/components/base/form/VRadio.vue'
import { addUser } from '/@src/composable/Others/User/addUser'
import { User } from '/@src/utils/api/Others/User'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('User')

const head = useHead({
    title: 'Add User',
})


</script>

<template>
    <UserForm :formType="'Add'" />
</template>
