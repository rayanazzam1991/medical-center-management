<script setup lang="ts">
import { useHead } from '@vueuse/head'

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
