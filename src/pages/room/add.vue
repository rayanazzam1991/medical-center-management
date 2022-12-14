<script setup lang="ts">
import { useHead } from '@vueuse/head'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Room')

const head = useHead({
    title: 'Add Room',
})


</script>

<template>
    <RoomForm :formType="'Add'" />
</template>
