<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "user_show"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('User')
useHead({
    title: 'User',
})
</script>

<template>
    <UserDetails />
</template>
